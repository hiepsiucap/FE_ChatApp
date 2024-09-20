/** @format */
import { Link } from "react-router-dom";
import HeroPic from "../assets/HeroPic.png";
import { useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { postRequest } from "../utilz/Request/Request";
import { useNavigate } from "react-router-dom";
const Hero = () => {
  const navigate = useNavigate();
  const [isLoading, changeIsLoading] = useState(false);
  const [username, ChangeEmail] = useState("");
  const [password, ChangePassword] = useState("");
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    changeIsLoading(true);
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
      changeIsLoading(false);
    } else {
      navigate("/chat");
      changeIsLoading(false);
    }
  };

  return (
    <section className=" flex  px-6  space-x-12 justify-between items-center">
      <div className=" w-full m-auto md:w-1/2  ">
        <p className=" text-5xl  md:text-7xl leading-tight md:pt-12  pt-20 font-bold bg-gradient-to-r from-primary via-secondary to-background inline-block text-transparent bg-clip-text font-Roboto">
          Tụ họp <br></br> mọi lúc, mọi <br className=" hidden"></br>nơi
        </p>
        <p className=" text-xl font-bold max-w-96 md:max-w-fit text-gray-800 pt-6 font-Roboto">
          Với Chaka, việc kết nối với những người thân yêu thật đơn giản và thú
          vị.
        </p>
        <form
          onSubmit={onSubmitHandler}
          className=" w-full flex flex-col space-y-3 pt-6 "
        >
          <input
            type="text"
            placeholder="Email hoặc số điện thoại"
            className=" font-Roboto px-3 py-2 bg-slate-100 text-Roboto text-lg border  w-2/3 rounded-lg min-w-72"
            value={username}
            onChange={(e) => ChangeEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Mật khẩu"
            className=" font-Roboto px-3 py-2 bg-slate-100 text-Roboto text-lg border  w-2/3 rounded-lg min-w-72"
            value={password}
            onChange={(e) => ChangePassword(e.target.value)}
          />
          <div className=" pt-2"></div>
          <div className=" flex flex-col space-y-3 md:flex-row md:space-x-5 md:items-center   ">
            {!isLoading ? (
              <button className=" rounded-2xl border w-fit px-5 py-2 text-lg bg-background min-w-40 text-white font-bold font-Roboto bg-opacity-90">
                Đăng nhập
              </button>
            ) : (
              <button className=" rounded-2xl border w-fit px-5 py-2 text-lg bg-background min-w-40 text-white font-bold font-Roboto bg-opacity-90">
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
            <Link
              to="/signup"
              className=" text-background px-2 font-bold font-Roboto "
            >
              Chưa có tài khoản ?
            </Link>
          </div>
        </form>
      </div>
      <div className=" hidden md:w-1/2 md:block ">
        <img src={HeroPic} alt="" />
      </div>
    </section>
  );
};
export default Hero;
