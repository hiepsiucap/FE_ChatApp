/** @format */

import { useEffect, useState } from "react";
import { getRequest, postRequest } from "../utilz/Request/Request";
import Swal from "sweetalert2/dist/sweetalert2.js";
import Modal from "react-modal";
import { Circles } from "react-loader-spinner";
import AddGroup from "../component/AddGroup";
import { useNavigate } from "react-router";
Modal.setAppElement("#root");
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    backgroundColor: "rgba(0, 0, 0, 0)",
    border: "0",
    padding: "0",
    zIndex: "50",
    width: "100%",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the color and opacity here
  },
};

Modal.setAppElement("#root");
const Profile = ({ changeuser, updateAvatar }) => {
  const [info, updateinfo] = useState(null);
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);
  const LogOutHandler = async () => {
    Swal.fire({
      title: "Bạn có muốn đăng xuất",
      showDenyButton: true,
      icon: "info",
      confirmButtonText: "Xác nhận",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const response = await postRequest(
          `${process.env.REACT_APP_API_URL}/api/auth/logout`
        );
        if (!response.error) {
          navigate("/login");
        } else {
          Swal.fire("Đăng xuất thất bại", "", "error");
        }
      }
    });
  };
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const data = await getRequest(
          `${process.env.REACT_APP_API_URL}/api/users/currentUser`
        );
        if (data.error) {
          await Swal.fire({
            title: "Xác thực thất bại",
            text: data.message,
            icon: "error",
          });
        } else {
          updateinfo(data);
        }
      } catch (e) {
        await Swal.fire({
          title: "Xác thực thất bại",
          text: e,
          icon: "error",
        });
      }
    };
    getCurrentUser();
  }, []);
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "#f00";
  }
  const handleImageChange = async (e) => {
    setIsOpen(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/UpdateAva`,
        {
          method: "PUT",
          withCredntials: true,
          credentials: "include",
          body: formData,
        }
      );
      const data = await response.json();
      if (!response.ok) {
        await Swal.fire({
          title: "Đăng nhập thất bại",
          text: data.message,
          icon: "error",
        });
        setIsOpen(false);
      } else {
        updateinfo(data);
        changeuser(data);
        updateAvatar(data.userId, data.ava);
        await Swal.fire({
          title: "Thay đổi ảnh đại diện thành công",
          text: "",
          icon: "success",
        });
        setIsOpen(false);
      }
    } catch (e) {
      await Swal.fire({
        title: "Đăng nhập thất bại",
        text: e,
        icon: "error",
      });
      setIsOpen(false);
    }
  };
  return (
    <div className=" flex px-4 py-4 space-y-2 w-full h-full bg-bg2 text-stone-300 font-medium  font-Roboto  flex-col items-start">
      <div className=" flex flex-col space-y-6">
        <img src={info?.ava} alt="" className=" w-12 h-12 rounded-full" />
        <h2 className=" text-lg">{info?.username}</h2>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        // onRequestClose={closeModal}
        style={
          modalIsOpen
            ? {
                ...customStyles,
                content: {
                  ...customStyles.content,
                  transform: "translate(-50%, -50%) scale(1)",
                  opacity: 1,
                },
              }
            : customStyles
        }
        contentLabel="Example Modal"
      >
        <div className=" w-full h-full flex flex-col justify-center items-center">
          <Circles
            height="100"
            width="100"
            color="#38D7E7"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      </Modal>
      <div className=" border w-full opacity-35 p "></div>
      <div className=" flex space-y-2  flex-col py-2">
        <h2 className="">Cập nhật ảnh đại diện</h2>
        <div>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:bg-primary hover:file:bg-violet-100"
          />
        </div>
      </div>
      <div className=" border w-full opacity-35 "></div>
      <div className=" flex space-y-6  flex-col py-2 ">
        <AddGroup></AddGroup>
        <button className=" flex space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
            />
          </svg>

          <h5>Thêm bạn</h5>
        </button>
        <button className=" flex space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"
            />
          </svg>

          <h5>tin nhắn riêng tư</h5>
        </button>
        <button onClick={LogOutHandler} className=" flex space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"
            />
          </svg>

          <h5>Đăng xuất</h5>
        </button>
      </div>
    </div>
  );
};
export default Profile;
