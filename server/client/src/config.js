import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://amitgodosichat.herokuapp.com/api/",
});
