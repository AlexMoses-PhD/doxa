use actix_multipart::Multipart;
use actix_web::{web, HttpResponse};
use doxa_auth::guard::AuthGuard;
use doxa_core::tokio::io::AsyncWriteExt;
use doxa_core::EndpointResult;
use doxa_db::PgPool;
use doxa_mq::MQPool;
use futures::{StreamExt, TryStreamExt};

use crate::{
    error::{CouldNotWriteFile, FileMissing, UploadMultipartError},
    LocalStorage,
};

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.route("/storage/upload/{competition}", web::post().to(upload));
}

async fn upload(
    pool: web::Data<PgPool>,
    mq_pool: web::Data<MQPool>,
    storage: web::Data<LocalStorage>,
    mut payload: Multipart,
    path: web::Path<String>,
    auth: AuthGuard<()>,
) -> EndpointResult {
    let competition = path.into_inner();
    // Check if the user is enrolled
    let enrollment = web::block({
        let user_id = auth.user();
        let competition = competition.clone();
        let pool = pool.clone();
        let conn = web::block(move || pool.get()).await??;
        move || doxa_auth::controller::is_enrolled(&conn, user_id, competition)
    })
    .await??;

    let mut field = payload
        .try_next()
        .await
        .map_err(UploadMultipartError::from)?
        .ok_or(FileMissing)?;

    let (mut f, id) = storage
        .create_file(competition.clone())
        .await
        .map_err(CouldNotWriteFile::from)?;

    web::block({
        let user_id = auth.user();
        let pool = pool.clone();
        let id = id.clone();
        let conn = web::block(move || pool.get()).await??;
        move || crate::controller::register_upload_start(&conn, id, user_id, enrollment.competition)
    })
    .await??;

    // TODO: In future these kinds of errors should result in the file being cleaned up
    // and the database field updated indicating the error
    while let Some(chunk) = field.next().await {
        let data = chunk.map_err(|e| UploadMultipartError::from(e))?;
        f.write_all(&data)
            .await
            .map_err(|e| CouldNotWriteFile::from(e))?;
    }

    web::block({
        let conn = web::block(move || pool.get()).await??;
        let id = id.clone();
        move || crate::controller::mark_upload_as_complete(&conn, id)
    })
    .await??;

    let mq_conn = mq_pool.get().await?;
    doxa_mq::action::emit_upload_event(
        &mq_conn,
        &doxa_mq::model::UploadEvent {
            competition,
            agent: id,
        },
    )
    .await?;

    Ok(HttpResponse::Ok().into())
}
