import axios from "axios";

const api = axios.create({
  baseURL: "http://13.201.135.53:8081/api",
  withCredentials: true, 
});

export default api;
