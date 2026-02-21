import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteMessage,getMessages } from "../store/slices/chatSlice";
import { getSocket } from "../lib/socket";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import ChatHeader from "./ChatHeader";


const ChatContainer = () => {
  const { messages, isMessagesLoading, selectedUser } = useSelector(
    (state) => state.chat
  );

  const { authUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const messageEndRef = useRef(null);

  // Fetch messages when user changes
  useEffect(() => {
    if (!selectedUser?._id) return;

    dispatch(getMessages(selectedUser._id));

    const socket = getSocket();
    if (!socket) return;
  }, [selectedUser?._id, dispatch]);

  // Auto scroll
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  // If no user selected
  if (!selectedUser?._id) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a user to start chatting 👋
      </div>
    );
  }

  // Loading
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      <ChatHeader />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            No messages yet. Start the conversation 👋
          </p>
        ) : (
          messages.map((message, index) => {
            const isSender =
              message.senderId?.toString() === authUser?._id?.toString();

            return (
              <div
                key={message._id || index}
                className={`flex items-end ${
                  isSender ? "justify-end" : "justify-start"
                }`}
                ref={index === messages.length - 1 ? messageEndRef : null}
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full overflow-hidden border shrink-0 ${
                    isSender ? "order-2 ml-3" : "order-1 mr-3"
                  }`}
                >
                  <img
                    src={
                      isSender
                        ? authUser?.avatar?.url || "/avatar-holder.avif"
                        : selectedUser?.avatar?.url || "/avatar-holder.avif"
                    }
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-2 rounded-xl text-sm ${
                    isSender
                      ? "bg-blue-400/20 text-black order-1"
                      : "bg-gray-200 text-black order-2"
                  }`}
                >
                  {/* MEDIA */}
                  {message.mediaUrl && (
                    <>
                      {message.mediaUrl.includes(".mp4") ||
                      message.mediaUrl.includes(".webm") ||
                      message.mediaUrl.includes(".mov") ? (
                        <video
                          src={message.mediaUrl}
                          controls
                          className="w-full rounded-md mb-2"
                        />
                      ) : (
                        <img
                          src={message.mediaUrl}
                          alt="Attachment"
                          className="w-full rounded-md mb-2"
                        />
                      )}
                    </>
                  )}

                  {/* TEXT */}
                  {message.text && <p>{message.text}</p>}

                  {/* TIME */}
                  <span className="block text-[10px] mt-1 text-right text-gray-400">
                    {formatMessageTime(message.createdAt)}
                  </span>

                  {/* DELETE BUTTON (only sender) */}
{isSender && (
  <button
    onClick={() => dispatch(deleteMessage(message._id))}
    className="block ml-auto mt-1 text-[11px] text-red-500 hover:text-red-600"
  >
    Delete
  </button>
)}
                </div>
              </div>
            );
          })
        )}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
