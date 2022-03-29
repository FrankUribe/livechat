import { useState, useEffect, useRef } from "react";
import { IoSend, IoHappy, IoEllipsisVertical } from "react-icons/io5";
import Picker from 'emoji-picker-react';

export default function ChatContainer({ currentChat, currentUser }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }
  const handleEmojiPickerHide = () => {
    setShowEmojiPicker(false)
  }
  const handleEmojiClick = (event, emoji) => {
    let message = msg;
    message += emoji.emoji;
    setMsg(message)
  }
  return (
    <div className="chatContainerAdmin">
      <div className="chat-header">
        <div className="avatar">
            <span>{currentChat.name.substring(0,2).toLowerCase()}</span>
        </div>
        <div className="username">
          <span><b>{currentChat.name}</b> ({currentChat.email})</span>
        </div>
        <button><IoEllipsisVertical/></button>
      </div>
      <div className="chat-messages">
        <p>Mensaje</p>
      </div>
      <div className="chat-input">
        <div className="emoji">
          <button onClick={handleEmojiPickerHideShow}><IoHappy/></button>
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick}/>}
        </div>
        <form className="input-container">
          <input
            type="text"
            onClick={handleEmojiPickerHide}
            onChange={(e) => setMsg(e.target.value)}
            value={msg}
            placeholder="Escribe un mensaje"
          />
          <button type="submit"><IoSend/></button>
        </form>
      </div>
    </div>
  )
}
