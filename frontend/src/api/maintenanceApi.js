// src/api/maintenanceApi.js
import axiosInstance from "./axiosInstance";

// 내 차량 목록 조회
export async function getMyRegisteredCars() {
  const response = await axiosInstance.get("/maintenance/cars");

  return response.data;
}

// 내 차량 등록
export async function createMyCar(carData) {
  const response = await axiosInstance.post("/maintenance/cars", carData);

  return response.data;
}

// 내 차량 수정
export async function updateMyCar(carId, carData) {
  const response = await axiosInstance.put(`/maintenance/cars/${carId}`, carData);

  return response.data;
}

// 내 차량 삭제
export async function deleteMyCar(carId) {
  const response = await axiosInstance.delete(`/maintenance/cars/${carId}`);

  return response.data;
}

// 정비 이력 조회
export async function getMaintenanceHistories(carId) {
  const response = await axiosInstance.get(`/maintenance/cars/${carId}/histories`);

  return response.data;
}

// 정비 이력 등록
export async function createMaintenanceHistory(carId, historyData) {
  const response = await axiosInstance.post(
    `/maintenance/cars/${carId}/histories`,
    historyData
  );

  return response.data;
}