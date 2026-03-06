import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useState, useEffect } from 'react'
import SplashScreen from './SplashScreen'
import PhoneLogin from './PhoneLogin'
import Dashboard from './Dashboard'
import Registration from './Registration'

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userPhone, setUserPhone] = useState('')
  const [showRegistration, setShowRegistration] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const handleLoginSuccess = (phone) => {
    setUserPhone(phone)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserPhone('')
  }

  const handleRegistrationSuccess = (message) => {
    setShowRegistration(false)
    setToastMessage(message)
    setTimeout(() => setToastMessage(''), 3000)
  }

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />
  }

  if (showRegistration) {
    return <Registration onSuccess={handleRegistrationSuccess} onCancel={() => setShowRegistration(false)} />
  }

  if (isLoggedIn) {
    return <Dashboard phone={userPhone} onLogout={handleLogout} />
  }

  return (
    <View style={styles.container}>
      {toastMessage ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      ) : null}
      
      <PhoneLogin onSuccess={handleLoginSuccess} onRegister={() => setShowRegistration(true)} />
      
      <TouchableOpacity 
        style={styles.registerLink} 
        onPress={() => setShowRegistration(true)}
      >
        <Text style={styles.registerText}>New User? Register Here</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100vh',
    backgroundColor: '#D9EEE1',
    justifyContent: 'center',
    alignItems: 'center'
  },
  registerLink: {
    marginTop: 30,
    padding: 12
  },
  registerText: {
    color: '#04AA6D',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline'
  },
  toast: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: '#04AA6D',
    padding: 16,
    borderRadius: 8,
    zIndex: 1000,
    alignItems: 'center'
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
})

export default App
