import { useState, useEffect, useRef } from "react";
import { IoSend, IoHappy, IoEllipsisVertical, IoPencil } from "react-icons/io5";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Picker from 'emoji-picker-react';
import { getMessagesRoute, sendMessageRoute, getLastMessagesRoute } from "../utils/APIRoutes";
import Modal, { ModalHeader, ModalBody, ModalFooter } from '../components/modal';

export default function ChatContainer({ currentChat, currentUser, socket, fetchContacts }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const textInput = useRef(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [modal, setModal] = useState(false)
  const [chatData, setChatData] = useState(currentChat)

  //hook traer los mesajes del usuario actual (si existe) hacia un usuario de chat
  useEffect(async () => {
    if (currentUser) {
      const response = await axios.post(getMessagesRoute, {
        from: currentUser._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    }
  }, [currentChat])
  
  //hook cada vez que se de un click se cierre el modal, solo si el modal esta abierto
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

  //funcion al presionar boton de emoji, abre modal
  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }
  //funcion al presionar caja de texto, cierra modal emoji
  const handleEmojiPickerHide = () => {
    setShowEmojiPicker(false)
  }
  //funcion seleccionar emoji, lo setea al mensaje
  const handleEmojiClick = (event, emoji) => {
    let message = msg;
    message += emoji.emoji;
    setMsg(message)
  }

  //presiona boton enviar -> funcion enviar mensaje
  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }else{
      textInput.current.focus();
    }
  };
  //funcion enviar mensaje asincrona
  const handleSendMsg = async (msg) => {
    //backend axios envia mensaje
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });
    //socket emite send-msg
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    })
    //añadimos el mensaje nuevo a la variable array messages
    const msgs = [...messages]
    const d = new Date();
    const time = d.getHours() + ":" + d.getMinutes();
    msgs.push({
      fromSelf: true,
      message: msg,
      datetime: time,
    })
    setMessages(msgs)

    //traemos los contactos
    fetchContacts
  };

  //funcion traer el ultimo mensaje del chat
  const getlastmsgByUser = async () => {
    if (currentChat) {
      const lastm = await axios.post(getLastMessagesRoute, {
        from: currentChat._id,
        to: currentUser._id,
      });
      const lastmsgByUser = lastm.data[0].message.text;
      const datetimeContactChat = lastm.data[0].updatedAt;
      //obtenemos los valores y los damos segun el id
      const d = new Date(datetimeContactChat);
      const d_time = d.getHours() + ":" + d.getMinutes();
      const d_date = d.getDate() + "/" + d.getMonth();

      const now = new Date();
      const now_date = now.getDate() + "/" + now.getMonth();

      var datetimechat = d_time + ' ' + d_date;

      if (d_date === now_date) {
        datetimechat = d_time;
      }

      document.getElementById('msg'+currentChat._id+'').innerHTML = lastmsgByUser
      document.getElementById('dtc'+currentChat._id+'').innerHTML = datetimechat
    }
  }
  //hook para traer los mensajes con socket.io
  useEffect(() => {
    const d = new Date();
    const time = d.getHours() + ":" + d.getMinutes();
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({fromSelf:false, message: msg, datetime: time })
      })
    }
  }, [])

  //hook que actualiza el ultimo mensaje enviado cada vez que se brinde un mensaje
  useEffect(() => {
    arrivalMessage && setMessages((prev)=>[...prev, arrivalMessage])
    getlastmsgByUser(currentChat._id)
  }, [arrivalMessage])

  //hook para desplazarse al final de la ref scrollRef (chat)
  useEffect(() => {
    scrollRef.current?.scrollIntoView({behaviur: "smooth"})
  }, [messages])

  
  const handleChangeChatData = (event) => {
    setChatData({ ...chatData, [event.target.name]: event.target.value })
  }
  
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
            </tbody>
          </table>
        </div>
      </div>
      
          
      <Modal show={modal}>
        <div className="modal-dialog" style={{width: '300px'}}>
          <ModalHeader>
            <h4>{currentChat.name} &nbsp; <button className="btn-sm"><IoPencil/></button></h4>
          </ModalHeader>
          <ModalBody>
          <table width='100%'>
            <tbody>
              <tr>
                <td width='80px'>Nombre</td>
                <td><input className="inputr" name="name" value={chatData.name} onChange={(e)=>handleChangeChatData(e)}/></td>
              </tr>
              <tr>
                <td width='80px'>Correo</td>
                <td><input className="inputr" name="email" value={chatData.email} onChange={(e)=>handleChangeChatData(e)}/></td>
              </tr>
              <tr>
                <td width='80px'>Telefono</td>
                <td><input className="inputr" name="phone" value={chatData.phone} onChange={(e)=>handleChangeChatData(e)}/></td>
              </tr>
              <tr>
                <td width='80px'>Pais</td>
                <td><input className="inputr" name="country" value={chatData.country} onChange={(e)=>handleChangeChatData(e)}/></td>
              </tr>
              <tr>
                <td width='80px'>Ciudad</td>
                <td><input className="inputr" name="city" value={chatData.city} onChange={(e)=>handleChangeChatData(e)}/></td>
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
