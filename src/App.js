import React, { lazy } from 'react'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import AccessibleNavigationAnnouncer from './components/Misc/AccessibleNavigationAnnouncer'

const Layout = lazy(() => import('./components/Containers/DashboardLayout'))
const Login = lazy(() => import('./pages/Login'))
const CreateAccount = lazy(() => import('./pages/SignUp'))
const LandingPage = lazy(() => import('./pages/LandingPage'))

function App() {
  return (
    <>
      <Router>
        <AccessibleNavigationAnnouncer />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/create-account" component={CreateAccount} />
          <Route path="/app" component={Layout} />
          <Route path="/" component={LandingPage} />
        </Switch>
      </Router>
    </>
  )
}

export default App
