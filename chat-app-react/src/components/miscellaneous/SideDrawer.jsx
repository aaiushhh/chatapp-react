import React, { useState, useContext } from 'react';
import './SideDrawer.css'; // Import the CSS file for styling
import { handleError, handleSuccess } from '../../utils';
import { UserContext } from '../../context/ContextProvider'; // Import the UserContext
import axios from 'axios'; // Ensure axios is imported
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { ToastContainer } from 'react-toastify';

const SideDrawer = ({ search, searchResult, loading }) => {
  const [loadingChat, setLoadingChat] = useState(false);
  const { setselectedChat, chats, setchats } = useContext(UserContext); // Access setselectedChat from context
  const navigate = useNavigate(); // Use useNavigate hook

  const accessChat = async (userId) => {
    setLoadingChat(true); // Set loading state immediately
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      const { data } = await axios.post(`http://localhost:3000/chat`, { userId }, config); // Use params for query parameters
      if (data.success) {
        if (!chats.find((c) => c._id === data.chat._id)) {
          setchats([data.chat, ...chats]);
        }
        setselectedChat(data.chat); // Update selected chat in context
        handleSuccess("Conversation Success"); // Call handleSuccess only once
        setTimeout(() => {
          navigate("/"); // Use navigate to redirect
        }, 1000);
      } else {
        handleError("Failed to access chat"); // Handle case where success is false
      }
    } catch (error) {
      console.error("Error accessing chat:", error); // Log the error for debugging
      handleError("User communication failed");
    } finally {
      setLoadingChat(false); // Ensure loading state is reset
    }
  };

  return (
    <div className="side-drawer">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {loadingChat ? ( // Show loading spinner when loadingChat is true
            <div className="loading-spinner"></div>
          ) : (
            <>
              {searchResult.length > 0 ? (
                <ul className="user-list">
                  {searchResult.map((user) => (
                    <li key={user._id} className="user-card">
                      <img src={`http://localhost:3000/auth/profilepic/${user.username}`} alt={`${user.username}'s profile`} className="profile-pic" />
                      <div className="user-info" onClick={() => {
                          console.log("Accessing chat for userId:", user._id); // Log the userId
                          accessChat(user._id);
                      }}>
                        <h3>{user.username}</h3>
                        <p>{user.bio}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No results found.</p>
              )}
            </>
          )}
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default SideDrawer;