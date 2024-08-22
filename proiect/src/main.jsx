import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter,Navigate,RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext.jsx';

import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import AddFlat from './components/addFlats.jsx';
import AllFlats from './components/AllFlats.jsx';
import MyProfiles from './components/MyProfiles.jsx';
import UsersProfiles from './components/UsersProfiles.jsx';
import MyFlats from './components/MyFlats.jsx';
import FavoriteFlats from './components/FavoriteFlats.jsx';

const router = createBrowserRouter([{
  path:'/',
  element:<Home/>,
 
},
 {
  path:'/login',
  element:<Login />
 },
 {
  path:'/register',
  element:<Register />
 },
 {
  path:'/my-flats',
  element:<MyFlats />
 },
 {
  path:'/add-flat',
  element:<AddFlat/>
 }
 ,
 {
 path:'/all-flats',
 element:<AllFlats />
 },
 {
   path:'/my-profiles',
   element:<MyProfiles />
 },
 {
  path:'/users-profiles',
  element:<UsersProfiles />
 },
 {
  path:'/favorite-flats',
  element:<FavoriteFlats />
 },
 {
 path:'/all-flats',
 element:<AllFlats />
 }


])


ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />-

  
  </AuthProvider>

)