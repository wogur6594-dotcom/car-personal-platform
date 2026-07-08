import { useEffect, useState } from "react";

const STORAGE_KEY = "car_personal_login_user";

export function useAuth() {
  const [loginUser, setLoginUser] = useState(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const handleStorage = () => {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      setLoginUser(savedUser ? JSON.parse(savedUser) : null);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = (user) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setLoginUser(user);
    window.dispatchEvent(new Event("storage"));
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setLoginUser(null);
    window.dispatchEvent(new Event("storage"));
  };

  return {
    loginUser,
    isLogin: Boolean(loginUser),
    login,
    logout,
  };
}
