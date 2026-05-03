import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://o-leak-backend.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Attach Bearer token to every request automatically
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;