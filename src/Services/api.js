import axios from "axios";
import {
  BASE_URL,
  CINEMA_URL,
  configHeaders,
  https,
  httpsCinema,
  httpsDefault,
  httpsShowtime,
  httpsTicket,
  MOVIE_URL,
} from "./config";

export let dangNhap = (values) => {
  return https.post("users/login", values);
};
export let getBanner = () => {
  return axios({
    url: `${MOVIE_URL}banner`,
    method: "GET",
    headers: configHeaders(),
  });
};
export let getListMovie = () => {
  return axios({
    url: `${MOVIE_URL}movies`,
    method: "GET",
    headers: configHeaders(),
  });
};

export let getInfoMovie = (id) => {
  return axios({
    url: `${MOVIE_URL}movies/${id}`,
    method: "GET",
    headers: configHeaders(),
  });
};
export let userRegister = (values) => {
  return https.post("users/register", values);
};
export let getMovieTheater = () => {
  return axios({
    url: `${CINEMA_URL}cinemaSystem/theatercomplex`,
    method: "GET",
    headers: configHeaders(),
  });
};
export let getInfoShowtimes = (id) => {
  return axios({
    url: `${CINEMA_URL}cinemaSystem/movies/${id}`,
    method: "GET",
    headers: configHeaders(),
  });
};
export let getTicketRoom = (id) => {
  return httpsShowtime.get(`showtimes/info/${id}`);
};
export let bookTicket = (values) => {
  return httpsCinema.post("seat/booking", values);
};

export let createTicket = (values) => {
  return httpsTicket.post("ticket/create", values);
};

export let getThongTinTaiKhoan = (id) => {
  return httpsTicket.get(`ticket/user/${id}`);
};

export let updateUserInfo = (values) => {
  return https.put("QuanLyNguoiDung/CapNhatThongTinNguoiDung", values);
};
