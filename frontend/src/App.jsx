import { useEffect, useState } from "react"
import api from "./api/api"
import LoginPage from "./components/LoginPage"
import User from "./components/User"
import Institution from "./components/Institution"

function App() {
 
  const [user, setUser] = useState(null)
  const token = localStorage.getItem('token')

  function getUser() {
    try {
      const response = api.get('/user')
      const data = response.data
      console.log(data);
      data && setUser({
        email: data.email,
        userType: data.user_type
      })
      localStorage.setItem('token',data.token)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (token) {
      console.log('checking token');
      getUser()
    } else {
      console.log('no token available');
      
    }
  },[user, token])

  return (
    <div>
      {user
        ? (user.userType === 'user' ? <User /> : user.userType === 'institution' && <Institution />) 
        :
      <LoginPage />}
    </div>
  )
}

export default App
