import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext.jsx';
import Register from './components/Register.jsx';


const router = createBrowserRouter([{
  parth:'/',
  element:<Register/>
}])


ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router}>

    </RouterProvider>
  </AuthProvider>

)