import { View, Text, StyleSheet } from 'react-native'

function Feedback() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feedback</Text>
      <Text style={styles.content}>Share your feedback and suggestions</Text>
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

export default Feedback
