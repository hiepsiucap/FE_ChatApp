/** @format */
import { useLoaderData } from "react-router";
import { Link } from "react-router-dom";
import cancel from "../assets/cancel.png";
import success from "../assets/success.png";
const AuthPage = () => {
  const data = useLoaderData();
  return (
    <section className=" h-screen flex flex-col space-x-2 items-center justify-center ">
      {!data.error ? (
        <div className="flex flex-col justify-center items-center  space-y-5 pt-5">
          <div className=" flex justify-center animate-bounce">
            <img src={success} alt="" className=" w-24 h-24" />
          </div>
          <div className=" text-center text-3xl font-Roboto font-bold bg-gradient-to-r pt-2 from-primary via-secondary to-background inline-block text-transparent bg-clip-text">
            Xác thực thành công !
          </div>
          <Link
            to="/login"
            className=" border bg-background px-6 py-3 rounded-full text-white font-bold  "
          >
            Đăng nhập
          </Link>
        </div>
      ) : (
        <div className="flex-col justify-center items-center space-y-5 pt-5">
          <div className=" flex justify-center animate-bounce">
            <img src={cancel} alt="" className=" w-24 h-24" />
          </div>
          <div className=" text-center text-3xl font-Roboto font-bold bg-gradient-to-r pt-2 from-primary via-secondary to-background inline-block text-transparent bg-clip-text">
            Xác thực thất bại !
          </div>
        </div>
      )}
    </section>
  );
};
export const AuthLoader = async ({ request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const user_id = url.searchParams.get("user_id");
  return fetch(
    `${process.env.REACT_APP_API_URL}/api/auth/validate?token=${token}&user_id=${user_id}`,
    {
      method: "POST",
      withCredentials: true,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
};
export default AuthPage;
