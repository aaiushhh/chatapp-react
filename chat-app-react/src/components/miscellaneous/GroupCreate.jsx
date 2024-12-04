import { FaDeleteLeft } from "react-icons/fa6";
import { useState, useContext } from "react";
import { handleError, handleSuccess } from "../../utils";
import { UserContext } from "../../context/ContextProvider";
import "./GroupCreate.css";
import { RiArrowGoBackFill } from "react-icons/ri";
import { TbUsersGroup } from "react-icons/tb";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GroupCreate = ({ setCreateGroup }) => {
    const navigate = useNavigate();
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setselectedUser] = useState([]);
    const { user, chats, setchats } = useContext(UserContext);

    const handleSearchChange = async (e) => {
        setSearch(e.target.value);
        if (!e.target.value) {
            setSearchResult([]); // Clear results if input is empty
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };

            const { data } = await axios.get(`http://localhost:3000/auth/getuser?search=${search}`, config);
            if (data.success) {
                console.log(data.users);
                setSearchResult(data.users);
            } else {
                setSearchResult([]);
            }
        } catch (error) {
            handleError("Error Occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleGroupChatNameChange = (e) => {
        setGroupChatName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!groupChatName || selectedUser.length === 0) { // Check if selectedUser has users
            handleError("Please fill all the fields!");
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };

            const { data } = await axios.post(`http://localhost:3000/chat/group`, {
                name: groupChatName,
                users: JSON.stringify(selectedUser.map(u => u._id))
            }, config);

            if (data.success) {
                setchats(prevChats => [data.chat, ...prevChats]);
                handleSuccess("Station Created!");
                setTimeout(() => {
                    navigate("/"); // Redirect after a short delay
                }, 3000);
            } else {
                handleError("Failed to create station");
            }
        } catch (error) {
            handleError("Error Occurred");
            console.error("Error creating group chat:", error); // Log the error for debugging
        }
    };

    const handleGroup = (user) => {
        if (selectedUser.includes(user)) {
            handleSuccess("User Already Added!");
            return;
        }
        setselectedUser([...selectedUser, user]);
    };

    const handleDelete = (user) => {
        setselectedUser(selectedUser.filter((sel) => sel.username !== user.username));
    };

    return (
        <div className="create-group-container">
            <div className="header-section">
                <TbUsersGroup className="icon-header" />
                <h2 className="station-title">Create Station</h2>
            </div>
            <form onSubmit={handleSubmit} className="create-group-form">
                <div className="form-field">
                    <label htmlFor="groupChatName">Station Name:</label>
                    <input
                        type="text"
                        id="groupChatName"
                        value={groupChatName}
                        onChange={handleGroupChatNameChange}
                        placeholder="Enter station name"
                        required
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="userSearch">Find Users:</label>
                    <input
                        type="text"
                        id="userSearch"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search for users"
                    />
                </div>
                <div className="selected-users">
                    {selectedUser.map((user) => (
                        <div className="selected-user" key={user.username} onClick={() => handleDelete(user)}>
                            <p>{user.username}</p> <FaDeleteLeft className="delete-icon" />
                        </div>
                    ))}
                </div>
                <div className="search-results">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        searchResult.slice(0, 3).map((user) => (
                            <div key={user.username} className="group-create-user-result" onClick={() => handleGroup(user)}>
                                <img
                                    src={`http://localhost:3000/auth/profilepic/${user.username}`}
                                    alt={`${user.username}'s profile`}
                                    className="group-create-profile-pic"
                                />
                                <div className="group-create-user-info">
                                    <p>{user.username}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <button type="submit" className="submit-button">
                    <TbUsersGroup /> Create Station
                </button>
            </form>
            <button className="back-button" onClick={() => setCreateGroup(false)}>
                <RiArrowGoBackFill /> Go Back
            </button>
        </div>
    );
};

export default GroupCreate;