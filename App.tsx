import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  // Seleccionar imagen de la galería
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setImageBase64(result.assets[0].base64 || null);
    }
  };

  // Tomar foto con la cámara
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setImageBase64(result.assets[0].base64 || null);
    }
  };

  // Enviar imagen al backend
  const uploadImage = async () => {
    if (!imageBase64) {
      Alert.alert('No hay imagen para subir');
      return;
    }

    try {
      // Convertir base64 a blob para enviar multipart/form-data
      const blob = await (await fetch(`data:image/jpeg;base64,${imageBase64}`)).blob();

      const formData = new FormData();
      formData.append('imagen', {
        uri: selectedImage!,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);
      formData.append('nombre', 'Foto desde React Native');

      const response = await fetch('http://TU_IP_LOCAL:3000/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const json = await response.json();
      if (response.ok) {
        Alert.alert('Imagen subida', `ID: ${json.id}`);
      } else {
        Alert.alert('Error', json.msg || 'Error desconocido');
      }
    } catch (error) {
      Alert.alert('Error al subir imagen', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 20, fontSize: 20 }}>Capturar imagen</Text>
      <Button title="Seleccionar imagen" onPress={pickImage} />
      <Button title="Tomar fotografía" onPress={takePhoto} />
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      )}
      <Button title="Enviar imagen al servidor" onPress={uploadImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginTop: 20,
    width: 250,
    height: 250,
    borderRadius: 10,
  },
});
