import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { useSelector } from "react-redux";

export default function Messages() {
  const user = useSelector((state) => state.user.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);

  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => scrollToBottom(), [messages]);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        username: user.displayName || user.email.split("@")[0] || "User",
        uid: user.uid,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // e.g., 10:45 AM
  };

  const formatDateLabel = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], {
        day: "numeric",
        month: "short",
        year: "numeric",
      }); // e.g., 18 Jul 2025
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)] p-4">
      <div className="flex flex-col h-[400px] sm:h-[500px] md:h-[600px] w-full max-w-2xl bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-blue-600 text-white text-xl font-bold text-center">
          💬 Messages
        </div>

        {/* ✅ Messages with Date Grouping */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
              No messages yet. Start chatting!
            </p>
          ) : (
            (() => {
              let lastDate = "";
              return messages.map((msg) => {
                const dateLabel = formatDateLabel(msg.timestamp);
                const showDate = dateLabel !== lastDate;
                lastDate = dateLabel;

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="text-center text-xs text-gray-500 dark:text-gray-400 my-2">
                        {dateLabel}
                      </div>
                    )}
                    <div
                      className={`flex ${
                        msg.uid === user.uid ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm sm:text-base max-w-[80%] shadow ${
                          msg.uid === user.uid
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <div className="flex justify-between items-center text-xs opacity-80 mt-1 gap-4">
                          <span className="truncate">
                            {msg.uid === user.uid ? "You" : msg.username}
                          </span>
                          <span>{formatTime(msg.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              });
            })()
          )}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input */}
        <form
          onSubmit={sendMessage}
          className="flex gap-2 p-3 bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700"
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-400 text-sm sm:text-base bg-gray-100 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 sm:px-6 py-2 rounded-full shadow-md"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
