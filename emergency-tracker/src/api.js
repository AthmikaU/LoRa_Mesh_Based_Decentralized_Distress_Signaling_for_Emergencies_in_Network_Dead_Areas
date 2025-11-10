import axios from "axios";

// deployed backend URL when hosted
export const API_URL = "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
});
