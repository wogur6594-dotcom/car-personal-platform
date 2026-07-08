// src/utils/authStorage.js

export const ACCESS_TOKEN_KEY = "accessToken";
export const LOGIN_USER_KEY = "loginUser";

export function saveAuthInfo(accessToken, loginUser) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(loginUser));
  window.dispatchEvent(new Event("authChange"));
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getLoginUser() {
  const savedUser = localStorage.getItem(LOGIN_USER_KEY);

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch (error) {
    console.error("로그인 유저 정보 파싱 오류:", error);
    return null;
  }
}

export function clearAuthInfo() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(LOGIN_USER_KEY);
  window.dispatchEvent(new Event("authChange"));
}