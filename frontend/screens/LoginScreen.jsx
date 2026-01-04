import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [pin, setPin] = useState('');

  // Hardcoded PIN for your mom
  const correctPin = '1234'; // you can change this

  const handleLogin = () => {
    if (pin === correctPin) {
      navigation.replace('Home'); // go to Home screen
    } else {
      Alert.alert('Wrong PIN', 'Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>StockTrack 🥜</Text>
      <TextInput
        placeholder="Enter PIN"
        secureTextEntry
        style={styles.input}
        keyboardType="numeric"
        value={pin}
        onChangeText={setPin}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '70%',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2a9d8f',
    padding: 15,
    width: '70%',
    borderRadius: 8,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
});
