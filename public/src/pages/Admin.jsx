import iconCcip from '../assets/icon.png'
import '../assets/admin.css'
import '../assets/modal.css'
import axios from "axios";
import { io } from "socket.io-client";
import { IoChatbubbles, IoSettingsSharp, IoLogOut } from "react-icons/io5";
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react";
import Modal, { ModalHeader, ModalBody, ModalFooter } from '../components/modal';
import Contacts from '../components/Contacts';
import ChatContainer from '../components/ChatContainer';
import { allUsersRoute, host } from "../utils/APIRoutes";

export default function Admin() {
  const navigate = useNavigate();
  const socket = useRef();
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLog, setIsLog] = useState(false)
  const [modal, setModal] = useState(false)
  const [currentChat, setCurrentChat] = useState(undefined);
  const [contacts, setContacts] = useState([]);

  //consultamos si existe el usuario admin con la variable authUser
  useEffect(() => {
    const consultUserLocalStorage = async () => {
      if (!localStorage.getItem('authUser')) {
        //si no volvemos al login y la variable log = false
        navigate("/login");
        setIsLog(true)
      } else {
        //si existe la variable login son los datos del admin y la variable log = true
        setCurrentUser(await JSON.parse(localStorage.getItem('authUser')));
        setIsLog(true)
      }
    }
    consultUserLocalStorage();
  }, []);
  
  //traer contactos
  const fetchContacts = async () => {
    if (currentUser) {
      const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
      setContacts(data.data);
    }
  }

  //hook para traer los contactos chat al cargar
  useEffect(() => {
    fetchContacts();
  }, [currentUser]);

  //hook para setear un usuario con socket, y traer los usarios cada vez que lleguen mensajes
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);

      socket.current.on("msg-recieve", () => {
        fetchContacts()
      })

      socket.current.on("activeUser", () => {
        fetchContacts()
      })
    }
  }, [currentUser]);


  //cerrar sesion
  const logout = async () => {
    //borramos la variable del local
    localStorage.removeItem('authUser');
    navigate("/login");
    setModal(false)
  };

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

  //funcion cambio de chat
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    isLog ? (
      <>
      <div className="adminContainer">
        <div className="adminBox">
          <div className="panel">
            <div className="headerPanel">
              <ul>
                <li><img src={iconCcip} alt="Logo CCIP" /></li>
                {/* <li className='panel-icon'><IoChatbubbles/></li> */}
                {/* <li className='panel-icon'><IoSettingsSharp/></li> */}
              </ul>
            </div>
            <div className="footerPanel">
              <button onClick={() => setModal(true)}><IoLogOut/></button>
            </div>
          </div>
          <div className="options">
            <Contacts contacts={contacts} changeChat={handleChatChange}/>
          </div>
          <div className="chat">
            {currentChat === undefined ? (
              <p>Presiona un contacto para chatear</p>
            ) : (
              <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} fetchContacts={fetchContacts()}/>
            )}
          </div>
        </div>
      </div>
      
      <Modal show={modal}>
        <div className="modal-dialog" style={{width: '300px'}}>
          <ModalHeader>
            <h4>Salir</h4>
          </ModalHeader>
          <ModalBody>
            <p>¿Está seguro de cerrar sesión?</p>
          </ModalBody>
          <ModalFooter>
            <button className='btn' onClick={() => setModal(false)}>No, cancelar</button>
            <button className='btn btn-danger' onClick={logout}>Si, cerrar</button>
          </ModalFooter>
        </div>
      </Modal>
      </>
    ) : (
      <>
        <div className="loader-fh">
          <div className="lds-dual-ring"></div>
        </div>
      </>
    )
  )
}
