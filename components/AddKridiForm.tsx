import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Save, Search } from 'lucide-react-native';
import { kridiService } from '../services/kridiService';
import { clientService, Client } from '../services/clientService';
import { router } from 'expo-router';

export default function AddKridiForm({ styles }: { styles: any }) {
  const [kridiForm, setKridiForm] = useState({
    clientId: '',
    amount: '',
    reason: '',
    type: 'debt' as 'debt' | 'payment',
  });
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [clientDebt, setClientDebt] = useState<number | null>(null);

  useEffect(() => {
    fetchClients();
  }, [search]);

  useEffect(() => {
    if (kridiForm.clientId) {
      fetchClientDebt(kridiForm.clientId);
    } else {
      setClientDebt(null);
    }
  }, [kridiForm.clientId]);

  const fetchClients = async () => {
    try {
      const res = await clientService.getClients(1, 20, search);
      setClients(res.clients || []);
    } catch (error) {
      setClients([]);
    }
  };

  // Fetch the selected client's current kridi debt
  const fetchClientDebt = async (clientId: string) => {
    try {
      const res = await clientService.getClient(clientId);
      // Assume the client object has totalDebt and totalPaid fields
      const debt = (res.totalDebt || 0) - (res.totalPaid || 0);
      setClientDebt(debt);
    } catch (error) {
      setClientDebt(null);
    }
  };

  const handleAddKridi = async () => {
    if (!kridiForm.clientId || !kridiForm.amount || !kridiForm.reason) {
      Alert.alert('Erreur', 'Tous les champs sont requis');
      return;
    }

    setLoading(true);
    try {
      const kridiData = {
        ...kridiForm,
        amount: parseFloat(kridiForm.amount),
      };

      await kridiService.addKridiEntry(kridiData);
      Alert.alert('Succès', 'Entrée ajoutée avec succès');
      setKridiForm({
        clientId: '',
        amount: '',
        reason: '',
        type: 'debt',
      });
      setSearch('');
      setShowDropdown(false);
      setClientDebt(null);
      router.push('/');
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors de l\'ajout de l\'entrée');
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = (client: Client) => {
    setKridiForm({ ...kridiForm, clientId: client._id });
    setSearch(client.name);
    setShowDropdown(false);
  };

  return (
    <View style={styles.form}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Client *</Text>
        {/* Input + Icon */}
        <View style={{ position: 'relative' }}>
          <TextInput
            style={[styles.input, { paddingLeft: 36 }]}
            value={search}
            onChangeText={text => {
              setSearch(text);
              setShowDropdown(true);
              setKridiForm({ ...kridiForm, clientId: '' });
            }}
            placeholder="Rechercher un client"
            onFocus={() => setShowDropdown(true)}
            autoCorrect={false}
            autoCapitalize="none"
          />
          <View style={{
            position: 'absolute',
            left: 10,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            pointerEvents: 'none',
          }}>
            <Search size={18} color="#6B7280" />
          </View>
        </View>
        {/* Dropdown appears below input, not inside input container */}
        {showDropdown && clients.length > 0 && (
          <View style={{
            backgroundColor: '#FFF',
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 8,
            maxHeight: 160,
            marginTop: 4,
            zIndex: 10,
          }}>
            <FlatList
              data={clients}
              keyExtractor={item => item._id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F3F4F6',
                  }}
                  onPress={() => handleClientSelect(item)}
                >
                  <Text style={{ fontSize: 16, color: '#111827' }}>
                    {item.name} <Text style={{ color: '#6B7280', fontSize: 14 }}>{item.phone}</Text>
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        {/* Informative field: current kridi debt */}
        {kridiForm.clientId && clientDebt !== null && (
          <View style={{ marginTop: 8 }}>
            <Text style={{ color: clientDebt > 0 ? '#EF4444' : '#10B981', fontWeight: '600' }}>
              Dette actuelle : {clientDebt.toFixed(2)} TND
            </Text>
          </View>
        )}
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Montant (TND) *</Text>
        <TextInput
          style={styles.input}
          value={kridiForm.amount}
          onChangeText={(text) => setKridiForm({ ...kridiForm, amount: text })}
          placeholder="0.00"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Raison *</Text>
        <TextInput
          style={styles.input}
          value={kridiForm.reason}
          onChangeText={(text) => setKridiForm({ ...kridiForm, reason: text })}
          placeholder="Produits alimentaires, paiement, etc."
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Type *</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={[styles.radioButton, kridiForm.type === 'debt' && styles.radioButtonActive]}
            onPress={() => setKridiForm({ ...kridiForm, type: 'debt' })}
          >
            <Text style={[styles.radioText, kridiForm.type === 'debt' && styles.radioTextActive]}>
              Dette
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.radioButton, kridiForm.type === 'payment' && styles.radioButtonActive]}
            onPress={() => setKridiForm({ ...kridiForm, type: 'payment' })}
          >
            <Text style={[styles.radioText, kridiForm.type === 'payment' && styles.radioTextActive]}>
              Paiement
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={handleAddKridi}
        disabled={loading}
      >
        <Save size={20} color="#FFFFFF" />
        <Text style={styles.submitButtonText}>
          {loading ? 'Ajout en cours...' : 'Ajouter Kridi'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}