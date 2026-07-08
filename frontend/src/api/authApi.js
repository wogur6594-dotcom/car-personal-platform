// src/api/authApi.js
import axiosInstance from "./axiosInstance";

// 로그인
export async function login(loginData) {
  const response = await axiosInstance.post("/auth/login", loginData);

  return response.data;
}

// 회원가입
export async function signUp(signUpData) {
  const response = await axiosInstance.post("/auth/signup", signUpData);

  return response.data;
}

// 로그아웃
export async function logout() {
  const response = await axiosInstance.post("/auth/logout");

  localStorage.removeItem("accessToken");
  localStorage.removeItem("loginUser");

  return response.data;
}

// 내 로그인 정보 조회
export async function getLoginUser() {
  const response = await axiosInstance.get("/auth/me");

  return response.data;
}