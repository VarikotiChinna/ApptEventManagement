import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

const events = [
  { id: 'ugadi', name: 'Ugadi', description: 'Kannada New Year celebration', date: '2026-03-22', time: '6:00 PM', location: 'Clubhouse', lastDate: '2026-03-15', adultCost: 200, kidCost: 100 },
  { id: 'ganesha', name: 'Ganesha Festival', description: 'Ganesh Chaturthi celebration', date: '2026-09-05', time: '5:00 PM', location: 'Garden', lastDate: '2026-08-30', adultCost: 150, kidCost: 75 },
  { id: 'dasara', name: 'Dasara', description: 'Dasara festival celebration', date: '2026-10-15', time: '6:00 PM', location: 'Clubhouse', lastDate: '2026-10-10', adultCost: 250, kidCost: 125 },
  { id: 'deepavali', name: 'Deepavali', description: 'Festival of lights', date: '2026-11-04', time: '7:00 PM', location: 'Garden', lastDate: '2026-10-30', adultCost: 200, kidCost: 100 },
  { id: 'sankranti', name: 'Sankranti', description: 'Harvest festival', date: '2026-01-14', time: '5:00 PM', location: 'Clubhouse', lastDate: '2026-01-10', adultCost: 150, kidCost: 75 },
  { id: 'holi', name: 'Holi', description: 'Festival of colors', date: '2026-03-06', time: '10:00 AM', location: 'Garden', lastDate: '2026-03-01', adultCost: 100, kidCost: 50 },
  { id: 'christmas', name: 'Christmas Celebration', description: 'Christmas party', date: '2026-12-25', time: '6:00 PM', location: 'Clubhouse', lastDate: '2026-12-20', adultCost: 300, kidCost: 150 },
  { id: 'newyear', name: 'New Year Celebration', description: 'New Year party', date: '2026-12-31', time: '8:00 PM', location: 'Clubhouse', lastDate: '2026-12-25', adultCost: 500, kidCost: 250 },
  { id: 'independence', name: 'Independence Day Celebration', description: 'Independence Day', date: '2026-08-15', time: '9:00 AM', location: 'Garden', lastDate: '2026-08-10', adultCost: 0, kidCost: 0 },
  { id: 'republic', name: 'Republic Day Celebration', description: 'Republic Day', date: '2026-01-26', time: '9:00 AM', location: 'Garden', lastDate: '2026-01-20', adultCost: 0, kidCost: 0 },
  { id: 'annual', name: 'Apartment Annual Day', description: 'Annual day celebration', date: '2026-06-15', time: '6:00 PM', location: 'Clubhouse', lastDate: '2026-06-10', adultCost: 200, kidCost: 100 },
  { id: 'sports', name: 'Sports Day', description: 'Sports and games', date: '2026-05-10', time: '8:00 AM', location: 'Garden', lastDate: '2026-05-05', adultCost: 50, kidCost: 25 },
  { id: 'cultural', name: 'Cultural Night', description: 'Cultural programs', date: '2026-07-20', time: '7:00 PM', location: 'Clubhouse', lastDate: '2026-07-15', adultCost: 150, kidCost: 75 },
  { id: 'kids', name: 'Kids Day', description: 'Special day for kids', date: '2026-11-14', time: '4:00 PM', location: 'Garden', lastDate: '2026-11-10', adultCost: 100, kidCost: 50 },
  { id: 'lunch', name: 'Community Lunch / Dinner', description: 'Community meal', date: '2026-04-20', time: '12:00 PM', location: 'Clubhouse', lastDate: '2026-04-15', adultCost: 150, kidCost: 75 }
]

