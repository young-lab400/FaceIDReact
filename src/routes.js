import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Blog from './pages/Blog';
import User from './pages/User';
import UserEdit from './pages/UserEdit';
import UserRegister from './pages/UserRegister';
import Record from './pages/Record';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';
import Products from './pages/Products';
import DashboardApp from './pages/DashboardApp';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'Record', element: <Record /> },
        {path:'UserRegister',element: <UserRegister/>},
        { path: 'UserEdit', element: <UserEdit />, children:[{path:':paras',element:<></>}] },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> },
      ],
    },
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: 'register',
      element: <Register />,
    },
     {
       path: '/',
       element: <LogoOnlyLayout />,
       children: [
         { path: '/', element: <Navigate to="/dashboard/app" /> },
         { path: '404', element: <NotFound /> },
         { path: '*', element: <Navigate to="/404" /> },
       ],
    },
     {
       path: '*',
       element: <Navigate to="/404" replace />,
     },
  ]);
}
