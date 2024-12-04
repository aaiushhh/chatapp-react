/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
// import Home from './components/home/Home'
import Chat from './components/chat/Chat'
import { useState } from 'react'
import RefreshHandler from './layouts/RefreshHandler'
import Navbar from './components/shared/navbar/Navbar'
import Settings from './components/settings/Settings'
import ContextProvider from './context/ContextProvider'


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />
  }

  return (<>
  <ContextProvider>
    <BrowserRouter>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={<Navigate to='/login' />}/>
        <Route path='/home' element={<PrivateRoute children={<><Navbar /><Chat /> </>}/>} />
        <Route path='/settings' element={<PrivateRoute children={<><Navbar /> <Settings /></>}/>} />
        <Route path='/friends' element={<PrivateRoute children={<><Navbar /> </>}/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </BrowserRouter>
    </ContextProvider>
    </>
  )
}

export default App
