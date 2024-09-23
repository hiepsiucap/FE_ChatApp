/** @format */
import { motion } from "framer-motion";
const Message = ({ user, message, group }) => {
  if (message.userId == user)
    return (
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
        className="flex justify-end "
      >
        <div className=" flex flex-col items-end ">
          {message.displayName && (
            <div className="text-slate-400 text-sm py-2 px-12"></div>
          )}
          <div className=" bg-blue-500 text-base  py-1.5 px-4 rounded-2xl text-white ">
            {message.messageText}
          </div>
        </div>
      </motion.div>
    );
  else
    return (
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
        className="justify-start "
      >
        {message.displayName &&
          (group ? (
            <div className="text-slate-400 text-sm pt-6 pb-0.5 px-12">
              {message.displayName}
            </div>
          ) : (
            <div className="text-slate-400 text-sm py-1.5 px-12"></div>
          ))}
        <div className=" flex items-center space-x-1 ">
          <img src={message.avaUser} className=" w-7 h-7 rounded-full" alt="" />
          <div className=" bg-bg3 text-base  py-1.5 px-4 rounded-2xl text-slate-300 ">
            {message.messageText}
          </div>
        </div>
      </motion.div>
    );
};
export default Message;
