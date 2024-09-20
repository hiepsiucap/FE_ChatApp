/** @format */
import { useState } from "react";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { postRequest } from "../utilz/Request/Request";
import { useNavigate } from "react-router-dom";
const Login = () => {
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
      await Swal.fire({
        title: "Đăng nhập thất bại",
        text: data?.message || "Lôĩ không xác định !",
        icon: "error",
      });
    } else {
      navigate("/chat");
    }
  };

  return (
    <section className=" h-screen flex flex-col space-x-2 items-center justify-center ">
      <img src={logo} alt="" className=" w-32" />
      <div className=" text-3xl font-Roboto font-bold bg-gradient-to-r pt-2 from-primary via-secondary to-background inline-block text-transparent bg-clip-text">
        Kết nối với những người bạn yêu quý.
      </div>
      <form
        onSubmit={onSubmitHandler}
        className=" flex flex-col space-y-3 w-full items-center pt-12"
      >
        <input
          type="text"
          className=" px-3 pr-12 py-2 border text-lg w-1/4 rounded-md border-gray-300 "
          placeholder="Email hoặc số điện thoại"
          value={username}
          onChange={(e) => ChangeEmail(e.target.value)}
        />
        <input
          type="text"
          className=" px-3 pr-12 py-2 border text-lg w-1/4 rounded-md border-gray-300 "
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => ChangePassword(e.target.value)}
        />
        <div className=" pt-3"></div>
        <button className=" border bg-background px-6 py-3 rounded-full text-white font-bold  ">
          Đăng nhập
        </button>
        <Link to="/signup" className=" text-gray-500">
          Đăng kí tài khoản
        </Link>
      </form>
    </section>
  );
};
export default Login;
