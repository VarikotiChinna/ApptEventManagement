import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { useState } from 'react'
import { db } from './firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

function PhoneLogin({ onSuccess, onRegister }) {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [showOtp, setShowOtp] = useState(false)
  const [message, setMessage] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')

  const checkPhoneAndSendOtp = async () => {
    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      setMessage('Invalid phone number')
      return
    }

    try {
      const q = query(collection(db, 'users'), where('phone', '==', phone))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        setMessage('Phone number not registered. Please register first.')
        setTimeout(() => {
          onRegister()
        }, 2000)
        return
      }

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
      setGeneratedOtp(otpCode)
      setShowOtp(true)
      setMessage(`OTP sent: ${otpCode}`)
      console.log('OTP:', otpCode)
    } catch (error) {
      setMessage(error.message)
    }
  }

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      onSuccess(phone)
    } else {
      setMessage('Invalid OTP')
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Enter your mobile number</Text>

        {message ? <Text style={styles.message}>{message}</Text> : null}

        {!showOtp ? (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Mobile Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 10 digit number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            <TouchableOpacity style={styles.successButton} onPress={checkPhoneAndSendOtp}>
              <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Enter OTP *</Text>
              <TextInput
                style={styles.input}
                placeholder="6 digit OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>

            <TouchableOpacity style={styles.successButton} onPress={verifyOtp}>
              <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowOtp(false)}>
              <Text style={styles.cancelText}>Change Number</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100vh',
    backgroundColor: '#D9EEE1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24
  },
  message: {
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    textAlign: 'center'
  },
  formGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16
  },
  successButton: {
    backgroundColor: '#04AA6D',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  cancelButton: {
    backgroundColor: '#ffb3bb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12
  },
  cancelText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600'
  }
})

export default PhoneLogin
