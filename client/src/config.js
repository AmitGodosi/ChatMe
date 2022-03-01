import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://amitgodosi-chat.herokuapp.com/api",
});
