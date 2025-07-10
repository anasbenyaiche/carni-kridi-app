import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { clientService } from '../../services/clientService';
import { kridiService } from '../../services/kridiService';
import { UserPlus, CreditCard, Save } from 'lucide-react-native';

export default function AddScreen() {
  const [activeTab, setActiveTab] = useState<'client' | 'kridi'>('client');
  const [loading, setLoading] = useState(false);

  // Client form state
  const [clientForm, setClientForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    creditLimit: '500',
    notes: '',
  });

  // Kridi form state
  const [kridiForm, setKridiForm] = useState({
    clientId: '',
    amount: '',
    reason: '',
    type: 'debt' as 'debt' | 'payment',
  });

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
      
      // Reset form
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
      
      // Reset form
      setKridiForm({
        clientId: '',
        amount: '',
        reason: '',
        type: 'debt',
      });
      
      router.push('/');
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors de l\'ajout de l\'entrée');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Ajouter</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'client' && styles.activeTab]}
          onPress={() => setActiveTab('client')}
        >
          <UserPlus size={20} color={activeTab === 'client' ? '#FFFFFF' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'client' && styles.activeTabText]}>
            Client
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'kridi' && styles.activeTab]}
          onPress={() => setActiveTab('kridi')}
        >
          <CreditCard size={20} color={activeTab === 'kridi' ? '#FFFFFF' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'kridi' && styles.activeTabText]}>
            Kridi
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'client' ? (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom *</Text>
              <TextInput
                style={styles.input}
                value={clientForm.name}
                onChangeText={(text) => setClientForm({...clientForm, name: text})}
                placeholder="Nom du client"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Téléphone *</Text>
              <TextInput
                style={styles.input}
                value={clientForm.phone}
                onChangeText={(text) => setClientForm({...clientForm, phone: text})}
                placeholder="+216 XX XXX XXX"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={clientForm.email}
                onChangeText={(text) => setClientForm({...clientForm, email: text})}
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
                onChangeText={(text) => setClientForm({...clientForm, address: text})}
                placeholder="Adresse du client"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Limite de crédit (TND)</Text>
              <TextInput
                style={styles.input}
                value={clientForm.creditLimit}
                onChangeText={(text) => setClientForm({...clientForm, creditLimit: text})}
                placeholder="500"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={clientForm.notes}
                onChangeText={(text) => setClientForm({...clientForm, notes: text})}
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
        ) : (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ID Client *</Text>
              <TextInput
                style={styles.input}
                value={kridiForm.clientId}
                onChangeText={(text) => setKridiForm({...kridiForm, clientId: text})}
                placeholder="ID du client"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Montant (TND) *</Text>
              <TextInput
                style={styles.input}
                value={kridiForm.amount}
                onChangeText={(text) => setKridiForm({...kridiForm, amount: text})}
                placeholder="0.00"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Raison *</Text>
              <TextInput
                style={styles.input}
                value={kridiForm.reason}
                onChangeText={(text) => setKridiForm({...kridiForm, reason: text})}
                placeholder="Produits alimentaires, paiement, etc."
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Type *</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[styles.radioButton, kridiForm.type === 'debt' && styles.radioButtonActive]}
                  onPress={() => setKridiForm({...kridiForm, type: 'debt'})}
                >
                  <Text style={[styles.radioText, kridiForm.type === 'debt' && styles.radioTextActive]}>
                    Dette
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.radioButton, kridiForm.type === 'payment' && styles.radioButtonActive]}
                  onPress={() => setKridiForm({...kridiForm, type: 'payment'})}
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
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#10B981',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
  },
  radioButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  radioText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  radioTextActive: {
    color: '#FFFFFF',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 20,
    gap: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});