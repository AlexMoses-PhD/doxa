use crate::schema::agents;

use diesel::{Insertable, Queryable};

#[derive(Debug, Clone, Queryable)]
pub struct AgentUpload {
    pub id: String,
    pub owner: i32,
    pub competition: i32,
    pub extension: String,
    pub uploaded: bool,
    pub deleted: bool,
    pub failed: bool,
}

#[derive(Debug, Clone, Insertable)]
#[table_name = "agents"]
pub struct InsertableAgentUpload {
    pub id: String,
    pub owner: i32,
    pub competition: i32,
    pub extension: String,
}
