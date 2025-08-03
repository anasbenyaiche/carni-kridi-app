import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Search, X, Plus, ArrowLeft } from 'lucide-react-native';
import ClientItem from './ClientItem';
import SkeletonLoader from './SkeletonLoader';

interface Client {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  currentBalance?: number;
}

interface ClientSearchStepProps {
  calculatedAmount: number;
  searchQuery: string;
  searchResults: Client[];
  recentClients: Client[];
  loading: boolean;
  isTyping: boolean;
  onSearchChange: (query: string) => void;
  onSearchClear: () => void;
  onClientSelect: (client: Client) => void;
  onCreateClient: () => void;
  onBack: () => void;
}

export default function ClientSearchStep({
  calculatedAmount,
  searchQuery,
  searchResults,
  recentClients,
  loading,
  isTyping,
  onSearchChange,
  onSearchClear,
  onClientSelect,
  onCreateClient,
  onBack,
}: ClientSearchStepProps) {
  const showSearchResults = searchQuery.length > 0;
  const hasResults = searchResults.length > 0;
  const showRecentClients = !showSearchResults && recentClients.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rechercher ou créer un client</Text>
      <Text style={styles.amountInfo}>
        Montant: {calculatedAmount.toFixed(2)} TND
      </Text>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher par nom ou téléphone..."
            value={searchQuery}
            onChangeText={onSearchChange}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearSearchButton}
              onPress={onSearchClear}
            >
              <X size={16} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.clientsSection}>
        {showRecentClients && (
          <Text style={styles.sectionTitle}>Clients récents</Text>
        )}

        <ScrollView style={styles.searchResults}>
          {loading || isTyping ? (
            <SkeletonLoader />
          ) : showSearchResults ? (
            hasResults ? (
              searchResults.map((client) => (
                <ClientItem
                  key={client._id}
                  client={client}
                  onSelect={onClientSelect}
                />
              ))
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>Aucun client trouvé</Text>
              </View>
            )
          ) : (
            recentClients.map((client) => (
              <ClientItem
                key={client._id}
                client={client}
                onSelect={onClientSelect}
              />
            ))
          )}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.createClientButton}
        onPress={onCreateClient}
      >
        <Plus size={20} color="#10B981" />
        <Text style={styles.createClientText}>Créer un nouveau client</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <ArrowLeft size={20} color="#6B7280" />
        <Text style={styles.backButtonText}>Retour au calculateur</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  amountInfo: {
    fontSize: 15,
    color: '#10B981',
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  clearSearchButton: {
    padding: 4,
    borderRadius: 4,
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
  clientsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    marginLeft: 4,
  },
  searchResults: {
    flex: 1,
    marginBottom: 16,
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  createClientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#10B981',
    borderStyle: 'dashed',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  createClientText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  backButtonText: {
    color: '#6B7280',
    fontSize: 16,
  },
});
