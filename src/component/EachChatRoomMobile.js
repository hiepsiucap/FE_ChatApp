/** @format */

import { FindMinus } from "../utilz/FindMinus";
import { NameTool } from "../utilz/NameTool";
import { shortenString } from "../utilz/UpdateString";

const EachChatRoomMobile = ({ chatroom, onClick, currentRooms }) => {
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
          <div className="">
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

              <div className=" w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg border border-green-500   absolute right-1 bottom-1"></div>
              <div className="   w-3 h-3 rounded-full bg-blue-600 shadow-lg border border-blue-500 absolute right-0 top-0"></div>
            </div>
          </div>
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

              <div className=" w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg border border-green-500   absolute right-1 bottom-1"></div>
            </div>
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
              ? "flex space-x-3 items-center w-full bg-stone-200 bg-opacity-30 py-2 rounded-lg"
              : "flex space-x-3 items-center py-2 w-full brightness-150"
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
              <div className="   w-3 h-3 rounded-full bg-blue-600 shadow-lg border border-blue-500 absolute right-0 top-0"></div>
            </div>
          )}
        </button>
      );
    } else {
      return (
        <button
          id={chatroom.roomId}
          onClick={onClick}
          className={
            currentRooms == chatroom.roomId
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
        </button>
      );
    }
  }
};
//
export default EachChatRoomMobile;
