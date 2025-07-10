import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Save } from 'lucide-react-native';
import { clientService } from '../services/clientService';
import { router } from 'expo-router';

export default function AddClientForm({ styles }: { styles: any }) {
  const [clientForm, setClientForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    creditLimit: '500',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleAddClient = async () => {
    if (!clientForm.name || !clientForm.phone) {
      Alert.alert('Erreur', 'Nom et téléphone sont requis');
      return;
    }

    setLoading(true);
    try {
      const clientData = {
        ...clientForm,
        creditLimit: parseFloat(clientForm.creditLimit) || 500,
      };

      await clientService.createClient(clientData);
      Alert.alert('Succès', 'Client ajouté avec succès');
      setClientForm({
        name: '',
        phone: '',
        email: '',
        address: '',
        creditLimit: '500',
        notes: '',
      });
      router.push('/clients');
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors de l\'ajout du client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.form}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nom *</Text>
        <TextInput
          style={styles.input}
          value={clientForm.name}
          onChangeText={(text) => setClientForm({ ...clientForm, name: text })}
          placeholder="Nom du client"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Téléphone *</Text>
        <TextInput
          style={styles.input}
          value={clientForm.phone}
          onChangeText={(text) => setClientForm({ ...clientForm, phone: text })}
          placeholder="+216 XX XXX XXX"
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={clientForm.email}
          onChangeText={(text) => setClientForm({ ...clientForm, email: text })}
          placeholder="email@exemple.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Adresse</Text>
        <TextInput
          style={styles.input}
          value={clientForm.address}
          onChangeText={(text) => setClientForm({ ...clientForm, address: text })}
          placeholder="Adresse du client"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Limite de crédit (TND)</Text>
        <TextInput
          style={styles.input}
          value={clientForm.creditLimit}
          onChangeText={(text) => setClientForm({ ...clientForm, creditLimit: text })}
          placeholder="500"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={clientForm.notes}
          onChangeText={(text) => setClientForm({ ...clientForm, notes: text })}
          placeholder="Notes sur le client..."
          multiline
          numberOfLines={3}
        />
      </View>
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={handleAddClient}
        disabled={loading}
      >
        <Save size={20} color="#FFFFFF" />
        <Text style={styles.submitButtonText}>
          {loading ? 'Ajout en cours...' : 'Ajouter Client'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}