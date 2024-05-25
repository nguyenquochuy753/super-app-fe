import React, { Fragment, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  bookTicket,
  createTicket,
  getTicketRoom,
  createPayment,
} from "../../Services/api";
import "./ticket.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  addTicket,
  clearThongTinDatVe,
  handlePayments,
} from "../../redux/reducer/bookingReducer";
import { localService } from "../../Services/localService";
import { ThongTinDatVe } from "../../model/ThongTinDatVe";

import Swal from "sweetalert2";
import { Radio, Space } from "antd";

export default function BookTicketDesktop() {
  const param = useParams();
  const [ticketRoom, setTicketRoom] = useState({});
  let navigate = useNavigate();
  const onChange = (e) => {
    dispatch(handlePayments(e.target.value));
  };
  let dispatch = useDispatch();
  let { danhSachGheDangDat, isDisabled, classBtnBuyTicket, radioValue } =
    useSelector((state) => state.bookingReducer);

  let fetchThongTinPhongVe = () => {
    getTicketRoom(param.id)
      .then((res) => {
        setTicketRoom(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  let switchToProfile = () => {
    navigate("/profile");
    window.location.reload();
  };
  useEffect(() => {
    fetchThongTinPhongVe();
  }, []);

  const handleBookTicket = async () => {
    // console.log(radioValue);
    let thongTinDatVe = new ThongTinDatVe();
    thongTinDatVe.user = localService.get()?._id;
    thongTinDatVe.listSeat = danhSachGheDangDat.map((seat) => seat._id);
    Swal.fire({
      title: "Bạn có muốn thanh toán ?",
      icon: "info",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
      showDenyButton: true,
      denyButtonText: `Cancel`,
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Bạn đã thanh toán thành công!",
          "Vui lòng kiểm tra lịch sử đặt vé.",
          "success"
        );
        const newTicket = await createTicket({
          user: localService.get()?._id,
          showtimeId: param.id,
          seatId: danhSachGheDangDat.map((seat) => seat._id),
          paymentMethod: radioValue == 3 ? "atm" : "cash",
        });

        await bookTicket({
          user: localService.get()?._id,
          listSeat: danhSachGheDangDat.map((seat) => seat._id),
        })
          .then((res) => {
            setTimeout(() => {
              fetchThongTinPhongVe();
              dispatch(clearThongTinDatVe());
            }, 1500);
          })
          .catch((err) => {
            console.log(err.response.data.content);
          });
        if (radioValue == 3) {
          const payURL = await createPayment({
            orderId: newTicket.data._id,
            amount: danhSachGheDangDat.reduce((tongTien, giaVe) => {
              return (tongTien += giaVe.price);
            }, 0),
            bankCode: "VNBANK",
            language: "vn",
          });
          window.location.href = payURL.data;
        }
      } else if (result.isDenied) {
        Swal.fire("Bạn có muốn mua thêm vé không ?", "", "info");
      }
    });
  };

  const renderSeats = () => {
    return ticketRoom.listSeat?.map((item, index) => {
      let classGheVip = item.type === "Vip" ? "gheVip" : "";
      let classGheDaDat = item.isBook ? "gheDaDat" : "";
      let indexGheDangChon = danhSachGheDangDat.findIndex((gheDangDat) => {
        return gheDangDat._id === item._id;
      });
      let cssGheDangDat = "";
      let classGheDaDuocDat = "";
      if (localService.get()?._id === item.user) {
        classGheDaDuocDat = "gheDaDuocDat";
      }
      if (indexGheDangChon !== -1) {
        cssGheDangDat = "gheDangDat";
      }
      return (
        <Fragment key={index}>
          <button
            onClick={() => {
              dispatch(addTicket(item));
            }}
            disabled={item.isBook}
            className={`ghe ${classGheVip} ${classGheDaDat} ${cssGheDangDat} ${classGheDaDuocDat}`}
          >
            {item.isBook ? (
              classGheDaDuocDat !== "" ? (
                <i className="fa-regular fa-user"></i>
              ) : (
                <i className="fa-solid fa-x"></i>
              )
            ) : (
              item.name
            )}
          </button>
          {(index + 1) % 16 === 0 ? <br /> : ""}
        </Fragment>
      );
    });
  };
  let renderTenGhe = () => {
    return danhSachGheDangDat.map((item, index) => {
      return <Fragment key={index}>{item.name} </Fragment>;
    });
  };
  return (
    <div className="mb-10">
      <div
        style={{
          background: `url(${ticketRoom.infoMovie?.movieImage})top center/cover no-repeat `,
          marginBottom: "40px",
          minHeight: "210px",
          position: "relative",
        }}
      >
        <div
          style={{
            background: `rgba(0,0,0,0.6)`,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <div className="text-center ">
            <div className="container">
              <h1 className="font-semibold py-20 inline-block text-4xl text-white">
                Đặt Vé
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div id="bookTicket">
        <div className="grid grid-cols-3 gap-8 hangGhe ">
          <div className="col-span-2 container flex flex-col items-center">
            <div className="w-full">
              <div
                className="bg-black "
                style={{ width: "100%", height: 15 }}
              ></div>
              <div className="trapezoid text-center mb-4">
                <h3 className=" text-black">Màn Hình</h3>
              </div>
            </div>
            <div>{renderSeats()}</div>
            <div className="flex justify-center items-center space-x-3 mt-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border border-black rounded leading-10 text-center">
                  <i className="fa-solid fa-x"></i>
                </div>
                <p>Ghế đã được mua</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-orange-400 rounded"></div>
                <p>Ghế Vip</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-slate-200 rounded "></div>
                <p>Ghế thường</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 gheDangDat rounded "></div>
                <p>Ghế đang chọn</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 gheDaDuocDat rounded leading-10 text-center">
                  <i className="fa-regular fa-user"></i>
                </div>
                <p>Ghế bạn đã mua</p>
              </div>
            </div>
          </div>
          <div
            id="info__ticket"
            className="border-2 border-gray-400 p-4 shadow-lg mr-5"
          >
            <h3 className="text-center p-10 text-3xl text-orange-400 font-bold">
              {danhSachGheDangDat
                .reduce((tongTien, giaVe) => {
                  return (tongTien += giaVe.price);
                }, 0)
                .toLocaleString()}
              VND
            </h3>

            <div className="billTitle">
              <p className="text-2xl">{ticketRoom.infoMovie?.movieName}</p>
              <p>{ticketRoom.infoMovie?.theaterComplexName}</p>
              <p>
                {ticketRoom.infoMovie?.premiereDate}
                <span className="text-black mx-3">~</span>
                {ticketRoom.infoMovie?.premiereTime}
                <span className="text-black mx-3">-</span>
                {ticketRoom.infoMovie?.theaterName}
              </p>
            </div>
            <div className="billTitle flex justify-between">
              <p>Email</p>
              <span>{localService.get()?.email}</span>
            </div>
            <div className="billTitle flex justify-between">
              <p>Số điện thoại</p>
              <span>{localService.get()?.soDT}</span>
            </div>

            <div className="billTitle flex justify-between">
              <p>Ghế</p>
              <span>{renderTenGhe()}</span>
            </div>
            <div className="px-4 py-6">
              <p className="font-semibold mb-4">Chọn phương thức thanh toán</p>
              <Radio.Group
                disabled={isDisabled}
                onChange={onChange}
                value={radioValue}
              >
                <Space direction="vertical">
                  <Radio value={1}>
                    <div className="flex items-center justify-between px-4">
                      <img
                        src="../image/icon-ZaloPay.webp"
                        width={40}
                        alt="ZaloPay"
                      />
                      <span className="text-lg ml-4">
                        Thanh toán qua ZaloPay
                      </span>
                    </div>
                  </Radio>
                  <Radio value={2}>
                    <div className="flex items-center justify-between px-4">
                      <img
                        className="rounded-xl"
                        src="../image/icon_momo.png"
                        width={40}
                        alt="momo"
                      />
                      <span className="text-lg ml-4">Thanh toán qua MoMo</span>
                    </div>
                  </Radio>
                  <Radio value={3}>
                    <div className="flex items-center justify-between px-4">
                      <img
                        src="../image/icon_atm.png"
                        width={40}
                        alt="icon_atm"
                      />
                      <span className="text-lg ml-4">Thanh toán qua ATM</span>
                    </div>
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
            <button
              disabled={isDisabled}
              onClick={() => {
                handleBookTicket();
              }}
              className={`w-full py-3 mt-3 ${classBtnBuyTicket} font-bold text-white rounded  duration-300`}
            >
              Đặt vé
            </button>

            <NavLink onClick={switchToProfile}>
              <p className="text-center text-blue-400 hover:text-blue-700">
                <i>Lịch sử đặt vé</i>
              </p>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
