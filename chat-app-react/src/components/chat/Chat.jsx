import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import './Chat.css'
import axios from 'axios'
import { handleError, handleSuccess } from '../../utils'
import SideDrawer from '../miscellaneous/SideDrawer'
import ChatBox from './ChatBox'
import MyChats from './MyChats'
import { FaSearch } from "react-icons/fa";
import GroupCreate from '../miscellaneous/GroupCreate'
import { TbUsersGroup } from "react-icons/tb";

const Chat = () => {
    const [inputValue, setInputValue] = useState('');
    const [searchResult, setsearchResult] = useState([])
    const [loading, setloading] = useState(false)
    const [createGroup, setcreateGroup] = useState(false)
    const [fetchAgain, setfetchAgain] = useState(false)
    const [displayDetails, setdisplayDetails] = useState(false)
    const handleInputChange = async (e) => {
        setInputValue(e.target.value);
        if (e.target.value.trim() === '') {
            setsearchResult([]);
            return;
        }
        try {
            setloading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }

            const { data } = await axios.get(`http://localhost:3000/auth/getuser?search=${inputValue}`, config);
            if (data.success) {
                setsearchResult(data.users);
            } else {
                setsearchResult([]);
            }
        } catch (error) {
            handleError("Error Occurred", error);
            setsearchResult([]);
        } finally {
            setloading(false);
        }
    };

    // Fetch initial data when the component mounts
    useEffect(() => {
        const fetchInitialData = async () => {
            setloading(true); // Set loading to true when fetching data
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                };
                const { data } = await axios.get(`http://localhost:3000/chat`, config); // Fetch initial chat data
                if (data.success) {
                    // Handle successful data fetching (e.g., set chats in context)
                }
            } catch (error) {
                handleError("Failed to fetch initial data", error);
            } finally {
                setloading(false); // Set loading to false after fetching
            }
        };

        fetchInitialData(); // Call the function to fetch initial data
    }, []); // Empty dependency array to run only on mount

    return (<>
        <div className='chat-container'>
            <div className='my-chats'>
                <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search User..."
                        value={inputValue}
                        onChange={handleInputChange}
                        className="search-input"

                    />
                </div>

                <button className="create-group-button" onClick={() => setcreateGroup(true)}>
                    <TbUsersGroup /> New Station
                </button>

                {inputValue.trim() === '' ? <MyChats setCreateGroup={setcreateGroup} createGroup={createGroup} fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} displayDetails={displayDetails} setdisplayDetails={setdisplayDetails}/> 
                : <SideDrawer search={inputValue} searchResult={searchResult} loading={loading} />}
            </div>
            <div className='chat-box'>
                {createGroup ? (<GroupCreate setCreateGroup={setcreateGroup} />) : 
                (<ChatBox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} displayDetails={displayDetails} setdisplayDetails={setdisplayDetails} />)}
            </div>
        </div>
        <ToastContainer />
    </>
    );
};

export default Chat;