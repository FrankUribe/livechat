import { useState, useEffect, useRef } from "react";
import { IoSend, IoHappy, IoEllipsisVertical } from "react-icons/io5";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Picker from 'emoji-picker-react';
import { getMessagesRoute, sendMessageRoute, getLastMessagesRoute } from "../utils/APIRoutes";
import Modal, { ModalHeader, ModalBody, ModalFooter } from '../components/modal';

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const textInput = useRef(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [modal, setModal] = useState(false)

  useEffect(() => {
    const clickOutsideContent = (e) => {
        if (e.target.className === 'modal active') {
          setModal(false);
        }
    };
    window.addEventListener('click', clickOutsideContent);
    return () => {
        window.removeEventListener('click', clickOutsideContent);
    };
  }, [])

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
  useEffect(async () => {
    if (currentUser) {
      const response = await axios.post(getMessagesRoute, {
        from: currentUser._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    }
  }, [currentChat])
  
  //presiona boton enviar/
  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }else{
      textInput.current.focus();
    }
  };
  const handleSendMsg = async (msg) => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    })
    const msgs = [...messages]
    const d = new Date();
    const time = d.getHours() + ":" + d.getMinutes();
    msgs.push({
      fromSelf: true,
      message: msg,
      datetime: time,
    })
    setMessages(msgs)
  };


  const getlastmsgByUser = async () => {
    if (currentChat) {
      const lastm = await axios.post(getLastMessagesRoute, {
        from: currentChat._id,
        to: currentUser._id,
      });
      const lastmsgByUser = lastm.data[0].message.text;
      const datetimeContactChat = lastm.data[0].updatedAt;
      
      const d = new Date(datetimeContactChat);
      const time = d.getHours() + ":" + d.getMinutes() +' '+ d.getDate() + "/" + d.getMonth();
      document.getElementById('msg'+currentChat._id+'').innerHTML = lastmsgByUser
      document.getElementById('dtc'+currentChat._id+'').innerHTML = time
    }
  }
  useEffect(() => {
    const d = new Date();
    const time = d.getHours() + ":" + d.getMinutes();
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({fromSelf:false, message: msg, datetime: time })
      })
    }
  }, [])

  useEffect(() => {
    arrivalMessage && setMessages((prev)=>[...prev, arrivalMessage])
    getlastmsgByUser(currentChat._id)
  }, [arrivalMessage])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behaviur: "smooth"})
  }, [messages])
  
  return (
    <div className="chat_contact">
      <div className="chatContainerAdmin">
        <div className="chat-header">
          <div className="avatar">
              <span>{currentChat.name.substring(0,2).toLowerCase()}</span>
          </div>
          <div className="username">
            <b>{currentChat.name}</b>
          </div>
          <button onClick={() => setModal(true)} className="modalContactDetails"><IoEllipsisVertical/></button>      
        </div>
        <div className="chat-messages admin">
          <div className="chat-admin">
          {messages.map((message) => {
            return (
              <div ref={scrollRef} key={uuidv4()}>
                <div
                  className={`message ${
                    message.fromSelf ? "sended" : "recieved"
                  }`}
                >
                  <div className="content ">
                    <p>{message.message}
                    <small>{message.datetime}</small>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
        <div className="chat-input">
          <div className="emoji">
            <button onClick={handleEmojiPickerHideShow}><IoHappy/></button>
            {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick}/>}
          </div>
          <form className="input-container" onSubmit={(event) => sendChat(event)}>
            <input
              type="text"
              onClick={handleEmojiPickerHide}
              onChange={(e) => setMsg(e.target.value)}
              value={msg}
              ref={textInput}
              placeholder="Escribe un mensaje"
            />
            <button type="submit"><IoSend/></button>
          </form>
        </div>
      </div>
      <div className="contactDetails">
        <div className="avatar">
          <b>{currentChat.name.substring(0,2).toLowerCase()}</b>
        </div>
        <div className="username">
          <h4>{currentChat.name}</h4>
        </div>
        <div className="email">
          <span>{currentChat.email}</span>
        </div>
        <div className="boxDetails">
          <table>
            <tbody>
              <tr>
                <td width='80px'>Telefono</td>
                <td>...</td>
              </tr>
              <tr>
                <td width='80px'>Pais</td>
                <td>...</td>
              </tr>
              <tr>
                <td width='80px'>Ciudad</td>
                <td>...</td>
              </tr>
              <tr>
                <td width='80px'>Ip</td>
                <td>...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
          
      <Modal show={modal}>
        <div className="modal-dialog" style={{width: '300px'}}>
          <ModalHeader>
            <h4>{currentChat.name}</h4>
          </ModalHeader>
          <ModalBody>
          <table>
            <tbody>
              <tr>
                <td width='80px'>Correo</td>
                <td>{currentChat.email}</td>
              </tr>
              <tr>
                <td width='80px'>Telefono</td>
                <td>...</td>
              </tr>
              <tr>
                <td width='80px'>Pais</td>
                <td>...</td>
              </tr>
              <tr>
                <td width='80px'>Ciudad</td>
                <td>...</td>
              </tr>
              <tr>
                <td width='80px'>Ip</td>
                <td>...</td>
              </tr>
            </tbody>
          </table>
          </ModalBody>
          <ModalFooter>
            <button className='btn' onClick={() => setModal(false)}>Cerrar</button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  )
}
