import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import AddFlat from './components/addFlats.jsx';
import AllFlats from './components/AllFlats.jsx';
import MyProfiles from './components/MyProfiles.jsx';
import UsersProfiles from './components/UsersProfiles.jsx';


const router = createBrowserRouter([

  {path:'/login',element:<Login />},
  {path:'/register',element:<Register />},



  {
    path: '/', element: <Home />, children: [
      { path: 'all-flats', element: <AllFlats /> },
      { path: 'my-flats', element: <MyFlats /> },
      { path: 'favorite-flats', element: <FavoriteFlats /> },
      { path: 'add-flat', element: <AddFlat /> },

    ]
  },
  {
    path: '/my-profiles', element: <MyProfiles />, children: [
      { path: 'users-profiles', element: <UsersProfiles /> },
    ]
  },
  
//   {

//   path:'/register',
//   element:<Register/>
// },
// {
//   path: '/login',
//   element:<Login />
// },
// {
//   path: '/home',
//   element:<Home />
// },

])


ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />-

  
  </AuthProvider>

)