import '../assets/live.css'
import { useState, useEffect, useRef } from "react";
import Picker from 'emoji-picker-react';
import iconCcip from '../assets/icon.png'
import { IoSend, IoHappy, IoAdd, IoCamera } from "react-icons/io5";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { io } from "socket.io-client";
import { getAdminUser, getMessagesRoute, newChatUserRoute, sendMessageRoute, updateIsActiveRoute, host } from "../utils/APIRoutes";

// window.global = window;
export default function Live() {
  const textInput = useRef(null);
  const [msg, setMsg] = useState("");
  const [formComplete, setFormComplete] = useState("");
  const [currentUser, setCurrentUser] = useState(undefined);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [adminUser, setAdminUser] = useState({})
  const [messages, setMessages] = useState([]);
  const [userChat, setUserChat] = useState({
    name: "",
    email: "",
  })
  const scrollRef = useRef();
  const socket = useRef();
  const addToMsg = useRef(null);
  const imageToMsg = useRef(null)
  const addToMsgButton = useRef(null);
  const [baseImage, setBaseImage] = useState("");
  const [stateAddToMsg, setStateAddToMsg] = useState(false);
  const [stateImgToMsg, setStateImgToMsg] = useState(false);

  //si existe un chat user en el local
  useEffect(() => {
    if (!localStorage.getItem('chatUser')) {
      return false
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem('chatUser')));
      const pk = JSON.parse(localStorage.getItem('chatUser'))._id
      axios.post(updateIsActiveRoute, {
        id: pk,
        status: true,
      })
      socket.current = io(host);
      socket.current.emit("setActiveUser")
      return true
    }
  }, []);

  const handleisActive = async () => {
    await axios.post(updateIsActiveRoute, {
      id: currentUser._id,
      status: true,
    })
  };
  const handleisNotActive = async () => {
    await axios.post(updateIsActiveRoute, {
      id: currentUser._id,
      status: false,
    })
  };

  window.onbeforeunload = function (e) {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("setActiveUser")
      handleisNotActive()
    }
  };

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
        to: adminUser._id,
      });
      setMessages(response.data);
    }
  }, [adminUser])

  useEffect(() => {
    const getAdmin = async () => {
      const { data } = await axios.post(getAdminUser);
      if (data.status === false) {
      }
      if (data.status === true) {
        setAdminUser(data.user)
      }
    }
    getAdmin()
  },[])
  
  
  
  const handleAddToMsgHideShow = () => {
    if (stateAddToMsg===true) {
      addToMsg.current.style.display = 'none'
      addToMsgButton.current.style.transform = 'rotate(0deg)'
      addToMsgButton.current.style.transition = 'transform .2s ease-in-out'
      handleEmojiPickerHide()
    }else{
      addToMsg.current.style.display = 'flex'
      addToMsgButton.current.style.transform = 'rotate(45deg)'
      addToMsgButton.current.style.transition = 'transform .2s ease-in-out'
    }
    setStateAddToMsg(!stateAddToMsg)
  }

  const handleChange = (event) => {
    setUserChat({ ...userChat, [event.target.name]: event.target.value })
  }

  const handleValidation = () => {
    const inputname = document.getElementById('name');
    const inputemail = document.getElementById('email');
    const inputs = [  inputname, inputemail ];
    const {name,email} = userChat;
    if (name==='' || email==='' ) {
      inputs.forEach((input) => {
        if (input.value==='') {
          input.style.border = "1px solid red";
        }else{
          input.style.border = "1px solid #aaa";
        }
      });
      setFormComplete('Completa los campos')
      return false;
    }else{
      setFormComplete('')
      inputs.forEach((input) => {
        input.style.border = "1px solid #aaa";
      });
      return true;
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation() && !currentUser){
      const { email, name } = userChat;
      const { data } = await axios.post(newChatUserRoute, {
        email,
        name,
      });
      if (data.status === false) {
        setFormComplete('No se pudo guardar')
      }
      if (data.status === true) {
        localStorage.setItem('chatUser', JSON.stringify(data.user))
        setCurrentUser(await JSON.parse(localStorage.getItem('chatUser')));
        setTimeout(
          function(){
            sendIniciarMsg(data.user)
          }, 2000);
      }
    }
  }
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
      to: adminUser._id,
      message: msg,
    });
    socket.current.emit("send-msg", {
      to: adminUser._id,
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

  const sendIniciarMsg = async (user) => {
    await axios.post(sendMessageRoute, {
      from: user._id,
      to: adminUser._id,
      message: "Iniciar",
    });
    const msgs = [...messages]
    const d = new Date();
    const time = d.getHours() + ":" + d.getMinutes();
    msgs.push({
      fromSelf: true,
      message: "Iniciar",
      datetime: time,
    })
    
    setMessages(msgs)

    setTimeout(
      function(){
        sendWellcomeMsg(user)
      }
    ,1000);
  };

  const sendWellcomeMsg = async (user) => {
    await axios.post(sendMessageRoute, {
      from: adminUser._id,
      to: user._id,
      message: "Hola "+user.name+" un asistente se unirá al chat en breve 😃",
    });
    const msgs = [...messages]
    const d = new Date();
    const time = d.getHours() + ":" + d.getMinutes();
    msgs.push({
      fromSelf: false,
      message: "Hola "+user.name+" un asistente se unirá al chat en breve 😃",
      datetime: time,
    })
    setMessages(msgs)
  };

  
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);

      const d = new Date();
      const time = d.getHours() + ":" + d.getMinutes();
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({fromSelf:false, message: msg, datetime: time})
      })
    }
  }, [currentUser]);

  useEffect(() => {
    arrivalMessage && setMessages((prev)=>[...prev, arrivalMessage])
  }, [arrivalMessage])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behaviur: "smooth"})
  }, [messages])


  
  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setBaseImage(base64);
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleImgHideShow = () => {
    if (stateImgToMsg===true) {
      imageToMsg.current.style.display = 'none'
      setBaseImage("");
    }else{
      imageToMsg.current.style.display = 'flex'
    }
    setStateImgToMsg(!stateImgToMsg)
  }
  
  const handleSendImgMsg = () => {
    handleSendMsg(baseImage)
    handleImgHideShow()
    handleAddToMsgHideShow()
  }
  return (
    <>
    <div className="chatContainer">
      <div className="chatBox">
        <div className="chatHeader">
          <div className="iconChat">
            <img src={iconCcip} alt="Chatea con CCIP" />
          </div>
          <h3>Chatea con CCIP</h3>
        </div>
        <div className="chatBody">
          <div className="msgs">
          {
            currentUser ? (
              <div className="chat-messages">
                {messages.map((message) => {
                  return (
                    <div ref={scrollRef} key={uuidv4()}>
                      <div
                        className={`message ${
                          message.fromSelf ? "sended" : "recieved"
                        }`}
                      >
                        <div className="content ">
                          {
                            message.message.slice(0, 10) === 'data:image' ?
                            <>
                              <img src={message.message} 
                              style={{
                                width: '100%',
                                borderRadius: '10px'
                              }}
                              />
                              <small>{message.datetime}</small>
                            </>
                            :
                            <>
                              <p>{message.message}
                              <small>{message.datetime}</small>
                              </p>
                            </>
                          }
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="registerChat">
                <form onSubmit={(event) => handleSubmit(event)}>                
                  <h4>Por favor, necesitamos estos datos</h4>
                  <input type="text" placeholder="Nombre" name="name" id="name" onChange={(e)=>handleChange(e)}/>
                  <input type="email" placeholder="Email" name="email" id="email" onChange={(e)=>handleChange(e)}/>
                  <p style={{fontsize: '10px', color:'red'}}>{formComplete}</p>
                  <button type="submit">Iniciar</button>
                </form>
              </div>
            )
          }
          </div>
        </div>
        <div className="chatFooter">
          {
            currentUser ? (
              <>
              <div className="emoji">
                <button ref={addToMsgButton} onClick={handleAddToMsgHideShow}><IoAdd/></button>
                <div className="addToMsg" ref={addToMsg}>
                  <button onClick={handleImgHideShow}><IoCamera/></button>
                  <button onClick={handleEmojiPickerHideShow}><IoHappy/></button>
                </div>
                {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick}/>}
              </div>
              <form className="input-container" onSubmit={(event) => sendChat(event)}>
                <input
                  type="text"
                  placeholder={'Escribe un mensaje '+currentUser.name}
                  onChange={(e) => setMsg(e.target.value)}
                  value={msg}
                  ref={textInput}
                  onClick={handleEmojiPickerHide}
                />
                <button type="submit"><IoSend/></button>
              </form>
              </>
            ) : (
              <center style={{textAlign: 'center', width: '100%'}}>Completa los datos para iniciar el chat</center>
            )
          }
        </div>
      </div>
      
    <div className="addImageChatUser" ref={imageToMsg}>
      <input
        type="file"
        accept="image/jpeg"
        onChange={(e) => {
          uploadImage(e);
        }}
      />
      {
        baseImage !== "" ?
        <>
        <img src={baseImage} />
        <div className="btns">
          <button className="btn" onClick={handleImgHideShow}>x</button>
          <button className="btn btn-primary" onClick={handleSendImgMsg}>Enviar</button>
        </div>
        </>
        :
        <button className="btn btn-primary" onClick={handleImgHideShow}>x</button>
      }
    </div>
    </div>
    </>
  )
}
