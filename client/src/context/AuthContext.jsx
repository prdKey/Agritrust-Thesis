import { createContext, useEffect, useContext, useState } from "react";
import { getToken, saveToken, removeToken } from "../services/authService";
import {listenWalletDisconnect} from "../services/walletListener.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [jwt, setJwt] = useState(getToken());
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

  const loginWithJwt = (token) => {
    saveToken(token);
    setJwt(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeToken();
    setJwt(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    listenWalletDisconnect(logout);
  }, []);

  
  return (
    <AuthContext.Provider value={{ jwt, isAuthenticated, loginWithJwt, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
