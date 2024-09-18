/** @format */
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import { Outlet } from "react-router-dom";
const RootLayout = () => {
  return (
    <section className=" container mx-auto bg-white">
      <div className=" flex w-full justify-between pt-2">
        <div className="">
          <img src={logo} className=" w-20" alt="" />
        </div>
        <div className=" flex justify-end space-x-12 font-Roboto font-medium items-center pb-4 pr-2">
          <Link to="/signup" className=" border border-white">
            {" "}
            Đăng kí
          </Link>
          <Link
            to="/login"
            className=" border px-8 py-2 rounded-xl text-white  bg-background "
          >
            {" "}
            Đăng nhập{" "}
          </Link>
        </div>
      </div>
      <main>
        <Outlet></Outlet>
      </main>
    </section>
  );
};
export default RootLayout;
