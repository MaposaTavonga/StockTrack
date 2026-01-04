import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function AddProductScreen({ route, navigation }) {
  const products = route.params?.products || [];
  const setProducts = route.params?.setProducts || (() => {});
  const userId = route.params?.userId || 'local-user';

  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [lowStock, setLowStock] = useState('5');

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow access to photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageUrl('');
    }
  };

  const handleSave = () => {
    if (!name || !price || !stock) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      user_id: userId,
      name: name.trim(),
      image_url: image || imageUrl || null,
      selling_price: parseFloat(price),
      current_stock: parseInt(stock),
      low_stock_threshold: parseInt(lowStock),
      archived: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setProducts([...products, newProduct]);

    Alert.alert('Success', 'Product added successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>Add Product</Text>

      {/* Image preview */}
      {(image || imageUrl) && (
        <Image
          source={{ uri: image || imageUrl }}
          style={styles.image}
        />
      )}

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Ionicons name="image-outline" size={20} color="#fff" />
        <Text style={styles.imageButtonText}>Upload Image</Text>
      </TouchableOpacity>

      <Text style={styles.or}>OR</Text>

      <TextInput
        style={styles.input}
        placeholder="Image URL (optional)"
        value={imageUrl}
        onChangeText={text => {
          setImageUrl(text);
          setImage(null);
        }}
      />

      <Text style={styles.label}>Product Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Peanut Butter"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Selling Price *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 45.00"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Text style={styles.label}>Starting Stock *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 20"
        keyboardType="numeric"
        value={stock}
        onChangeText={setStock}
      />

      <Text style={styles.label}>Low Stock Alert</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={lowStock}
        onChangeText={setLowStock}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Ionicons name="add-circle-outline" size={22} color="#fff" />
        <Text style={styles.saveButtonText}>Add Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    marginBottom: 12,
  },
  imageButton: {
    flexDirection: 'row',
    backgroundColor: '#457b9d',
    padding: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 15,
    marginLeft: 8,
    fontWeight: '600',
  },
  or: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#999',
    fontSize: 13,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#2a9d8f',
    padding: 16,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
