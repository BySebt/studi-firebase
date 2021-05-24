import { lazy } from 'react'

const Dashboard = lazy(() => import('../pages/Dashboard'))
const Tasks = lazy(() => import('../pages/Tasks'))
const Page404 = lazy(() => import('../pages/404'))
const Blank = lazy(() => import('../pages/About'))
const Profile = lazy(() =>import('../pages/Profile'))
const Create = lazy(() => import('../pages/Create'))
const Revise = lazy(() => import('../pages/Revise'))

const routes = [
  {
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/tasks',
    component: Tasks,
  },
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/create',
    component: Create,
  },
  {
    path: '/profile',
    component: Profile,
  },
  {
    path: '/about',
    component: Blank,
  },
  {
    path: '/revise',
    component: Revise,
  },
]

export default routes
