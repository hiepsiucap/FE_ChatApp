/** @format */
import { Link } from "react-router-dom";
import HeroPic from "../assets/HeroPic.png";
import { useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { postRequest } from "../utilz/Request/Request";
import { useNavigate } from "react-router-dom";
const Hero = () => {
  const navigate = useNavigate();
  const [username, ChangeEmail] = useState("");
  const [password, ChangePassword] = useState("");
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const body = { username, password };
    const data = await postRequest(
      `${process.env.REACT_APP_API_URL}/api/auth/login`,
      body
    );
    if (data.error) {
      Swal.fire({
        title: "Đăng nhập thất bại",
        text: data.message,
        icon: "error",
      });
    } else {
      navigate("/chat");
    }
  };

  return (
    <section className=" flex  px-6  space-x-12 justify-between items-center">
      <div className=" w-1/2 ">
        <p className=" text-7xl bg-gradient-to-r from-primary via-secondary to-background inline-block text-transparent bg-clip-text font-Roboto">
          Tụ họp <br></br> mọi lúc, mọi <br></br>nơi
        </p>
        <p className=" text-2xl pt-6 font-Roboto">
          Với Messenger, việc kết nối với những người thân yêu thật đơn giản và
          thú vị.
        </p>
        <form
          onSubmit={onSubmitHandler}
          className=" w-full flex flex-col space-y-3 pt-6 "
        >
          <input
            type="text"
            placeholder="Email hoặc số điện thoại"
            className=" font-Roboto px-3 py-2 bg-slate-100 text-Roboto text-lg border  w-2/3 rounded-lg"
            value={username}
            onChange={(e) => ChangeEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Mật khẩu"
            className=" font-Roboto px-3 py-2 bg-slate-100 text-Roboto text-lg border  w-2/3 rounded-lg"
            value={password}
            onChange={(e) => ChangePassword(e.target.value)}
          />
          <div className=" pt-2"></div>
          <div className=" flex space-x-5 items-center">
            <button className=" rounded-2xl border w-fit px-5 py-2 text-lg bg-background text-white font-bold font-Roboto bg-opacity-90">
              Đăng nhập
            </button>
            <Link
              to="/signup"
              className=" text-background font-bold font-Roboto "
            >
              Chưa có tài khoản ?
            </Link>
          </div>
        </form>
      </div>
      <div className=" w-1/2">
        <img src={HeroPic} alt="" />
      </div>
    </section>
  );
};
export default Hero;
