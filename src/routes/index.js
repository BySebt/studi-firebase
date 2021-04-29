import { lazy } from 'react'

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Tasks = lazy(() => import('../pages/Tasks'))
const Page404 = lazy(() => import('../pages/404'))
const Blank = lazy(() => import('../pages/About'))
const Profile = lazy(() =>import('../pages/Profile'))
const Create = lazy(() => import('../pages/Create'))

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
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
]

export default routes
