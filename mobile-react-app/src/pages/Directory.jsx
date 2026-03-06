import { View, Text, StyleSheet } from 'react-native'

function Directory() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resident Directory</Text>
      <Text style={styles.content}>View all residents contact information</Text>
    </View>
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
    marginBottom: 16
  },
  content: {
    fontSize: 16,
    color: '#666'
  }
})

export default Directory
