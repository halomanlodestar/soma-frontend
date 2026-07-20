/** @format */

import axios from "axios";

const API_PATH = "http://localhost:8000/api/v1";

export const client = axios.create({
  baseURL: API_PATH,
});
