import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';


const router = createBrowserRouter([{
  path:'/register',
  element:<Register/>
},
{
  path: '/login',
  element:<Login />
},
{
  path: '/home',
  element:<Home />
},

])


ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router}>

    </RouterProvider>
  </AuthProvider>

)