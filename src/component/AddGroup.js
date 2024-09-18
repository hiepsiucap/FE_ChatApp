/** @format */
import { useEffect, useState, useCallback } from "react";
import Modal from "react-modal";

import { getRequest, postRequest } from "../utilz/Request/Request";
import Swal from "sweetalert2/dist/sweetalert2.js";
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
    width: "40%",
    height: "95%",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền phía sau modal
  },
};
Modal.setAppElement("#root");
const AddGroup = () => {
  const [listMember, updateListMember] = useState(null);
  const [GroupName, updateGroupName] = useState("");
  const [query, setQuery] = useState("");
  const [tempUser, setTempUser] = useState(null);
  console.log(listMember);
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
    const roomName1 = { roomName: GroupName };
    const chatRoom = await postRequest(
      `${process.env.REACT_APP_API_URL}/api/chatrooms/createGroup`,
      roomName1
    );
    if (chatRoom.error) {
      Swal.fire({
        title: "Đăng kí thất bại",
        text: chatRoom?.message,
        icon: "error",
      });
    }
    const chatroomId = chatRoom.roomId;
    const result = selectedOptions.map((member) => {
      return { userId: Number(member) };
    });
    console.log(result);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/chatrooms/AddToGroup/${chatroomId}`,
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
  console.log(selectedOptions);
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
      <button onClick={() => setIsOpen(true)} className=" flex space-x-2">
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
            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
          />
        </svg>
        <h5>Tạo nhóm chat</h5>
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
                ...customStyles,
                content: {
                  ...customStyles.content,
                  // transform: "translate(-50%, -50%) scale(1)",
                  opacity: 1,
                },
              }
            : customStyles
        }
        contentLabel="Example Modal"
      >
        <form onSubmit={onSubmitHandler} className=" bg-bg2 relative h-full">
          <div className="p-4 font-medium text-white">Tạo nhóm</div>
          <div className=" w-full border border-gray-500"></div>
          <div className=" flex-col space-y-6 px-4 ">
            <div className=" flex    items-end pt-6  space-x-2">
              <div className=" p-2 border rounded-full ">
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
              </div>
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
                      for (let i = 0; i < 10; i++) {
                        updateListMember((prev) => [...prev, tempUser]);
                      }
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
              {listMember &&
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
                ))}
            </div>
          </div>
          <div className=" absolute bottom-20 w-full border border-gray-500"></div>
          <button
            type="submit"
            className=" text-gray-700 bottom-6 text-sm font-medium rounded-lg bg-primary p-2 px-4 right-6 absolute"
          >
            Tạo nhóm
          </button>
        </form>
      </Modal>
    </section>
  );
};

export default AddGroup;
