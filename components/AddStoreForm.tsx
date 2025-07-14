import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { storeService, CreateStoreData } from '../services/storeService';
import { useLoading } from '../contexts/LoadingContext';

export default function AddStoreForm({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (store: any) => void;
}) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const { showLoading, hideLoading, setLoadingMessage } = useLoading();

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Erreur', 'Le nom du magasin est requis');
      return;
    }

    try {
      showLoading();
      setLoadingMessage('Création du magasin...');

      const storeData: CreateStoreData = {
        name: name.trim(),
        address: address.trim(),
        phone: phone.trim(),
      };

      const newStore = await storeService.createStore(storeData);
      
      // Reset form
      setName('');
      setAddress('');
      setPhone('');
      onClose();
      
      if (onSubmit) {
        onSubmit(newStore);
      }
      
      Alert.alert('Succès', 'Magasin créé avec succès!');
    } catch (error: any) {
      console.error('Error creating store:', error);
      Alert.alert('Erreur', error.message || 'Impossible de créer le magasin');
    } finally {
      hideLoading();
      setLoadingMessage(undefined);
    }
  };

  const handleClose = () => {
    setName('');
    setAddress('');
    setPhone('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modal}>
          <Text style={modalStyles.title}>Ajouter un magasin</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Nom du magasin *"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={modalStyles.input}
            placeholder="Adresse"
            value={address}
            onChangeText={setAddress}
            multiline
          />
          <TextInput
            style={modalStyles.input}
            placeholder="Téléphone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <View style={modalStyles.actions}>
            <TouchableOpacity style={modalStyles.cancelButton} onPress={handleClose}>
              <Text style={modalStyles.cancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={modalStyles.confirmButton} onPress={handleSubmit}>
              <Text style={modalStyles.confirmText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(31,41,55,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});