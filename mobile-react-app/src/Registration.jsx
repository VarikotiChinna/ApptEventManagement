import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { useState, useEffect } from 'react'
import { auth, db } from './firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

function Registration({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    apartmentName: 'Sahasra Serinity',
    flatNumber: '',
    tower: '',
    role: 'owner',
    isCCTMember: false,
    cctRole: ''
  })
  const [message, setMessage] = useState('')
  const [isFormValid, setIsFormValid] = useState(false)

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const isValid = 
      formData.name.trim() !== '' &&
      formData.email.trim() !== '' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.phone.trim() !== '' &&
      /^[6-9][0-9]{9}$/.test(formData.phone) &&
      formData.flatNumber.trim() !== '' &&
      /^[0-9]{3}$/.test(formData.flatNumber) &&
      (!formData.isCCTMember || formData.cctRole.trim() !== '')
    
    setIsFormValid(isValid)
  }

  useEffect(() => {
    validateForm()
  }, [formData])

  const handleRegister = async () => {
    if (!formData.name.trim()) {
      setMessage('Name is mandatory')
      return
    }
    if (!formData.email.trim()) {
      setMessage('Email is mandatory')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setMessage('Invalid email format')
      return
    }
    if (!formData.phone.trim()) {
      setMessage('Phone number is mandatory')
      return
    }
    if (!/^[6-9][0-9]{9}$/.test(formData.phone)) {
      setMessage('Invalid phone number')
      return
    }
    if (!formData.flatNumber.trim()) {
      setMessage('Flat number is mandatory')
      return
    }
    if (!/^[0-9]{3}$/.test(formData.flatNumber)) {
      setMessage('Flat number must be 3 digits')
      return
    }
    if (formData.isCCTMember && !formData.cctRole.trim()) {
      setMessage('CCT Role is mandatory')
      return
    }
    
    try {
      const defaultPassword = `${formData.phone}@Shs`
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, defaultPassword)
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        apartmentName: formData.apartmentName,
        flatNumber: formData.flatNumber,
        tower: formData.tower,
        role: formData.role,
        isCCTMember: formData.isCCTMember,
        cctRole: formData.cctRole,
        createdAt: new Date()
      })
      
      onSuccess('Registration successful!')
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Enroll your Flat</Text>
        <Text style={styles.subtitle}>Join your community</Text>
      </View>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Personal Details</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Full Name *</Text>
          <TextInput
            style={styles.formControl}
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={(val) => updateField('name', val)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Email *</Text>
          <TextInput
            style={styles.formControl}
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(val) => updateField('email', val)}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Phone Number *</Text>
          <TextInput
            style={styles.formControl}
            placeholder="Enter 10 digit phone number"
            value={formData.phone}
            onChangeText={(val) => updateField('phone', val)}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Flat Number *</Text>
          <TextInput
            style={styles.formControl}
            placeholder="3 digits"
            value={formData.flatNumber}
            onChangeText={(val) => updateField('flatNumber', val.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            maxLength={3}
          />
        </View>

        <Text style={styles.sectionTitle}>Staying As</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, formData.role === 'owner' && styles.roleActive]}
            onPress={() => updateField('role', 'owner')}
          >
            <Text style={[styles.roleText, formData.role === 'owner' && styles.roleTextActive]}>
              Owner
            </Text>
          </TouchableOpacity>         
          
          <TouchableOpacity
            style={[styles.roleButton, formData.role === 'tenant' && styles.roleActive]}
            onPress={() => updateField('role', 'tenant')}
          >
            <Text style={[styles.roleText, formData.role === 'tenant' && styles.roleTextActive]}>
              Tenant
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.checkboxContainer}>
          <TouchableOpacity 
            style={styles.checkbox}
            onPress={() => updateField('isCCTMember', !formData.isCCTMember)}
          >
            <View style={[styles.checkboxBox, formData.isCCTMember && styles.checkboxChecked]}>
              {formData.isCCTMember && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>Are you a CCT Member?</Text>
          </TouchableOpacity>
        </View>

        {formData.isCCTMember && (
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>CCT Role *</Text>
            <TextInput
              style={styles.formControl}
              placeholder="Enter your CCT role"
              value={formData.cctRole}
              onChangeText={(val) => updateField('cctRole', val)}
            />
          </View>
        )}

        <TouchableOpacity 
          style={[styles.registerButton, !isFormValid && styles.disabledButton]} 
          onPress={handleRegister}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#D9EEE1',
    padding: 20
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    color: '#666'
  },
  message: {
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    textAlign: 'center'
  },
  form: {
    width: '100%',
    maxWidth: 500
  },
  formGroup: {
    marginBottom: 20
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  formControl: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 10
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20
  },
  roleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  roleActive: {
    borderColor: '#04AA6D',
    backgroundColor: '#04AA6D'
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666'
  },
  roleTextActive: {
    color: '#fff'
  },
  registerButton: {
    backgroundColor: '#04AA6D',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
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
  },
  checkboxContainer: {
    marginBottom: 20
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxChecked: {
    backgroundColor: '#04AA6D',
    borderColor: '#04AA6D'
  },
  checkmark: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333'
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6
  }
})

export default Registration
