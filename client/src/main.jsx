import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext";
import { RoleProvider } from "./context/RoleContext.jsx";
import { WalletProvider } from "./context/WalletContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RoleProvider>
        <WalletProvider>
          <App />
        </WalletProvider>
      </RoleProvider>
    </AuthProvider>
  </StrictMode>,
)
