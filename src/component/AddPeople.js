/** @format */

import { useCallback, useEffect, useState } from "react";
import { getRequest, postRequest } from "../utilz/Request/Request";
import _ from "lodash";
import Swal from "sweetalert2/dist/sweetalert2.js";
/** @format */
const AddPeople = () => {
  const [tempUser, setTempUser] = useState(null);
  const [query, setQuery] = useState("");
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
  const onsubmitHandler = async (e) => {
    e.preventDefault();
    const chatRoom = await postRequest(
      `${process.env.REACT_APP_API_URL}/api/chatrooms/createPrivate/${e.target.id}`
    );
    if (chatRoom.error) {
      Swal.fire({
        title: "Đăng kí thất bại",
        text: chatRoom?.message,
        icon: "error",
      });
    } else {
      Swal.fire({
        title: "Kết bạn thành công",
        text: "",
        icon: "success",
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
  return (
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
        className=" bg-opacity-0 bg-white focus:outline-none focus:ring-0 border-0 border-opacity-0 focus:border-0 focus:border-opacity-0 w-full text-sm"
        placeholder="tìm kiếm tin nhắn "
        value={query}
        onChange={(e) => setQuery(e.target?.value)}
      />
      {tempUser?.userId && (
        <button
          key={tempUser.userId}
          className="flex items-center z-50  absolute -bottom-14 bg-bg3 rounded-b-2xl px-2 py-2 w-full -left-2 "
          onClick={() => {}}
        >
          <label
            htmlFor={tempUser}
            className="text-gray-700 flex items-center w-full justify-between "
          >
            <div className=" flex space-x-3 items-center ">
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
            </div>
            <button
              className=" hover:scale-110"
              key={tempUser.userId}
              id={tempUser.userId}
              onClick={onsubmitHandler}
            >
              <svg
                id={tempUser.userId}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="#38D7E7"
                class="size-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                />
              </svg>
            </button>
          </label>
        </button>
      )}
    </div>
  );
};
export default AddPeople;