function EventRegistration() {
  const [formData, setFormData] = useState({
    event: '',
    flatNumber: '',
    residentName: '',
    mobile: '',
    adults: 0,
    kids: 0,
    foodPreference: 'Veg',
    contribution: 0,
    paymentMode: 'UPI',
    transactionId: '',
    comments: ''
  })
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [message, setMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    // Auto-populate from logged-in user (mock data)
    setFormData(prev => ({
      ...prev,
      residentName: 'John Doe',
      mobile: '9876543210'
    }))
  }, [])

  useEffect(() => {
    if (selectedEvent && formData.adults >= 0 && formData.kids >= 0) {
      const total = (formData.adults * selectedEvent.adultCost) + (formData.kids * selectedEvent.kidCost)
      setFormData(prev => ({ ...prev, contribution: total }))
    }
  }, [formData.adults, formData.kids, selectedEvent])

  const handleEventChange = (eventId) => {
    const event = events.find(e => e.id === eventId)
    setSelectedEvent(event)
    setFormData(prev => ({ ...prev, event: eventId }))
  }

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleRegister = async () => {
    if (!formData.event) {
      setMessage('Please select an event')
      return
    }
    if (!/^[0-9]{3}$/.test(formData.flatNumber)) {
      setMessage('Flat number must be 3 digits')
      return
    }
    if (formData.adults < 0 || formData.kids < 0) {
      setMessage('Adults and kids cannot be negative')
      return
    }
    if (formData.adults + formData.kids > 10) {
      setMessage('Total members cannot exceed 10')
      return
    }

    try {
      const q = query(
        collection(db, 'eventRegistrations'),
        where('event', '==', formData.event),
        where('flatNumber', '==', formData.flatNumber)
      )
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        setMessage('Already registered for this event')
        return
      }

      await addDoc(collection(db, 'eventRegistrations'), {
        ...formData,
        registeredAt: new Date()
      })
      
      setShowSuccess(true)
      setMessage('Registration successful!')
      setTimeout(() => {
        setShowSuccess(false)
        setFormData({
          event: '',
          flatNumber: '',
          residentName: formData.residentName,
          mobile: formData.mobile,
          adults: 0,
          kids: 0,
          foodPreference: 'Veg',
          contribution: 0,
          paymentMode: 'UPI',
          transactionId: '',
          comments: ''
        })
        setSelectedEvent(null)
      }, 3000)
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Event Registration</Text>

      {message && (
        <View style={[styles.message, showSuccess && styles.success]}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Event *</Text>
          <View style={styles.dropdown}>
            <select
              style={styles.select}
              value={formData.event}
              onChange={(e) => handleEventChange(e.target.value)}
            >
              <option value="">Choose an event</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.name}</option>
              ))}
            </select>
          </View>
        </View>

        {selectedEvent && (
          <View style={styles.eventDetails}>
            <Text style={styles.eventTitle}>{selectedEvent.name}</Text>
            <Text style={styles.eventInfo}>📝 {selectedEvent.description}</Text>
            <Text style={styles.eventInfo}>📅 Date: {selectedEvent.date}</Text>
            <Text style={styles.eventInfo}>🕐 Time: {selectedEvent.time}</Text>
            <Text style={styles.eventInfo}>📍 Location: {selectedEvent.location}</Text>
            <Text style={styles.eventInfo}>⏰ Last Date: {selectedEvent.lastDate}</Text>
            <Text style={styles.eventInfo}>💰 Cost: Adults ₹{selectedEvent.adultCost}, Kids ₹{selectedEvent.kidCost}</Text>
          </View>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Flat Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="3 digits"
            value={formData.flatNumber}
            onChangeText={(val) => updateField('flatNumber', val.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            maxLength={3}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Resident Name</Text>
          <TextInput
            style={[styles.input, styles.disabled]}
            value={formData.residentName}
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={[styles.input, styles.disabled]}
            value={formData.mobile}
            editable={false}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.half]}>
            <Text style={styles.label}>Number of Adults *</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={formData.adults.toString()}
              onChangeText={(val) => updateField('adults', parseInt(val) || 0)}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.formGroup, styles.half]}>
            <Text style={styles.label}>Number of Kids *</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={formData.kids.toString()}
              onChangeText={(val) => updateField('kids', parseInt(val) || 0)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Food Preference *</Text>
          <View style={styles.dropdown}>
            <select
              style={styles.select}
              value={formData.foodPreference}
              onChange={(e) => updateField('foodPreference', e.target.value)}
            >
              <option value="Veg">Veg</option>
              <option value="Non Veg">Non Veg</option>
            </select>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Total Contribution</Text>
          <TextInput
            style={[styles.input, styles.contribution]}
            value={`₹ ${formData.contribution}`}
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Payment Mode *</Text>
          <View style={styles.dropdown}>
            <select
              style={styles.select}
              value={formData.paymentMode}
              onChange={(e) => updateField('paymentMode', e.target.value)}
            >
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Online Payment">Online Payment</option>
              <option value="Society Wallet">Society Wallet</option>
            </select>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Transaction ID (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter transaction ID"
            value={formData.transactionId}
            onChangeText={(val) => updateField('transactionId', val)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Comments / Special Request</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Food allergy, Extra chair, Wheelchair support, etc."
            value={formData.comments}
            onChangeText={(val) => updateField('comments', val)}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24
  },
  message: {
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#ffb3bb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff9999'
  },
  success: {
    backgroundColor: '#d4edda',
    borderColor: '#04AA6D'
  },
  messageText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center'
  },
  form: {
    maxWidth: 800
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
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16
  },
  disabled: {
    backgroundColor: '#f5f5f5',
    color: '#666'
  },
  contribution: {
    backgroundColor: '#e8f5e9',
    fontWeight: 'bold',
    fontSize: 18
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: 'top'
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  select: {
    padding: 14,
    fontSize: 16,
    border: 'none',
    outline: 'none',
    width: '100%',
    backgroundColor: 'transparent'
  },
  row: {
    flexDirection: 'row',
    gap: 16
  },
  half: {
    flex: 1
  },
  eventDetails: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#04AA6D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#04AA6D',
    marginBottom: 12
  },
  eventInfo: {
    fontSize: 15,
    color: '#555',
    marginBottom: 8,
    lineHeight: 24
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
    fontSize: 18,
    fontWeight: '600'
  }
})

export default EventRegistration
