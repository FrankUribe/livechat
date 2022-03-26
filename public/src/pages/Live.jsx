import '../assets/live.css'
import { useState, useRef } from "react";
import iconCcip from '../assets/icon.png'
import { IoSend } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Live() {  

  const [msg, setMsg] = useState("");
  
  const textInput = useRef(null);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  }

  const sendChat = (event) => {
    event.preventDefault();
    if (msg==='') {
      textInput.current.focus();
    }
  };

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
            <h4>Mensajes</h4>
          </div>
        </div>
        <div className="chatFooter">
          <form className="input-container"  onSubmit={(event) => sendChat(event)}>
            <input
              type="text"
              placeholder="Escribe un mensaje aqui"
              onChange={(e) => setMsg(e.target.value)}
              value={msg}
              ref={textInput}
            />
            <button type="submit"><IoSend/></button>
          </form>
        </div>
      </div>
    </div>
    <ToastContainer/>
    </>
  )
}
