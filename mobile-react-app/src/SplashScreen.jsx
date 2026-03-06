import { View, Text, StyleSheet, Image } from 'react-native'
import { useEffect } from 'react'

function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish()
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: '/splash.gif' }} 
        style={styles.gif}
        resizeMode="contain"
      />
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
  gif: {
    width: 300,
    height: 300
  }
})

export default SplashScreen
