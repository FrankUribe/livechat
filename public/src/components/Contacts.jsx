import { useState, useEffect } from "react";
export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem('authUser')) {
        const data = await JSON.parse(localStorage.getItem("authUser"));
        setCurrentUserName(data.name);
      }
    }
    fetchData();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  return (
    <div className="contacts">
      {contacts.map((contact, index) => {
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
            </div>
            <div className="username">
              <b>{contact.name}</b>
              <span>...ultimo mensaje</span>
            </div>
          </div>
        );
      })}
    </div>
  )
}
