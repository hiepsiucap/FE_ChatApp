/** @format */
import { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2/dist/sweetalert2.js";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { GetMessage, GetMessageWithController, getRequest, postRequest } from "../utilz/Request/Request";
import EachChatRoom from "../component/EachChatRoom";
import Message from "../component/Message";
import { displayFirstMessageUser } from "../utilz/MessageUp";
import Profile from "./Profile";
import AddPeople from "../component/AddPeople";
import AddGroupIcon from "../component/AddGroupIcon";

const customStyles = {
  content: {
    top: "0",
    left: "0", // Đặt phần tử ở bên trái
    right: "0",
    bottom: "0",
    marginRight: "0", // Xóa margin-right
    backgroundColor: "#f0f0f0",
    border: "0",
    padding: "0",
    zIndex: "50",
    width: "25%",
    height: "100%",
  },
  overlay: {
    backgroundColor: "rgba(100, 100, 100, 0.25)", // Màu nền phía sau modal
  },
};
Modal.setAppElement("#root");
const Chat = () => {
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentRooms, setCurrentRooms] = useState([]);
  const abortControllerRef = useRef(null);
  const [BodyMessage, ChangeBodyMessage]=useState(null)
  const [ava, changeava] = useState();
  const [loading, setLoading]= useState(false);
  const [loadingchatroom, setloadingchatroom]= useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [chatrooms, Changechatrooms] = useState(null);
  const [sortchatrooms, Changesortchatrooms]= useState(null);
  const [page, setPage] = useState(1);
   const currentRoomRef = useRef(currentRooms);
  function updateAvatar(userId, newAvatar) {
    chatrooms?.forEach((room) => {
      room.participants.forEach((participant) => {
        if (participant.userId === userId) {
          participant.ava = newAvatar;
        }
      });
    });
  }
useEffect(() => {
  if (chatrooms?.length > 0) {
    const sortedChatrooms = chatrooms.sort((a, b) => {
  
      if (!a?.latestMessage?.sentAt) return 1; 
      if (!b?.latestMessage?.sentAt) return -1; 
      return new Date(b.latestMessage.sentAt) - new Date(a.latestMessage.sentAt);
    });
  Changesortchatrooms(sortedChatrooms);
  }
}, [chatrooms]);
  useEffect(()=>{
  const  UpdateAva=async()=>{
        const data= await getRequest(`${process.env.REACT_APP_API_URL}/api/users/currentUser`);
        console.log(data)
        if(!data.error)
        {
          changeava(data.ava)
        }
    }
    UpdateAva();
  },[])
    const messagesEndRef = useRef(null);
    const messagesEndRef1 = useRef(null);
    useEffect(() => {
    currentRoomRef.current = currentRooms;
  }, [currentRooms]);
    useEffect(() => {
    messagesEndRef1.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const onSubmitHandler = async (e) => {
    e.preventDefault();
       if (stompClient && stompClient?.connected && BodyMessage && currentRooms) {
      stompClient.send('/app/message', {}, JSON.stringify({chatRoomId: currentRooms.roomId, messageText: BodyMessage }));
      ChangeBodyMessage("")
    }
    else
    {
      let error=""
      if(!stompClient) error ="stompClient";
      else
      if(!stompClient?.connected) error="connected";
      else if(!BodyMessage) error="body"
      else if(currentRooms.roomId) error="current"
      
    }
  };
  console.log(currentRooms, messages);
  useEffect(() => {
    const getrequest = async () => {
      const data = await getRequest(
       `${process.env.REACT_APP_API_URL}/api/users/currRooms`
      );
      if (data.error) {
        Swal.fire({
          title: "Đăng nhập thất bại",
          text: data.message,
          icon: "error",
        });
      } else {
        Changechatrooms(data);
        setloadingchatroom(false);
        if (data[0])
          try {
            const response = await GetMessage(1, 0)
            if (response.error) {
              Swal.fire({
                title: "Tìm kiếm tin nhắn thất bại",
                text: response.message,
                icon: "error",
              });
            }
            Changechatrooms((prev) => {
              if (!prev) return prev;
              return prev.map((chatroom) => {
                if (chatroom.roomId == data[0].roomId) {
                  return {
                    ...chatroom,
                    seen: true,
                  };
                }
                return chatroom;
              });
            });
            setMessages(response);
            const message = response?.listMessage?.find(
              (message) => message.userId === response.user_id
            );
            changeava(message?.avaUser);
            console.log(response);
            setCurrentRooms(data[0]);
          } catch (err) {
            if (err.name !== "AbortError") {
              setloadingchatroom(false);
            }
          }
      }
    };
    getrequest();
  }, []);
  useEffect(() => {
    connect();
  }, []);
  const onClickHandler = async (e) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    console.log(e.currentTarget.id);
    const id = e.currentTarget.id;
    try {
      const result= await GetMessageWithController(controller,id ,0);
      if(result.error)
      {
      return;
      }
      Changechatrooms((prev) => {
        if (!prev) return prev;
        return prev.map((chatroom) => {
          if (chatroom.roomId == id) {
            return {
              ...chatroom,
              seen: true,
            };
          }
          return chatroom;
        });
      });
      if(!result.error)
      setMessages(result);
      console.log(result);
      setCurrentRooms(chatrooms.find((chatroom) => chatroom.roomId == id));
      setHasMore(true);
      setPage(1);
    } catch (err) {
    }
  };
  const subscriptionsRef = useRef([]);
    useEffect(() => {
        if(chatrooms)
        {
        const prevSubscriptions = subscriptionsRef.current;
  const newSubscriptions = [];

  const prevRoomIds = prevSubscriptions.map(sub => sub.roomId);
  const newRoomIds = chatrooms.map(chatroom => chatroom.roomId);
  prevSubscriptions.forEach(sub => {
    if (!newRoomIds.includes(sub.roomId)) {
      sub.subscription.unsubscribe();
    } else {
      newSubscriptions.push(sub); // giữ lại những subscriptions không thay đổi
    }
  });
      let subscriptions = [];
    if (stompClient && chatrooms.length>0) {
      chatrooms.forEach((chatroom) => {
        if (!prevRoomIds.includes(chatroom.roomId)) {
        const subscription = stompClient.subscribe(`/topic/chatroom/${chatroom.roomId}`, (message) => {
          const newMessage = JSON.parse(message.body);

          if(currentRoomRef.current?.roomId === newMessage.roomId)
          {
          setMessages((prev)=> ({...prev,listMessage: [...prev.listMessage,{...newMessage}]}))
          Changechatrooms((prev)=>{
              if(prev)
              {
               return prev.map((chatroom)=>{
                if(chatroom.roomId === newMessage.roomId) 
                  return {...chatroom,latestMessage: {...newMessage}}
                else 
                return chatroom
               })
              }
            })
          }
          else
          {
            Changechatrooms((prev)=>{
              if(prev)
              {
               return prev.map((chatroom)=>{
                if(chatroom.roomId === newMessage.roomId) 
                  return {...chatroom,seen:false, latestMessage: {...newMessage}}
                else 
                return chatroom
               })
              }
            })
          }
              
          // Handle the new message (e.g., update state, notify user)
        });
         newSubscriptions.push({ subscription, roomId: chatroom.roomId });
        }
 subscriptionsRef.current = newSubscriptions;
        // Optionally store the subscription if you need to unsubscribe later
       return () => {
    const currentRoomIds = chatrooms?.map(chatroom => chatroom.roomId);
    subscriptionsRef.current.forEach(sub => {
      if (!currentRoomIds.includes(sub.roomId)) {
        sub.subscription.unsubscribe();
      }
    });
  };
      
      });
    }

  return () => {
    // Hủy tất cả các subscription khi component unmount hoặc khi `stompClient` hoặc `chatrooms` thay đổi
    subscriptions.forEach(subscription => subscription.unsubscribe());
  };
}
  }, [stompClient, chatrooms]);
  const connect = () => {
  try {
    const socket = new SockJS(`${process.env.REACT_APP_API_URL}/ws`); 
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame) => {
      console.log("Connected: " + frame);
      setStompClient(stompClient);
    });
  } catch (e) {
    console.log(e);
  }
};
  useEffect(()=>{
    const LoadMoreMessage=async()=>{
    if(!hasMore)
    {
       setLoading(false);
      return
    }
    setLoading(true);
    const NewMessage = await GetMessage(currentRooms?.roomId,page);
    console.log(NewMessage);
      if(!NewMessage.error)
      {
        if(NewMessage?.listMessage?.length===0)
        {
          console.log("hello")
           setHasMore(false);
        }
      else 
      {
        setMessages((prev)=> ({...prev,listMessage: [...NewMessage.listMessage,...prev.listMessage]}));
        console.log(page)
        setPage((prev)=> prev+1);
          if (messagesEndRef.current) {
        messagesEndRef.current.scrollTop = NewMessage?.listMessage?.length *  10;
      }
    }}
        setLoading(false);
    }
    const HandlerScroll=()=>{
      if(messagesEndRef.current)
      {
         const { scrollTop, scrollHeight, clientHeight } = messagesEndRef.current;

      if (scrollTop === 0 && hasMore) {
        LoadMoreMessage();
      }
      }
    }
    if(messagesEndRef.current)
    {
      messagesEndRef.current.addEventListener("scroll", HandlerScroll)
    }
     return ()=>{
       if(messagesEndRef.current)
       {
        messagesEndRef.current.removeEventListener("scroll", HandlerScroll)
       }
     }
  },[page,hasMore,currentRooms])
  const subscribeToRoom = (roomId) => {
    if (stompClient) {
      stompClient.subscribe("/topic/chatroom/" + roomId, (messageOutput) => {
        console.log(messageOutput);
      });
    }
  };
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = "#f00";
  }
  return (
    <section
      className=" bg-bg1  p-2 text-white"
      style={{ height: "100vh", overflow: "hidden" }}
    >
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
        <div className=" h-screen">
          <Profile changeava={changeava} updateAvatar={updateAvatar}></Profile>
        </div>
      </Modal>

      <div className=" flex w-full space-x-3 pb-2">
        <div
          className=" flex bg-bg2 rounded-xl  flex-col h-screen  w-1/4 min-w-fit font-Roboto"
          style={{ height: "calc(100vh - 18px)", overflow: "hidden" }}
        >
          <div className=" flex justify-between items-center px-3">
            <p className=" p-2 pt-4 font-bold text-2xl text-white">Tin nhắn</p>
            <div className=" flex space-x-2">
            <AddGroupIcon></AddGroupIcon>
              <button
                className="  rounded-full"
                onClick={() => setIsOpen(true)}
              >
                <img className=" w-10 h-10 rounded-full" src={ava} alt="" />
              </button>
            </div>
          </div>
          <div className=" pl-5 pr-3 py-3">
           
             
           <AddPeople></AddPeople>
     
          </div>
          <div
            className="px-4 pt-4 h-screen overflow-auto  flex space-y-2 flex-col  "
            style={{ height: "calc(100vh - 18px)" }}
          >
            {loadingchatroom &&   <div className=" animate-spin flex justify-center items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
</svg>
            </div>
}
            {sortchatrooms &&
              sortchatrooms.map((chatroom) => {
                return (
                  <EachChatRoom
                    id={chatroom.roomId}
                    onClick={onClickHandler}
                    chatroom={chatroom}
                  ></EachChatRoom>
                );
              })}
          </div>
        </div>
        <div
          className=" flex bg-bg2   flex-col rounded-xl h-screen w-2/4 font-Roboto"
          style={{ height: "calc(100vh - 18px)", overflow: "hidden" }}
        >
          <div className=" flex py-3 px-3 justify-between items-center shadow-xl">
            <div className="flex space-x-2 items-center">
              {currentRooms.group ? (
                <>
                  <div className="w-14 h-14 relative">
                    {currentRooms?.participants[0] && (
                      <img
                        src={currentRooms?.participants[0].ava}
                        alt=""
                        className=" w-9 h-9 absolute rounded-full right-0 top-0"
                      />
                    )}
                    {currentRooms?.participants[1] && (
                      <img
                        src={currentRooms?.participants[1].ava}
                        alt=""
                        className=" w-9 h-9 absolute rounded-full left-0 bottom-0"
                      />
                    )}
                    <div className=" w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg border border-green-500   absolute right-1 bottom-1"></div>
                  </div>
                  <div>
                    <div className=" font-medium">{currentRooms.roomName}</div>
                    <div className=" text-sm text-stone-400">
                      Đang hoạt động
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className=" py-1">
                    {currentRooms?.participants && (
                      <div className=" px-1 relative">
                        <img
                          src={currentRooms?.participants[0]?.ava}
                          alt=""
                          className=" w-12 h-12 rounded-full "
                        />
                        <div className=" w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg border border-green-500   absolute right-1 bottom-1"></div>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className=" font-medium">
                      {currentRooms?.participants &&
                        currentRooms?.participants[0]?.username}
                    </div>
                    <div className=" text-sm text-stone-400">
                      Đang hoạt động
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className=" flex space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#38D7E7"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#38D7E7"
                class="size-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#38D7E7"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#38D7E7"
                class="size-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#38D7E7"
                class="size-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
            </div>
          </div>
          <div
            className=" flex flex-col space-y-1.5 mt-4 px-4 -mx-2 relative h-screen overflow-y-auto"
            style={{ height: "calc(100vh - 18px)" }}
            ref={messagesEndRef}
          >
            { loading && <div className=" absolute top-0 right-1/2 animate-spin">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
</svg>

            </div>
}
            {messages?.listMessage &&
              messages?.listMessage.length > 0 &&
              displayFirstMessageUser(
                messages?.listMessage,
                currentRooms.group,
                messages.user_id
              ).map((message) => {
                return (
                  <Message
                    message={message}
                    key={message.messageId}
                    user={messages.user_id}
                    group={currentRooms.group}
                  ></Message>
                );
              })}
               <div ref={messagesEndRef1} />
          </div>
          <form
            onSubmit={onSubmitHandler}
            className="flex border-t-4 border-opacity-80 border-neutral-800 items-center  px-4 py-3 space-x-2"
          >
            <div className=" flex space-x-2 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#38D7E7"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#38D7E7"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12.75 8.25v7.5m6-7.5h-3V12m0 0v3.75m0-3.75H18M9.75 9.348c-1.03-1.464-2.698-1.464-3.728 0-1.03 1.465-1.03 3.84 0 5.304 1.03 1.464 2.699 1.464 3.728 0V12h-1.5M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#38D7E7"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <div className=" flex w-full space-x-2 px-3 py-2 bg-bg3 rounded-full ">
              <input
                type="text"
                className=" bg-opacity-0 focus:outline-none focus:ring-0 bg-white border-0 border-opacity-0 focus:border-0 focus:border-opacity-0 w-full text-sm"
                placeholder="gửi tin nhắn .... "
                value={BodyMessage}
                onChange={(e)=>ChangeBodyMessage(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#38D7E7"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                />
              </svg>
            </div>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#38D7E7"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        </div>
        <div
          className=" flex bg-bg2 flex-col   rounded-xl h-screen w-1/4 font-Roboto"
          style={{ height: "calc(100vh - 18px)", overflow: "hidden" }}
        >
          <div className="flex flex-col  py-12 px-5">
            <div className=" flex flex-col items-center">
              {currentRooms.group ? (
                <>
                  <div className="w-20 h-20 relative">
                    {currentRooms?.participants && (
                      <img
                        src={currentRooms?.participants[0].ava}
                        alt=""
                        className=" w-14 h-14 absolute rounded-full right-0 top-0"
                      />
                    )}
                    {currentRooms?.participants[1] && (
                      <img
                        src={currentRooms?.participants[1].ava}
                        alt=""
                        className=" w-14 h-14 absolute rounded-full left-0 bottom-0"
                      />
                    )}
                    <div className=" w-3 h-3 rounded-full bg-green-500 shadow-lg border border-green-500   absolute right-1 bottom-1"></div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    {currentRooms.participants && (
                      <div className=" px-1 relative">
                        <img
                          src={currentRooms.participants[0]?.ava}
                          alt=""
                          className=" w-20 h-20 rounded-full "
                        />
                        <div className=" w-3 h-3 rounded-full bg-green-500 shadow-lg border border-green-500   absolute right-3 bottom-1"></div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            <p className=" text-lg font-medium pt-3  flex flex-col items-center">
              {currentRooms.group
                ? currentRooms.roomName
                : currentRooms.participants &&
                  currentRooms.participants[0]?.username}
            </p>
            <p className="text-sm text-stone-400  flex flex-col items-center">
              Active Now
            </p>
            <div className=" flex pt-6 justify-center space-x-5">
              <div className=" flex flex-col items-center space-y-2 ">
                <div className=" p-1.5 bg-bg3 rounded-full">
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
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </div>
                <p className=" text-sm text-gray-300">Profile</p>
              </div>
              <div className=" flex flex-col items-center space-y-2 ">
                <div className=" p-1.5 bg-bg3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                    />
                  </svg>
                </div>
                <p className=" text-sm text-gray-300">Nofication</p>
              </div>
              <div className=" flex flex-col items-center space-y-2 ">
                <div className=" p-1.5 bg-bg3 rounded-full">
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
                      d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>
                <p className=" text-sm text-gray-300">Search</p>
              </div>
            </div>
            <div className=" flex justify-between items-center pt-6">
              <p className=" pt-1 text-sm font-bold">Thông tin đoạn chat</p>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>
            <div className=" flex justify-between items-center pt-6">
              <p className=" pt-1 text-sm font-bold">File, đa phương tiện</p>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>
            <div className=" flex justify-between items-center pt-6">
              <p className=" pt-1 text-sm font-bold">Report</p>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Chat;
