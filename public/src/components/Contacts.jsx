import { useState, useEffect } from "react";
import axios from "axios";
import { getLastMessagesRoute } from "../utils/APIRoutes";
export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem('authUser')) {
        const data = await JSON.parse(localStorage.getItem("authUser"));
        setCurrentUserName(data.name);
        setCurrentUser(data)
      }
    }
    fetchData();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  const getlastmsgByUser = async (user) => {
    const lastm = await axios.post(getLastMessagesRoute, {
      from: user,
      to: currentUser._id,
    });
    var lastmsgByUser = lastm.data[0].message.text;
    if (lastmsgByUser.slice(0, 10) === 'data:image') {
      lastmsgByUser = 'Imagen'
    }
    const datetimeContactChat = lastm.data[0].updatedAt;
    
    const d = new Date(datetimeContactChat);
    const d_time = d.getHours() + ":" + d.getMinutes();
    const d_date = d.getDate() + "/" + d.getMonth();

    const now = new Date();
    const now_date = now.getDate() + "/" + now.getMonth();

    var datetimechat = d_time + ' ' + d_date;

    if (d_date === now_date) {
      datetimechat = d_time;
    }else{
    }
    const time = d.getHours() + ":" + d.getMinutes() +' '+ d.getDate() + "/" + d.getMonth();
    document.getElementById('msg'+user+'').innerHTML = lastmsgByUser
    document.getElementById('dtc'+user+'').innerHTML = datetimechat
  }
  return (
    <div className="contacts">
      {contacts.map((contact, index) => {
        getlastmsgByUser(contact._id)
        return (
          <div
            key={contact._id}
            className={`contact ${
              index === currentSelected ? "selected" : ""
            }`}
            onClick={() => changeCurrentChat(index, contact)}
          >
            <div className="profilepic">
              <span>{contact.name.substring(0,2).toLowerCase()}</span>
              {
                contact.isActive === true ? 
                <span style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '12px',
                  backgroundColor: '#1be372',
                  position: 'absolute',
                  marginLeft: '35px',
                  marginTop: '-20px',
                  float: 'right'
                }}></span> 
                : ''
              }
            </div>
            <div className="username">
              <b>{contact.name}</b>
              <span id={`msg${contact._id}`}>...ultimo mensaje</span>
            </div>
            <div className="chattime">
              <span id={`dtc${contact._id}`}>12:00</span>
            </div>
          </div>
        );
      })}
    </div>
  )
}
