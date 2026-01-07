import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');

const handleLogin = async () => {
  if (!email) {
    Alert.alert('Missing Email', 'Please enter your email.');
    return;
  }

  if (!pin) {
    Alert.alert('Missing PIN', 'Please enter your PIN.');
    return;
  }

  try {
     const BACKEND_URL = 'http://192.168.0.126:3000/api/users/login';
  const response = await fetch(BACKEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, pin }),
  });

  console.log('Response status:', response.status);
  const text = await response.text();
  console.log('Raw response:', text);

  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    console.error('Failed to parse JSON', err);
    Alert.alert('Error', 'Server did not return valid JSON');
    return;
  }

  if (data.success) {
    console.log('Login successful', data);
    navigation.replace('Home');
  } else {
    Alert.alert('Login Failed', data.message || 'Invalid credentials.');
  }
} catch (error) {
  console.error('Fetch error:', error);
  Alert.alert('Error', 'Unable to connect to server.');
}

};


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>StockTrack 🥜</Text>

        {/* Email Label */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* PIN Label */}
        <Text style={styles.label}>PIN / Password</Text>
        <TextInput
          placeholder="Enter your PIN"
          secureTextEntry
          style={styles.input}
          keyboardType="numeric"
          value={pin}
          onChangeText={setPin}
          maxLength={6}
        />

        {/* Login Button */}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  label: {
    width: '70%',
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '70%',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
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
