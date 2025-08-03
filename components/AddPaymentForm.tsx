import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Banknote, Search, CheckCircle, X, Plus } from 'lucide-react-native';
import { useClientSearch } from '../hooks/useClientSearch';
import { kridiService } from '../services/kridiService';
import { clientService } from '../services/clientService';
import ClientItem from './ClientItem';
import SkeletonLoader from './SkeletonLoader';
import SuccessAnimation from './SuccessAnimation';

interface Client {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  currentBalance?: number;
}

interface AddPaymentFormProps {
  onComplete: () => void;
}

export default function AddPaymentForm({ onComplete }: AddPaymentFormProps) {
  const [amount, setAmount] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [description, setDescription] = useState('');
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const clientSearch = useClientSearch();

  // Load recent clients when component mounts
  useEffect(() => {
    loadRecentClients();
  }, []);

  const loadRecentClients = async () => {
    try {
      const response = await clientService.getClients(1, 5, '');
      const mappedClients = (response.clients || []).map((client: any) => ({
        _id: client._id,
        name: client.name,
        phone: client.phone,
        email: client.email,
        currentBalance: client.currentBalance || 0,
      }));
      setRecentClients(mappedClients);
    } catch (error) {
      console.error('Error loading recent clients:', error);
    }
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    clientSearch.clearSearch();
  };

  const handleCreateNewClient = () => {
    Alert.alert('Info', 'Création de client - à implémenter');
  };

  const resetForm = () => {
    setAmount('');
    setSelectedClient(null);
    setDescription('');
    clientSearch.clearSearch();
    loadRecentClients();
  };

  const handleSubmit = async () => {
    if (!amount || !selectedClient) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide');
      return;
    }

    try {
      setSubmitting(true);

      const paymentData = {
        clientId: selectedClient._id,
        amount: amountValue,
        reason: description || 'Paiement enregistré',
        type: 'payment' as const,
      };

      await kridiService.addKridiEntry(paymentData);

      // Show success animation
      setShowSuccessAnimation(true);
    } catch (error) {
      console.error('Error creating payment:', error);
      Alert.alert('Erreur', "Impossible d'enregistrer le paiement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessAnimationComplete = () => {
    setShowSuccessAnimation(false);
    resetForm();
    // Optional: Call onComplete if you want to notify parent component
    // onComplete();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Enregistrer un paiement</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Montant *</Text>
          <View style={styles.amountInputContainer}>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
            <Text style={styles.currency}>TND</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Client *</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un client..."
              value={clientSearch.searchQuery}
              onChangeText={clientSearch.updateSearchQuery}
            />
            <TouchableOpacity style={styles.searchButton}>
              <Search size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Client Search Results */}
          {clientSearch.searchQuery && !selectedClient && (
            <View style={styles.searchResults}>
              {clientSearch.loading || clientSearch.isTyping ? (
                <SkeletonLoader count={3} />
              ) : clientSearch.searchResults.length > 0 ? (
                <ScrollView
                  style={styles.resultsScrollView}
                  showsVerticalScrollIndicator={false}
                >
                  {clientSearch.searchResults.map((client) => (
                    <ClientItem
                      key={client._id}
                      client={client}
                      onSelect={(client) => {
                        setSelectedClient(client);
                        clientSearch.clearSearch();
                      }}
                    />
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.noResults}>
                  <Text style={styles.noResultsText}>Aucun client trouvé</Text>
                </View>
              )}
            </View>
          )}

          {selectedClient && (
            <View style={styles.selectedClient}>
              <Text style={styles.selectedClientName}>
                {selectedClient.name}
              </Text>
              <Text style={styles.selectedClientPhone}>
                {selectedClient.phone}
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedClient(null)}
                style={styles.clearSelection}
              >
                <Text style={styles.clearSelectionText}>Changer</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!amount || !selectedClient) && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={!amount || !selectedClient}
        >
          <CheckCircle size={20} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>Enregistrer le paiement</Text>
        </TouchableOpacity>
      </View>

      {showSuccessAnimation && (
        <SuccessAnimation
          visible={showSuccessAnimation}
          onComplete={handleSuccessAnimationComplete}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
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
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingRight: 16,
  },
  amountInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  currency: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedClient: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedClientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  selectedClientPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  clearSelection: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearSelectionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  searchResults: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    maxHeight: 300,
  },
  resultsScrollView: {
    maxHeight: 280,
  },
  noResults: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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
