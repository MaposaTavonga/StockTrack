import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to StockTrack 🥜</Text>
      <Text style={styles.subtitle}>Manage your products and sales</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Text style={styles.buttonText}>➕ Add Product</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Products')}
      >
        <Text style={styles.buttonText}>📦 View Products</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, marginBottom: 30, textAlign: 'center', color: '#555' },
  button: {
    backgroundColor: '#f4a261',
    padding: 15,
    width: '80%',
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
});
