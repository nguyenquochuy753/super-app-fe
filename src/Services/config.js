import axios from "axios";
import { localService } from "./localService";
import { store } from "../redux/store";
import {
  handleLoadingOff,
  handleLoadingOn,
} from "../redux/reducer/spinnerSlice";

export const BASE_URL = "https://movienew.cybersoft.edu.vn/api/";
// export const MOVIE_URL = "http://localhost:2000/api/";
export const MOVIE_URL = "https://movie-api-vpbe.onrender.com/api/";
// export const SHOWTIME_URL = "http://localhost:2002/api/";
export const SHOWTIME_URL = "https://showtime-api-k9kq.onrender.com/api/";
// export const CINEMA_URL = "http://localhost:8001/";
export const CINEMA_URL = "https://cinema-api-61nr.onrender.com/";
// export const USER_URL = "http://localhost:8000/";
export const USER_URL = "https://user-api-btn4.onrender.com/";
// export const TICKET_URL = "http://localhost:2003/api/";
export const TICKET_URL = "https://ticket-api-a67j.onrender.com/api/";
export const PAYMENT_URL = "http://localhost:8888/order/";

export const TOKEN_CYBER =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJoYWNrZXIiLCJIZXRIYW5TdHJpbmciOiIxMi8xMi8yMDI1IiwiSGV0SGFuVGltZSI6IjE3NjU0NzI0MDAwMDAiLCJpYXQiOjE3MDIzNTg4NTcsImV4cCI6MTcwMjM1OTQ1N30.q0H9Y1q7OB7Y7JoAPumlXATPbMYgMeGpkC_bkAsHP6Q";

export const configHeaders = () => {
  return { TokenCybersoft: TOKEN_CYBER };
};

// axios instance
export const httpsDefault = axios.create({
  baseURL: BASE_URL,
  headers: {
    TokenCybersoft: TOKEN_CYBER,
    Authorization: "Bearer " + localService.get()?.accessToken,
  },
});

export const httpsShowtime = axios.create({
  baseURL: SHOWTIME_URL,
  headers: {
    // TokenCybersoft: TOKEN_CYBER,
    Authorization: "Bearer " + localService.get()?.accessToken,
  },
});

export const httpsCinema = axios.create({
  baseURL: CINEMA_URL,
  headers: {
    // TokenCybersoft: TOKEN_CYBER,
    Authorization: "Bearer " + localService.get()?.accessToken,
  },
});

export const httpsTicket = axios.create({
  baseURL: TICKET_URL,
  headers: {
    // TokenCybersoft: TOKEN_CYBER,
    Authorization: "Bearer " + localService.get()?.accessToken,
  },
});

export const httpsPayment = axios.create({
  baseURL: PAYMENT_URL,
  headers: {
    // TokenCybersoft: TOKEN_CYBER,
    Authorization: "Bearer " + localService.get()?.accessToken,
  },
});

export const https = axios.create({
  baseURL: USER_URL,
  headers: {
    // TokenCybersoft: TOKEN_CYBER,
    Authorization: "Bearer " + localService.get()?.accessToken,
  },
});
// interceptor  : can thiệp vào request và response từ api

https.interceptors.request.use(
  function (config) {
    store.dispatch(handleLoadingOn());
    // console.log("api đi");
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
https.interceptors.response.use(
  function (response) {
    store.dispatch(handleLoadingOff());
    // console.log("api về");
    return response;
  },
  function (error) {
    store.dispatch(handleLoadingOff());
    return Promise.reject(error);
  }
);
