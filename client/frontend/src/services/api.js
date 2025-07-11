import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 422)
    ) {
      localStorage.removeItem("tipo");
      localStorage.removeItem("email");
      localStorage.removeItem("token");
      localStorage.removeItem("nome");

      if (window.location.pathname !== "/") {
        alert("A sua sessão expirou. Por favor, faça login novamente.");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
