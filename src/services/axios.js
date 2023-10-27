import axios from "axios";

const axiosInstanse = axios.create({
  baseURL: "https://date.nager.at/api/v3",
  headers:{
    'Content-Type': 'application/json'
  }
});

export default axiosInstanse;