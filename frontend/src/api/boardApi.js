// src/api/boardApi.js
import axiosInstance from "./axiosInstance";

// 게시글 목록 조회
export async function getBoards(params) {
  const response = await axiosInstance.get("/boards", {
    params,
  });

  return response.data;
}

// 게시글 상세 조회
export async function getBoardDetail(boardId) {
  const response = await axiosInstance.get(`/boards/${boardId}`);

  return response.data;
}

// 게시글 등록
export async function createBoard(boardData) {
  const response = await axiosInstance.post("/boards", boardData);

  return response.data;
}

// 게시글 수정
export async function updateBoard(boardId, boardData) {
  const response = await axiosInstance.put(`/boards/${boardId}`, boardData);

  return response.data;
}

// 게시글 삭제
export async function deleteBoard(boardId) {
  const response = await axiosInstance.delete(`/boards/${boardId}`);

  return response.data;
}