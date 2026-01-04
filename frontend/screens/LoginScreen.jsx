import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [pin, setPin] = useState('');

  // Temporary hardcoded PIN (replace with Supabase later)
  const correctPin = '1234';

  const handleLogin = () => {
    if (!pin) {
      Alert.alert('Missing PIN', 'Please enter your PIN.');
      return;
    }

    if (pin === correctPin) {
      navigation.replace('Home');
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
        maxLength={6}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Setup link */}
      <TouchableOpacity
        style={styles.setupLink}
        onPress={() => navigation.navigate('SetupUser')}
      >
        <Text style={styles.setupText}>
          First time using the app?{' '}
          <Text style={styles.setupTextBold}>Set up account</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '70%',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2a9d8f',
    padding: 15,
    width: '70%',
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  setupLink: {
    marginTop: 10,
  },
  setupText: {
    color: '#555',
    fontSize: 14,
  },
  setupTextBold: {
    color: '#2a9d8f',
    fontWeight: '700',
  },
});
