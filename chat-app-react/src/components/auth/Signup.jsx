import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { handleError, handleSuccess } from '../../utils'
import axios from 'axios'
import AppName from '../shared/appName/AppName'
import './Signup.css'

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const navigate=useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Handle signup logic here
    const { username, email, password } = formData;
    if ( !email || !password) {
      return handleError("All fields are required")
    }
    try {
      const url="http://localhost:3000/auth/signup";
      const response = await axios.post(url,formData);
      const { success, message, error } = response.data;

      if (success) {
        handleSuccess(message)
        setTimeout(() => {
          navigate("/login")
        }, 1000)
      } else {
        handleError(message || 'Something went wrong')
      }
    } catch (error) {
      console.log(error.response.data.error)
      if (error.response.data) {
        handleError(error.response.data.error);
      } else {
        handleError(error.response || 'An error occurred');
      }
    }
    console.log(formData)
  }

  return (
    <div className="signup-container">
      <div className="app-name">
        <AppName />
      </div>
      
      <div className="signup-form-wrapper">
        <h1 className="signup-title">Create Account</h1>
        
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
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
            Sign Up
          </button>
          
          <div className="login-link">
            Already have an account?{' '}
            <Link to="/login" className="link">
              Login
            </Link>
          </div>
        </form>
        
        <ToastContainer />
      </div>
    </div>
  )
}

export default Signup