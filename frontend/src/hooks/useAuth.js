// src/hooks/useAuth.js
import { useEffect, useState } from "react";
import {
  clearAuthInfo,
  getAccessToken,
  getLoginUser,
  saveAuthInfo,
} from "../utils/authStorage";

export function useAuth() {
  const [loginUser, setLoginUser] = useState(() => getLoginUser());
  const [accessToken, setAccessToken] = useState(() => getAccessToken());

  useEffect(() => {
    const handleAuthChange = () => {
      setLoginUser(getLoginUser());
      setAccessToken(getAccessToken());
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const login = ({ token, user }) => {
    saveAuthInfo(token, user);
    setAccessToken(token);
    setLoginUser(user);
  };

  const logout = () => {
    clearAuthInfo();
    setAccessToken(null);
    setLoginUser(null);
  };

  return {
    loginUser,
    accessToken,
    isLogin: Boolean(accessToken && loginUser),
    login,
    logout,
  };
}