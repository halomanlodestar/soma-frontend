/** @format */

import axios from "axios";

const API_PATH = "http://localhost:8000/api/v1";

export const client = axios.create({
  baseURL: API_PATH,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (!token) throw Error("Unauthorized");

  config.headers.Authorization = `Bearer ${token}`;

  return config;
});
