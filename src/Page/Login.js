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
  const [isLoading, changeIsLoading] = useState(false);
  const [password, ChangePassword] = useState("");
  const onSubmitHandler = async (e) => {
    changeIsLoading(true);
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
      changeIsLoading(false);
    } else {
      navigate("/chat");
    }
  };

  return (
    <section className=" h-screen flex flex-col space-x-2 items-center justify-center ">
      <img src={logo} alt="" className=" w-32" />
      <div className=" text-3xl font-Roboto font-bold bg-gradient-to-r text-center pt-2 from-primary via-secondary to-background inline-block text-transparent bg-clip-text">
        Kết nối với những người bạn yêu quý.
      </div>
      <form
        onSubmit={onSubmitHandler}
        className=" flex flex-col space-y-3 w-full items-center pt-12"
      >
        <input
          type="text"
          className=" px-3 pr-12 py-2 border text-lg w-1/4 min-w-80 rounded-md border-gray-300 "
          placeholder="Email hoặc số điện thoại"
          value={username}
          onChange={(e) => ChangeEmail(e.target.value)}
        />
        <input
          type="text"
          className=" px-3 pr-12 py-2 border text-lg w-1/4 min-w-80 rounded-md border-gray-300 "
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => ChangePassword(e.target.value)}
        />
        <div className=" pt-3"></div>
        {!isLoading ? (
          <button className=" rounded-2xl border w-fit px-5 py-2 text-lg bg-background min-w-40 text-white font-bold font-Roboto bg-opacity-90">
            Đăng nhập
          </button>
        ) : (
          <button
            disabled
            className=" rounded-2xl border w-fit px-5 py-2 text-lg bg-background min-w-40 text-white font-bold font-Roboto bg-opacity-90"
          >
            <div className=" animate-spin flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </div>
          </button>
        )}
        <Link to="/signup" className=" text-gray-500">
          Đăng kí tài khoản
        </Link>
      </form>
    </section>
  );
};
export default Login;
