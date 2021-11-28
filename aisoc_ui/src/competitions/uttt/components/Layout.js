import Navbar from 'components/NavBar';

export default function Layout({ children, competitionBaseUrl }) {
  return <>
    <Navbar competitionName='Ultimate Tic-Tac-Toe' homepageUrl={competitionBaseUrl} />
    <div className="maxwidth">
      {children}
    </div>
  </>;
}
