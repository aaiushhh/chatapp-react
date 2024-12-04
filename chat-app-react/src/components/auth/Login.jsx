import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handleError, handleSuccess } from '../../utils'
import axios from 'axios'
import { UserContext } from '../../context/ContextProvider'
import "./Login.css"
import AppName from '../shared/appName/AppName'
const Login = () => {
  const navigate = useNavigate()
  const { updateUser } = useContext(UserContext)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { email, password } = formData;
    if (!email || !password) {
      return handleError("All fields are required")
    }
    try {
      const url = "http://localhost:3000/auth/login";
      const response = await axios.post(url, formData);
      const { success, message,token,username, bio,_id } = response.data;

      if (success) {
        handleSuccess(message)
        updateUser({ username, email, bio, profilePic: `http://localhost:3000/auth/profilepic/${username}`, _id:_id })
        localStorage.setItem("token",token)
        setTimeout(() => {
          
          navigate("/home")
        }, 1000)
      } else {
        handleError(message || 'Something went wrong')
      }
    } catch (error) {
      if (error.response?.data?.error) {
        handleError(error.response.data.error);
      } else {
        handleError(error.response?.data?.message || 'An error occurred');
      }
    }
  }

  return (
    <div className="login-container">
      <div className="app-name"><AppName/></div>
      
      <div className="login-form-wrapper">
        <h1 className="login-title">Login</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              autoFocus
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            className="submit-button"
          >
            Login
          </button>

          <div className="signup-link">
            Don't have an account?{' '}
            <Link to="/signup">Sign Up</Link>
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  )
}

export default Login