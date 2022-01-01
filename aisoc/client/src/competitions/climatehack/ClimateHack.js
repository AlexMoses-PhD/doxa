import Container from 'components/Container';
import Navbar from 'components/Navbar';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Challenge from './pages/Challenge';
import Home from './pages/Home';
import Splash from './pages/Splash';
import User from './pages/User';


function Layout({ children }) {
  return <>
    <Navbar competition="climatehack" competitionName="Climate Hack" />
    <Container>{children}</Container>
  </>;
}


export default function ClimateHack() {
  const { path } = useRouteMatch();

  return <Switch>
    <Route path={`${path}user/:user`}>
      <Layout>
        <User baseUrl={path} />
      </Layout>
    </Route>
    <Route path={`${path}compete`}>
      <Layout>
        <Home baseUrl={path} />
      </Layout>
    </Route>
    <Route path={`${path}challenge`}>
      <Challenge baseUrl={path} />
    </Route>
    <Route path={path}>
      <Splash baseUrl={path} />
    </Route>
  </Switch>;
}
