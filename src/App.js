import { Card, Tab, Tabs } from '@blueprintjs/core'
import { useCallback, useContext, useEffect, useState } from 'react'
import { UserContext } from './context/UserContext'
import Loader from './components/Loader'
import Login from './components/Login'
import Register from './components/Register'
import Welcome from './components/Welcome'
import Header from './components/Header'
import Footer from './components/Footer'
import RecordList from './components/Recordlist'


function App() {
  const [currentTab, setCurrentTab] = useState('login')
  const [userContext, setUserContext] = useContext(UserContext)

  const verifyUser = useCallback(() => {
    fetch(process.env.REACT_APP_API_ENDPOINT + 'users/refreshToken', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json()
        setUserContext((oldValues) => {
          return { ...oldValues, token: data.token }
        })
      } else {
        setUserContext((oldValues) => {
          return { ...oldValues, token: null }
        })
      }
      // call refreshToken every 5 minutes to renew the authentication token.
      setTimeout(verifyUser, 5 * 60 * 1000)
    })
  }, [setUserContext])

  useEffect(() => {
    verifyUser()
  }, [verifyUser])

  /**
   * Sync logout across tabs
   */
  const syncLogout = useCallback((event) => {
    if (event.key === 'logout') {
      // If using react-router-dom, you may call history.push("/")
      window.location.reload()
    }
  }, [])

  useEffect(() => {
    window.addEventListener('storage', syncLogout)
    return () => {
      window.removeEventListener('storage', syncLogout)
    }
  }, [syncLogout])

  return userContext.token === null ? (
    <div>
      <Header />
      <Card elevation="1">
        <Tabs id="Tabs" onChange={setCurrentTab} selectedTabId={currentTab}>
          <Tab id="login" title="Login" panel={<Login />} />
          <Tab id="register" title="Register" panel={<Register />} />
          <Tabs.Expander />
        </Tabs>
      </Card>
      <Footer />
    </div>
  ) : userContext.token ? (<RecordList />) : (<Loader />)
}

export default App
