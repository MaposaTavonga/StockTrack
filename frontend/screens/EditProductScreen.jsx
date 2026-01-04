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

export default function EditProductScreen({ route, navigation }) {
  const product = route.params?.product || {};
  const products = route.params?.products || [];
  const setProducts = route.params?.setProducts || (() => {});

  const [name, setName] = useState(product.name || '');
  const [imageUrl, setImageUrl] = useState(product.image_url || '');
  const [localImage, setLocalImage] = useState(null);
  const [price, setPrice] = useState(product.selling_price?.toString() || '0.00');
  const [stock, setStock] = useState(product.current_stock?.toString() || '0');
  const [lowStock, setLowStock] = useState(product.low_stock_threshold?.toString() || '5');

  // 📸 Pick image from phone
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setLocalImage(result.assets[0].uri);
      setImageUrl(''); // clear URL if image picked
    }
  };

  const handleSave = () => {
    if (!name.trim() || !price.trim() || !stock.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const updatedProduct = {
      ...product,
      name: name.trim(),
      image_url: imageUrl || localImage || null, // use URL or picked image
      selling_price: parseFloat(price) || 0,
      current_stock: parseInt(stock) || 0,
      low_stock_threshold: parseInt(lowStock) || 5,
    };

    const updatedProducts = products.map(p =>
      p.id === product.id ? updatedProduct : p
    );

    setProducts(updatedProducts);

    Alert.alert('Success', 'Product updated successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.label}>Product Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      {/* 🖼 Image Preview */}
      {(localImage || imageUrl) && (
        <Image
          source={{ uri: localImage || imageUrl }}
          style={styles.imagePreview}
        />
      )}

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Ionicons name="image-outline" size={20} color="#2a9d8f" />
        <Text style={styles.imageButtonText}>Upload Image</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <Text style={styles.label}>Image URL</Text>
      <TextInput
        style={styles.input}
        value={imageUrl}
        onChangeText={(text) => {
          setImageUrl(text);
          setLocalImage(null);
        }}
        placeholder="Paste image URL"
      />

      <Text style={styles.label}>Selling Price *</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Current Stock *</Text>
      <TextInput
        style={styles.input}
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Low Stock Threshold</Text>
      <TextInput
        style={styles.input}
        value={lowStock}
        onChangeText={setLowStock}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Ionicons name="save-outline" size={20} color="#fff" />
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2a9d8f',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  imageButtonText: {
    color: '#2a9d8f',
    fontWeight: '600',
    marginLeft: 8,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 8,
    color: '#999',
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#2a9d8f',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
});
