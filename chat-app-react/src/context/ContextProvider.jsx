/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect } from 'react';

// Create a context
export const UserContext = createContext();

// Create a provider component
const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({
        username: localStorage.getItem('username') || '',
        email: localStorage.getItem('email') || '',
        bio: localStorage.getItem('bio') || 'Hey there! I\'m using Echo Verse',
        profilePic: localStorage.getItem('profilePic') || null,
        _id:localStorage.getItem("id") || ""
    });

    const [selectedChat, setselectedChat] = useState(null);
    const [chats, setchats] = useState([]);

    // Update local storage whenever user state changes
    useEffect(() => {
        localStorage.setItem('username', user.username);
        localStorage.setItem('email', user.email);
        localStorage.setItem('bio', user.bio);
        localStorage.setItem('profilePic', user.profilePic);
    }, [user]);

    // Function to update user data
    const updateUser = (newUserData) => {
        setUser((prevUser) => ({ ...prevUser, ...newUserData }));
    };

    return (
        <UserContext.Provider value={{ user, updateUser, selectedChat, setselectedChat, chats, setchats }}>
            {children}
        </UserContext.Provider>
    );
};

export default ContextProvider;