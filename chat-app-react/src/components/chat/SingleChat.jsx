/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import './SingleChat.css';
import { UserContext } from '../../context/ContextProvider';
import { useContext, useState, useEffect, useRef } from 'react';
import { TbUsersGroup } from "react-icons/tb";
import { getSender } from "../../config/ChatLogic";
import { handleError } from '../../utils';
import axios from 'axios';
import io from "socket.io-client";
const ENDPOINT = "http://localhost:3000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setfetchAgain, displayDetails, setdisplayDetails }) => {
  const { user, selectedChat, setselectedChat } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketConnected, setsocketConnected] = useState(false);
  const chatDisplayRef = useRef(null);
  const lastMessageRef = useRef(null);
  const isInitialMount = useRef(true);

  // Improved scroll to bottom function with smooth behavior
  const scrollToBottom = (behavior = 'smooth') => {
    lastMessageRef.current?.scrollIntoView({ behavior, block: 'end' });
  };

  // Initialize socket connection
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => {
      setsocketConnected(true);
    });

    return () => {
      socket.off("setup");
      socket.off("connection");
    };
  }, []);

  // Set up message listener with automatic scrolling
  useEffect(() => {
    socket.on("message-received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        return;
      }
      
      setMessages(prevMessages => {
        if (!prevMessages.find(msg => msg._id === newMessageReceived._id)) {
          // Schedule scroll after state update
          setTimeout(scrollToBottom, 100);
          return [...prevMessages, newMessageReceived];
        }
        return prevMessages;
      });
    });

    return () => {
      socket.off("message-received");
    };
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const { data } = await axios.get(`http://localhost:3000/message/${selectedChat._id}`, config);
      if (data.success) {
        setMessages(data.chat);
        socket.emit("join-chat", selectedChat._id);
        // Scroll to bottom after messages load with instant behavior
        setTimeout(() => scrollToBottom('instant'), 100);
      }
    } catch (error) {
      handleError("Couldn't fetch messages.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      e.preventDefault();
      const messageToSend = newMessage;
      setNewMessage(""); // Clear input immediately for better UX

      // Optimistically add the message locally
      const optimisticMessage = {
        _id: Date.now().toString(),
        content: messageToSend,
        sender: user,
        chat: selectedChat,
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, optimisticMessage]);
      // Scroll after adding optimistic message
      setTimeout(scrollToBottom, 100);

      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        };
        const { data } = await axios.post(`http://localhost:3000/message/`, {
          content: messageToSend,
          chatId: selectedChat._id
        }, config);
        
        if (data.success) {
          socket.emit("new-message", data.chat);
          setfetchAgain(!fetchAgain);
          
          setMessages(prev => prev.map(msg => 
            msg._id === optimisticMessage._id ? data.chat : msg
          ));
        }
      } catch (error) {
        setMessages(prev => prev.filter(msg => msg._id !== optimisticMessage._id));
        handleError("Couldn't deliver message.");
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  // Fetch messages and scroll when chat changes
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // Auto-scroll on new messages if near bottom
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      scrollToBottom('instant');
    } else {
      const chatDisplay = chatDisplayRef.current;
      if (chatDisplay) {
        const isNearBottom = chatDisplay.scrollHeight - chatDisplay.scrollTop - chatDisplay.clientHeight < 100;
        if (isNearBottom) {
          scrollToBottom();
        }
      }
    }
  }, [messages]);

  if (!selectedChat) {
    return (
      <div className="single-chat-container">
        <div className="start-chat fancy-start-chat">
          <p>Start Chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="single-chat-container">
      <div className="chat-window">
        <div className="chat-header fancy-header">
          <button className="singe-back-button" onClick={() => setselectedChat(null)}>Go Back</button>
          <div className="header-info">
            {selectedChat.isGroupChat ? (
              <>
                <TbUsersGroup className="group-icon" size={40} onClick={() => setdisplayDetails(!displayDetails)} />
                <span className="group-name">{selectedChat.chatName}</span>
              </>
            ) : (
              <>
                <img
                  src={`http://localhost:3000/auth/profilepic/${getSender(user, selectedChat.users).username}`}
                  alt={`${getSender(user, selectedChat.users).username}'s profile`}
                  className="fancy-profile-pic"
                  onClick={() => setdisplayDetails(!displayDetails)}
                />
                <p className="fancy-username">{getSender(user, selectedChat.users).username}</p>
              </>
            )}
          </div>
        </div>
        <div className="chat-ui">
          {displayDetails ? (
            <div className="details-view">
              <button className="details-go-back" onClick={() => setdisplayDetails(false)}>Go Back</button>
              {selectedChat.isGroupChat ? (
                <>
                  <TbUsersGroup className="group-icon" size={50} />
                  <h3>{selectedChat.chatName}</h3>
                  <ul className="user-list-container">
                    {selectedChat.users.map(u => (
                      <li key={u._id} className="user-card-details">
                        <img
                          src={`http://localhost:3000/auth/profilepic/${u.username}`}
                          alt={`${u.username}'s profile`}
                          className="user-profile-pic"
                        />
                        <div className="user-info">
                          <span className="user-username">{u.username}</span>
                          <span className="user-bio">{u.bio}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="user-details-card">
                  <img
                    src={`http://localhost:3000/auth/profilepic/${getSender(user, selectedChat.users).username}`}
                    alt={`${getSender(user, selectedChat.users).username}'s profile`}
                    className="user-profile-pic-large"
                  />
                  <div className="user-info">
                    <span className="user-username">{getSender(user, selectedChat.users).username}</span>
                    <span className="user-bio">{getSender(user, selectedChat.users).bio}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            loading ? <p>Loading...</p> :
              <div className='chat-ui-container'>
                <div className='chat-display' ref={chatDisplayRef}>
                  {messages.map((msg, index) => {
                    const isSentByUser = msg.sender.username === user.username;
                    const isLastMessage = index === messages.length - 1;
                    return (
                      <div 
                        key={msg._id} 
                        ref={isLastMessage ? lastMessageRef : null}
                        className={`message ${isSentByUser ? 'message-sent' : 'message-received'}`}
                        style={{
                          alignSelf: isSentByUser ? 'flex-end' : 'flex-start',
                          // padding: '8px 12px',
                          borderRadius: '12px',
                          maxWidth: '70%',
                          // marginBottom: '8px',
                          wordWrap: 'break-word'
                        }}
                      >
                        <span className="message-sender" style={{ fontWeight: 'bold', marginRight: '4px' }}>
                          {msg.sender.username}:
                        </span>
                        <span className="message-content">{msg.content}</span>
                      </div>
                    );
                  })}
                </div>
                <form className='chat-send' onKeyDown={sendMessage}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={typingHandler}
                    placeholder="Type your message..."
                    className="message-input"
                  />
                </form>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleChat;