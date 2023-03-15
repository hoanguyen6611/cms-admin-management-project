import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://some-domain.com/api/",
  headers: { "Content-Type": "application/json" },
});
axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export default axiosClient;
