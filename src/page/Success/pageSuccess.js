import React from "react";
import "./pageSuccess.scss";
import { NavLink, useParams } from "react-router-dom";
import { useEffect } from "react";
import { updateTicket } from "../../Services/api";
export default function PageSuccess() {
  const param = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  useEffect(() => {
    const payTicket = async () => {
      await updateTicket(param.id, {
        isPaid: true,
      });
    };
    payTicket();
  }, []);
  return (
    <div
      id="pageNotFound"
      className="flex flex-col justify-center items-center"
    >
      <h1>Cám ơn bạn đã đặt vé</h1>
      <p className="my-16">Bạn đã đặt vé xem phim thành công.</p>
      <div>
        <button className="button">
          <NavLink to={"/"}>
            <i className="fa-solid fa-house-user" /> Tiếp túc đặt vé
          </NavLink>
        </button>
      </div>
    </div>
  );
}
