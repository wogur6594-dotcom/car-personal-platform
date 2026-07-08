// src/api/memberApi.js
import axiosInstance from "./axiosInstance";

// 마이페이지 회원 정보 조회
export async function getMyInfo() {
  const response = await axiosInstance.get("/members/me");

  return response.data;
}

// 회원 정보 수정
export async function updateMyInfo(memberData) {
  const response = await axiosInstance.put("/members/me", memberData);

  return response.data;
}

// 비밀번호 변경
export async function changePassword(passwordData) {
  const response = await axiosInstance.put("/members/me/password", passwordData);

  return response.data;
}

// 회원 탈퇴
export async function deleteMyAccount() {
  const response = await axiosInstance.delete("/members/me");

  return response.data;
}