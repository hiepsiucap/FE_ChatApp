/** @format */
import { useEffect, useRef, useState, useCallback } from "react";
import Modal from "react-modal";

import { getRequest, postRequest } from "../utilz/Request/Request";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Audio } from "react-loader-spinner";
import _ from "lodash";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#222222",

    border: "0",
    padding: "0",
    zIndex: "50",
    width: "100%",
    height: "95%",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền phía sau modal
  },
};
const UpdateStyleModal = () => {
  const isMobile = window.innerWidth < 768;
  const styles = {
    ...customStyles,
    content: {
      ...customStyles.content,
      width: isMobile ? "75%" : "40%", // 75% width for mobile, 25% for other devices
    },
  };
  return styles;
};
Modal.setAppElement("#root");
const AddGroupIcon = () => {
  const [style, updatestyle] = useState(UpdateStyleModal());
  const [listMember, updateListMember] = useState(null);
  const [GroupName, updateGroupName] = useState("");
  const [loading, updateLoading] = useState(false);
  const refinput = useRef(null);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [query, setQuery] = useState("");
  const [tempUser, setTempUser] = useState(null);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Generate a preview URL for the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // Set the preview image URL
    };
    if (selectedFile) {
      reader.readAsDataURL(selectedFile); // Read file as Data URL for preview
    }
  };
  useEffect(() => {
    const GetListMember = async () => {
      try {
        const data = await getRequest(
          `${process.env.REACT_APP_API_URL}/api/users/getUserSameChat`
        );
        if (data.error) {
          Swal.fire({
            title: "Đăng kí thất bại",
            text: data?.message,
            icon: "error",
          });
        } else {
          updateListMember(data);
        }
      } catch (e) {
        Swal.fire({
          title: "Đăng kí thất bại",
          text: e.message,
          icon: "error",
        });
      }
    };
    GetListMember();
  }, []);
  useEffect(() => {
    const UpdateStyleGroup = () => {
      updatestyle(UpdateStyleModal());
    };
    window.addEventListener("resize", UpdateStyleGroup);
    return () => window.removeEventListener("resize", UpdateStyleGroup);
  }, []);
  const fetchUsers = async (searchQuery) => {
    try {
      const data = await getRequest(
        `${process.env.REACT_APP_API_URL}/api/users/searchUser?Id=${searchQuery}`
      );
      if (data.error) {
        return null;
      } else {
        return data;
      }
    } catch (e) {
      return null;
    }
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    updateLoading(true);
    if (!GroupName) return;
    const roomName1 = { roomName: GroupName };
    const formData = new FormData();
    formData.append(
      "chatRoom",
      new Blob([JSON.stringify(roomName1)], {
        type: "application/json",
      })
    );
    formData.append("file", file);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/chatrooms/createGroup`,
        {
          method: "POST",
          withCredentials: true,
          credentials: "include",
          body: formData,
        }
      );
      const chatroomId = await response.json();

      const result = selectedOptions.map((member) => {
        return { userId: Number(member) };
      });
      console.log(result);
      try {
        if (!chatroomId.roomId) throw new Error("Tạo phòng thất bại");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/chatrooms/AddToGroup/${chatroomId.roomId}`,
          {
            method: "POST",
            withCredntials: true,
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(result),
          }
        );
        const data = await response.json();
        updateLoading(false);
        if (!response.ok) {
          Swal.fire({
            title: "Đăng kí thất bại",
            text: data?.message,
            icon: "error",
          });
        }
        Swal.fire({
          title: "Đăng kí thành công",
          text: data?.message,
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } catch (error) {
        Swal.fire({
          title: "Đăng kí thất bại",
          text: error,
          icon: "error",
        });
      }
      console.log("Group chat created:", response.data);
    } catch (error) {
      console.error("Error creating group chat:", error.message);
      updateLoading(false);
    }
  };
  const debounceFetchUsers = useCallback(
    _.debounce(async (searchQuery) => {
      const user = await fetchUsers(searchQuery);
      setTempUser(user);
    }, 300),
    []
  );
  useEffect(() => {
    if (query) {
      debounceFetchUsers(query);
    } else {
      setTempUser(null);
    }
  }, [query, debounceFetchUsers]);
  const [modalIsOpen, setIsOpen] = useState(false);
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "#f00";
  }
  const options = ["Option 1", "Option 2", "Option 3", "Option 4"];
  const [selectedOptions, setSelectedOptions] = useState([]);
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      if (!selectedOptions.includes(value))
        setSelectedOptions([...selectedOptions, value]);
    } else {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    }
  };

  return (
    <section>
      <button
        onClick={() => setIsOpen(true)}
        className=" px-2 py-2 bg-bg3 rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#FFFFFF"
          class=" w-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
          />
        </svg>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={() => {
          setIsOpen(false);
        }}
        style={
          modalIsOpen
            ? {
                ...style,
                content: {
                  ...style.content,
                  // transform: "translate(-50%, -50%) scale(1)",
                  opacity: 1,
                },
              }
            : style
        }
        contentLabel="Example Modal"
      >
        <form onSubmit={onSubmitHandler} className=" bg-bg2 relative h-full">
          <div className="p-4 font-medium text-white">Tạo nhóm</div>
          <input
            type="file"
            ref={refinput}
            style={{ display: "none" }}
            onChange={handleFileChange}
          ></input>
          <div className=" w-full border border-gray-500"></div>
          <div className=" flex-col space-y-6 px-4 ">
            <div className=" flex    items-end pt-6  space-x-2">
              <button
                type="button"
                onClick={() => {
                  refinput.current.click();
                }}
                className={
                  imagePreview
                    ? "   w-11 h-11 rounded-full hover:opacity-70 "
                    : " p-2 border rounded-full "
                }
              >
                {!imagePreview ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#FFFFFF
"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                    />
                  </svg>
                ) : (
                  <img
                    alt="Hello"
                    className=" w-10 h-10 rounded-full"
                    src={imagePreview}
                  ></img>
                )}
              </button>
              <input
                type="text"
                className=" text-white  border-0 border-b  py-1 px-2 w-full bg-transparent "
                name=""
                placeholder="Nhập tên nhóm ..."
                id=""
                value={GroupName}
                onChange={(e) => updateGroupName(e.target.value)}
              />
            </div>
            <div
              className={
                tempUser?.userId
                  ? " flex space-x-2 px-3 py-2 bg-bg3 w-full rounded-t-2xl relative"
                  : " flex space-x-2 px-3 py-2 bg-bg3 w-full rounded-full relative"
              }
            >
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
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input
                type="text"
                className=" bg-opacity-0 bg-white text-white focus:outline-none focus:ring-0 border-0 border-opacity-0 focus:border-0 focus:border-opacity-0 w-full text-sm"
                placeholder="Tìm kiếm người dùng "
                value={query}
                onChange={(e) => setQuery(e.target?.value)}
              />
              {tempUser?.userId && (
                <button
                  key={tempUser.userId}
                  className="flex items-center  absolute -bottom-14 bg-bg3 rounded-b-2xl px-2 py-2 w-full -left-2 "
                  onClick={(e) => {
                    setTempUser(null);
                    const listfilter = listMember.filter(
                      (listMember) => listMember.userId == tempUser.userId
                    );
                    if (listfilter?.length === 0) {
                      updateListMember((prev) => [...prev, tempUser]);
                    }
                  }}
                >
                  <label
                    htmlFor={tempUser}
                    className="text-gray-700 flex items-center space-x-3"
                  >
                    <div>
                      <img
                        src={tempUser.ava}
                        className="w-10 h-10 rounded-full"
                        alt=""
                      />
                    </div>
                    <p className=" text-stone-300 font-medium text-sm">
                      {tempUser.username}
                    </p>
                  </label>
                </button>
              )}
            </div>
            <p className=" text-stone-400 text-sm">Danh sách gần đây</p>
            <div className=" overflow-auto space-y-4 h-4/6">
              {listMember?.length > 0 ? (
                listMember.map((member) => (
                  <div key={member.userId} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={member.userId}
                      value={member.userId}
                      onChange={handleCheckboxChange}
                      className="mr-2 p-1  rounded-full bg-gray-300"
                    />
                    <label
                      htmlFor={member}
                      className="text-gray-700 flex items-center space-x-3"
                    >
                      <div>
                        <img
                          src={member.ava}
                          className="w-10 h-10 rounded-full"
                          alt=""
                        />
                      </div>
                      <p className=" text-stone-300 font-medium text-sm">
                        {member.username}
                      </p>
                    </label>
                  </div>
                ))
              ) : (
                <Audio
                  height="80"
                  width="80"
                  radius="9"
                  color="green"
                  ariaLabel="loading"
                  wrapperStyle
                  wrapperClass
                />
              )}
            </div>
          </div>
          <div className=" absolute bottom-20 w-full border border-gray-500"></div>
          <button
            disabled={loading}
            type="submit"
            className=" text-gray-700 bottom-6 w-32 text-sm flex items-center justify-center font-medium rounded-lg bg-primary p-2 px-4 right-6 absolute"
          >
            {loading ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="size-5 animate-spin"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            ) : (
              " Tạo nhóm"
            )}
          </button>
        </form>
      </Modal>
    </section>
  );
};

export default AddGroupIcon;
