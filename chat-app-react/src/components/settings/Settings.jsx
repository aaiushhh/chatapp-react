import React, { useContext, useState, useEffect } from 'react';
import './Settings.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleError, handleSuccess } from '../../utils';
import { ToastContainer } from 'react-toastify';
import { UserContext } from '../../context/ContextProvider'; // Import the UserContext

const Settings = () => {
    const navigate = useNavigate();
    const { user, updateUser } = useContext(UserContext); // Access the context
    const [username, setUsername] = useState(user.username);
    const [bio, setBio] = useState(user.bio);
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState(user.profilePic);

    useEffect(() => {
        setProfilePicUrl(user.profilePic);
    }, [user]);

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("email", user.email);
        formData.append('username', username);
        formData.append('bio', bio);
        
        if (profilePic) {
            formData.append('profilePic', profilePic);
        }

        try {
            const response = await axios.put('http://localhost:3000/auth/update-profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                updateUser({ username, bio, profilePic: `http://localhost:3000/auth/profilepic/${username}` }); // Update context
                handleSuccess('Settings saved successfully!');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            handleError('Failed to save settings. Please try again.');
        }
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setProfilePicUrl(URL.createObjectURL(file));
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        handleSuccess('Logged out successfully!');
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    };

    return (
        <div className="settings-container">
            <div className="settings-form">
                <h1>Account Settings</h1>
                <div className="form-group">
                    <label htmlFor="profile-pic" className="profile-pic-label">
                        <img
                            src={profilePicUrl || '/path/to/default/image.png'} 
                            alt="Profile Preview"
                            className="profile-pic"
                        />
                        <input
                            type="file"
                            id="profile-pic"
                            accept="image/*"
                            onChange={handleProfilePicChange}
                            style={{ display: 'none' }} // Hide the default file input
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself"
                    />
                </div>
                <button className="save-button" onClick={handleSave}>Save Changes</button>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Settings;