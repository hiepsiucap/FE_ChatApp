/** @format */

import { FindMinus } from "../utilz/FindMinus";
import { NameTool } from "../utilz/NameTool";
import { shortenString } from "../utilz/UpdateString";

const EachChatRoom = ({ chatroom, onClick, currentRooms }) => {
  console.log(chatroom.roomId);
  if (chatroom.group) {
    if (!chatroom.seen) {
      return (
        <button
          onClick={onClick}
          id={chatroom.roomId}
          className={
            currentRooms == chatroom.roomId
              ? "flex bg-stone-200 bg-opacity-30 rounded-lg  justify-between px-2 py-2 items-center h-16"
              : "flex  justify-between px-2 py-2 items-center h-16"
          }
        >
          <div className="flex space-x-3 items-center w-full">
            {chatroom?.roomImage ? (
              <div className=" px-1 relative">
                <img
                  src={chatroom?.roomImage}
                  alt=""
                  className=" w-12 h-12 rounded-full "
                />
                <div className=" w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg border border-green-500   absolute right-1 bottom-1"></div>
              </div>
            ) : (
              <div className="w-14 h-14 relative">
                {chatroom.participants[0] && (
                  <img
                    src={chatroom.participants[0].ava}
                    alt=""
                    className=" w-9 h-9 absolute rounded-full right-0 top-0"
                  />
                )}
                {chatroom.participants[1] && (
                  <img
                    src={chatroom.participants[1].ava}
                    alt=""
                    className=" w-9 h-9 absolute rounded-full left-0 bottom-0"
                  />
                )}
                */
                <div className=" w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg border border-green-500   absolute right-1 bottom-1"></div>
              </div>
            )}
            <div className=" flex flex-col font-medium space-y-0.5 justify-center items-start">
              <p className="">{chatroom?.roomName || "Hi"}</p>
              {chatroom?.latestMessage && (
                <p className=" text-sm text-white scale-y-95">
                  {shortenString(
                    `${chatroom?.latestMessage?.username}:${chatroom.latestMessage?.messageText}`,
                    25
                  )}{" "}
                  ·
                  <span className=" text-gray-400">
                    {" "}
                    {" " + FindMinus(chatroom.latestMessage.sentAt)}
                  </span>
                </p>
              )}
            </div>
          </div>
          <div className="h-3 w-3 rounded-full bg-primary"></div>
        </button>
      );
    } else {
      return (
        <button
          id={chatroom.roomId}
          onClick={onClick}
          className={
            currentRooms == chatroom.roomId
              ? "flex space-x-3 bg-stone-200 bg-opacity-30 rounded-lg py-2 items-center w-full h-16"
              : "flex space-x-3  items-center w-full h-16"
          }
        >
          <div className="">
            {chatroom?.roomImage ? (
              <div className=" px-1 relative">
                <img
                  src={chatroom?.roomImage}
                  alt=""
                  className=" w-12 h-12 rounded-full "
                />
                <div className=" w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg border border-green-500   absolute right-1 bottom-1"></div>
              </div>
            ) : (
              <div className="w-14 h-14 relative">
                {chatroom.participants[0] && (
                  <img
                    src={chatroom.participants[0].ava}
                    alt=""
                    className=" w-9 h-9 absolute rounded-full right-0 top-0"
                  />
                )}
                {chatroom.participants[1] && (
                  <img
                    src={chatroom.participants[1].ava}
                    alt=""
                    className=" w-9 h-9 absolute rounded-full left-0 bottom-0"
                  />
                )}
                */
                <div className=" w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg border border-green-500   absolute right-1 bottom-1"></div>
              </div>
            )}
          </div>
          <div className=" flex flex-col pl-1 space-y-0.5 justify-center items-start">
            <p className=" font-medium">
              {chatroom?.roomName ||
                `${chatroom.participants[0].username},${chatroom.participants[1].username}`}
            </p>
            {chatroom?.latestMessage ? (
              <p className=" text-sm text-stone-400 scale-y-95">
                {shortenString(
                  `${chatroom?.latestMessage?.username}: ${chatroom.latestMessage?.messageText}`,
                  25
                )}{" "}
                ·
                <span className=" text-gray-400">
                  {" "}
                  {" " + FindMinus(chatroom?.latestMessage?.sentAt)}
                </span>
              </p>
            ) : (
              <p className=" text-sm text-stone-400 scale-y-95">
                Nhóm chat mới được tạo
              </p>
            )}
          </div>
        </button>
      );
    }
  } else {
    if (!chatroom.seen) {
      return (
        <button
          onClick={onClick}
          id={chatroom.roomId}
          className={
            currentRooms == chatroom.roomId
              ? " flex justify-between bg-stone-200 bg-opacity-30 rounded-lg px-2 py-2 items-center"
              : " flex justify-between px-2 py-2 items-center"
          }
        >
          <div className="flex space-x-3 items-center w-full">
            {chatroom.participants[0] && (
              <div className=" px-1 relative">
                <img
                  src={chatroom.participants[0]?.ava}
                  alt=""
                  className=" w-12 h-12 rounded-full "
                />
                <div className=" w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg border border-green-500   absolute right-1 bottom-1"></div>
              </div>
            )}
            <div className=" flex flex-col font-medium space-y-0.5 justify-center items-start">
              <p className="">{chatroom.participants[0]?.username}</p>
              {chatroom?.latestMessage && (
                <p className=" text-sm text-white scale-y-95">
                  {shortenString(
                    `${NameTool(
                      chatroom.participants[0]?.userId,
                      chatroom.latestMessage?.userId
                    )}${chatroom.latestMessage?.messageText}`,
                    25
                  )}{" "}
                  ·
                  <span className=" text-gray-400">
                    {" "}
                    {" " + FindMinus(chatroom.latestMessage.sentAt)}
                  </span>
                </p>
              )}
            </div>
          </div>
          <div className="h-3 w-3 rounded-full bg-primary"></div>
        </button>
      );
    } else {
      return (
        <button
          id={chatroom.roomId}
          onClick={onClick}
          className={
            currentRooms === chatroom.roomId
              ? "flex space-x-3 items-center w-full bg-stone-200 bg-opacity-30 py-2 rounded-lg"
              : "flex space-x-3 items-center py-2 w-full"
          }
        >
          {chatroom.participants[0] && (
            <div className=" px-1 relative">
              <img
                src={chatroom.participants[0]?.ava}
                alt=""
                className=" w-12 h-12 rounded-full "
              />
              <div className=" w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg border border-green-500   absolute right-1 bottom-1"></div>
            </div>
          )}
          <div className=" flex flex-col pl-1 space-y-0.5 justify-center items-start">
            <p className=" font-medium">{chatroom.participants[0]?.username}</p>
            {chatroom?.latestMessage ? (
              <p className=" text-sm text-stone-400 scale-y-95">
                {shortenString(
                  `${NameTool(
                    chatroom.participants[0]?.userId,
                    chatroom.latestMessage?.userId
                  )}${chatroom.latestMessage?.messageText}`
                )}{" "}
                ·
                <span className=" text-gray-400">
                  {" "}
                  {" " + FindMinus(chatroom?.latestMessage?.sentAt)}
                </span>
              </p>
            ) : (
              <p className=" text-sm text-stone-400 scale-y-95">
                đoạn chat mới được tạo
              </p>
            )}
          </div>
        </button>
      );
    }
  }
};
//
export default EachChatRoom;
