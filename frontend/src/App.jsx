import { useEffect, useState } from "react"
import api from "./api/api"
import LoginPage from "./components/LoginPage"
import User from "./components/User"
import Institution from "./components/Institution"

function App() {
 
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState(null)
  const [publicAddress, setPublicAddress] = useState(null)
  const token = localStorage.getItem('token')

  async function getUser() {
    try {
      const response = await api.get('/user')
      const data = response.data
      console.log(data);
      data && setUser(data.email)
      data && setUserType(data.user_type)
      data && setPublicAddress(data.public_key)
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setPublicAddress(null)
    setUserType(null)
  }

  useEffect(() => {
    if (token) {
      console.log('checking token');
      getUser()
    } else {
      console.log('no token available');
    }
  },[user, userType, token])

  return (
    <div>
      {(user && userType && publicAddress)
        ? (userType === 'user' ? <User /> : userType === 'institution' && <Institution />) 
        :
        <LoginPage getUser={getUser} />}
      
      <b onClick={handleLogout}>Logout</b>
    </div>
  )
}

export default App
