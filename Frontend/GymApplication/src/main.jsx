import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import { Toaster } from "react-hot-toast"
import { KindeProvider } from "@kinde-oss/kinde-auth-react";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <KindeProvider
       clientId="0977e354075849b2a93183c13bdc9f07"
       domain="https://alfaintellitech.kinde.com"
       redirectUri="http://localhost:3000/callback"
       logoutUri="http://localhost:3000/home"
       scope="openid profile email offline_access roles" 
    >
      <App />
      <Toaster />
    </KindeProvider>
  </StrictMode>
)
