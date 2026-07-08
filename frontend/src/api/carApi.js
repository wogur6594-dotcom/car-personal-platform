// src/api/carApi.js
import axiosInstance from "./axiosInstance";

// 중고차 매물 목록 조회
export async function getCars(params) {
  const response = await axiosInstance.get("/cars", {
    params,
  });

  return response.data;
}

// 중고차 매물 상세 조회
export async function getCarDetail(carId) {
  const response = await axiosInstance.get(`/cars/${carId}`);

  return response.data;
}

// 중고차 매물 등록
export async function createCar(carData) {
  const response = await axiosInstance.post("/cars", carData);

  return response.data;
}

// 중고차 매물 수정
export async function updateCar(carId, carData) {
  const response = await axiosInstance.put(`/cars/${carId}`, carData);

  return response.data;
}

// 중고차 매물 삭제
export async function deleteCar(carId) {
  const response = await axiosInstance.delete(`/cars/${carId}`);

  return response.data;
}

// 내 매물 목록 조회
export async function getMyCars() {
  const response = await axiosInstance.get("/cars/my");

  return response.data;
}

// 찜하기
export async function likeCar(carId) {
  const response = await axiosInstance.post(`/cars/${carId}/likes`);

  return response.data;
}

// 찜 취소
export async function unlikeCar(carId) {
  const response = await axiosInstance.delete(`/cars/${carId}/likes`);

  return response.data;
}