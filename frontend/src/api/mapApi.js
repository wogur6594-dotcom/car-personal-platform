// src/api/mapApi.js
import axiosInstance from "./axiosInstance";

// 주유소 목록 조회
export async function getGasStations(params) {
  const response = await axiosInstance.get("/places/gas-stations", {
    params,
  });

  return response.data;
}

// 정비소 목록 조회
export async function getRepairShops(params) {
  const response = await axiosInstance.get("/places/repair-shops", {
    params,
  });

  return response.data;
}

// 장소 상세 조회
export async function getPlaceDetail(placeId) {
  const response = await axiosInstance.get(`/places/${placeId}`);

  return response.data;
}