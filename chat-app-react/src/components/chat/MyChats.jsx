import "./MyChats.css"
import React, { useState, useContext, useEffect } from 'react';
import { handleError } from '../../utils';
import { UserContext } from '../../context/ContextProvider'; 
import axios from 'axios'; 
import { getSender } from "../../config/ChatLogic";
import { TbUsersGroup } from "react-icons/tb";

const MyChats = ({setCreateGroup,createGroup,fetchAgain,setfetchAgain, displayDetails,setdisplayDetails}) => {
  const [loggedUser, setloggedUser] = useState()
  const { user,selectedChat,setselectedChat,chats, setchats } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  
  const fetchChats = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const { data } = await axios.get(`http://localhost:3000/chat`, config);
      if (data.success) {
        setchats(data.chat); // Update chats in context
      }
    } catch (error) {
      handleError("Failed to fetch chats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setloggedUser(user)
    fetchChats()
  }, [user,fetchAgain])
  
  return (
    <div className="my-chats-container">
      {loading ? (
        <p>Loading chats...</p>
      ) : (
        chats && chats.length > 0 ? (
          chats.map((chat) => {
            const isGroupChat = chat.isGroupChat;
            const sender = isGroupChat ? { username: chat.chatName } : getSender(loggedUser, chat.users);
            return (
              <div 
                key={chat._id} 
                className={`chat-item ${selectedChat && selectedChat._id === chat._id && !createGroup ? 'active-chat' : ''}`} 
                onClick={() => {
                  setselectedChat(chat);
                  setCreateGroup(false);
                  setdisplayDetails(false)
                }}
              >
                {isGroupChat ? (
                  <TbUsersGroup className="group-icon" />
                ) : (
                  <img 
                    src={`http://localhost:3000/auth/profilepic/${sender.username}`}
                    alt={`${sender.username}'s profile`}
                    className="profile-pic"
                  />
                )}
                <div className="user-info">
                  <p>{sender.username}</p>
                  <p>{sender.latestMessage || sender.bio}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p>No chats available.</p>
        )
      )}
    </div>
  )
}
export default MyChats