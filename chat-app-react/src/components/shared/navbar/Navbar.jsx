import { useContext, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import './Navbar.css'
import { FaUserFriends } from "react-icons/fa"
import { MdChatBubble } from "react-icons/md"
import { IoIosSettings } from "react-icons/io"
import { FaUser } from "react-icons/fa"
import { UserContext } from '../../../context/ContextProvider'

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useContext(UserContext)

    return (
        <div className='navbar-container'>
            <div className='navbar-left'>
                <div className={`nav-item ${location.pathname === '/home' ? 'active' : ''}`}
                    onClick={() => navigate('/home')}>
                    <MdChatBubble />
                    <span>Chat</span>
                </div>
                <div className={`nav-item ${location.pathname === '/friends' ? 'active' : ''}`}
                    onClick={() => navigate('/friends')}>
                    <FaUserFriends />
                    <span>Friends</span>
                </div>
            </div>

            <div className='navbar-center'>
                <Link to="/home" className="navbar-title">
                    <h1 className="navbar-title">Echo Verse</h1>
                </Link>
            </div>

            <div className='app-name-container'>
                <div className="username-display">
                    {user.profilePic ? (
                        <img
                            src={user.profilePic}
                            alt="Profile"
                            className="navbar-profile-pic"
                        />
                    ) : (
                        <FaUser />
                    )}
                    <div className="user-info">
                        <span className="username">{user.username || ""}</span>
                        <span className="bio">{user.bio || "Hey there! I'm using Echo Verse"}</span>
                    </div>
                </div>
                <div className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}>
                    <Link to="/settings" className="settings-button" title="Settings">
                        <IoIosSettings />
                    </Link>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Navbar