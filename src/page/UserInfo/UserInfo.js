import React, { Fragment, useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
import "./userInfo.scss";
import { getThongTinTaiKhoan, updateUserInfo } from "../../Services/api";
import moment from "moment/moment";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { localService } from "../../Services/localService";

export default function UserInfo() {
  const [thongTinUser, setThongTinUser] = useState({});
  console.log("😐 ~ UserInfo ~ thongTinUser:👉", thongTinUser);
  const [form] = Form.useForm();
  let navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getThongTinTaiKhoan(localService.get()?._id);
        console.log(res.data);
        setThongTinUser(res.data);
      } catch (err) {
        console.log(err.response.data);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    form.setFieldsValue({
      taiKhoan: thongTinUser.taiKhoan,
      matKhau: thongTinUser.matKhau,
      email: thongTinUser.email,
      hoTen: thongTinUser.fullname,
      soDt: thongTinUser.soDT,
      maLoaiNguoiDung: thongTinUser.loaiNguoiDung?.tenLoai,
    });
  }, [thongTinUser]);

  let renderThongTinVeDaDat = () => {
    return thongTinUser.tikcetInfo?.map((item, index) => {
      let seats = item.listSeat?.at(0);
      return (
        <div key={index} className="p-4 lg:w-1/2 w-full">
          <div className="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
            <img
              alt="team"
              className="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4"
              src={item.movieImage}
            />
            <div className="flex-grow sm:pl-8">
              <p>
                Ngày đặt : {moment(item.bookingDate).format("ll")} -{" "}
                {moment(item.bookingDate).format("LT")}
              </p>
              <h2 className="title-font font-medium text-lg text-orange-500">
                Tên Phim: {item.movieName}
              </h2>
              <p>
                Thời lượng: {item.movieDuration}p , giá vé :
                {item.price.toLocaleString()} vnđ
              </p>
              <p className="text-green-500 text-lg">
                {seats.theaterComplexName}
              </p>
              <p>
                <span>{seats.theaterName}</span> -
                <span className="mb-4 ml-1">
                  Ghế số:
                  {item.listSeat?.map((ghe, index) => {
                    return <Fragment key={index}>[{ghe.seatName}]</Fragment>;
                  })}
                </span>
              </p>
            </div>
          </div>
        </div>
      );
    });
  };
  const onFinish = (values) => {
    let newValues = {
      ...values,
      maNhom: thongTinUser.maNhom,
      maLoaiNguoiDung: thongTinUser.maLoaiNguoiDung,
    };
    updateUserInfo(newValues)
      .then((res) => {
        // Swal.fire(
        //   "Cập nhật thành công!",
        //   "Bạn cần phải đăng nhập lại!",
        //   "success",
        // );
        Swal.fire({
          title: "Bạn có muốn thay đổi không ?",
          icon: "info",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Confirm",
          showDenyButton: true,
          denyButtonText: `Cancel`,
          showCloseButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire(
              "Thông tin đã được cập nhật!",
              "Vui lòng đăng nhập lại.",
              "success"
            );
            setTimeout(() => {
              navigate("/login");
            }, 1500);
          }
        });
      })
      .catch((err) => {
        message.error("Cập nhật không thành công");
      });
  };

  return (
    <div
      style={{
        background: `url(../image/backapp.jpg)`,
        height: "100%",
      }}
    >
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className=" w-full mb-20  p-4 formInfo">
            <h1 className="text-2xl font-medium title-font mb-4 text-gray-900 tracking-widest">
              Thông tin tài khoản
            </h1>
            <p className="lg:w-2/3 leading-relaxed text-base">
              Thông tin có thể thay đổi
            </p>
            <Form
              layout="vertical"
              form={form}
              name="register"
              onFinish={onFinish}
              style={{
                width: "100%",
              }}
              className=" md:grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:grid-cols-2 lg:gap-4 xl:grid-cols-2 xl:gap-4"
            >
              <Form.Item
                label="Tài khoản"
                name="taiKhoan"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tài khoản!",
                  },
                ]}
              >
                <Input disabled autoComplete="username" />
              </Form.Item>

              <Form.Item
                name="matKhau"
                label="Mật khẩu"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu!",
                  },
                ]}
              >
                <Input.Password
                  autoComplete="current-password"
                  style={{
                    borderRadius: 0,
                    borderColor: "#6B7280",
                    padding: "0.5rem 0.75rem",
                  }}
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  {
                    type: "email",
                    message: "Đây không phải là email!",
                  },
                  {
                    required: true,
                    message: "Vui lòng nhập vào email!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="hoTen"
                label="Họ tên"
                tooltip="What do you want others to call you?"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập vào Họ tên!",
                    whitespace: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="soDt"
                label="Số điện thoại"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập vào số điện thoại!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="maLoaiNguoiDung" label="Loại">
                <Input disabled={true} className=" font-bold" />
              </Form.Item>

              <Form.Item className="col-span-2 flex justify-end">
                <Button
                  type="undefined"
                  htmlType="submit"
                  className=" bg-orange-300 hover:bg-orange-600 duration-300 flex justify-center items-center"
                >
                  Cập nhật
                </Button>
              </Form.Item>
            </Form>
          </div>
          <h1 className="text-center text-white text-4xl font-bold">
            Lịch sử đặt vé
          </h1>
          <div className="flex flex-wrap  formInfo">
            {renderThongTinVeDaDat()}
          </div>
        </div>
      </section>
    </div>
  );
}
