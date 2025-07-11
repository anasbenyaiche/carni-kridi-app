import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { clientService, Client } from '../../services/clientService';
import { Search, Plus, Phone, User } from 'lucide-react-native';
import ClientDetailsCard from '../../components/ClientDetailsCard';

export default function ClientsScreen() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadClients();
  }, [search]);

  const loadClients = async (pageNum = 1, searchTerm = search) => {
    try {
      const response = await clientService.getClients(pageNum, 20, searchTerm);
      
      if (pageNum === 1) {
        setClients(response.clients || []);
      } else {
        setClients(prev => [...prev, ...(response.clients || [])]);
      }
      
      setHasMore(response.page < response.pages);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading clients:', error);
      Alert.alert('Erreur', 'Impossible de charger les clients');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadClients(1);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      loadClients(page + 1);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} TND`;
  };

  const handleClientPress = (client: Client) => {
    router.push(`/client/${client._id}`);
  };

  const renderClient = ({ item }: { item: Client }) => (
    <ClientDetailsCard
      client={item}
      onPress={handleClientPress}
      formatCurrency={formatCurrency}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Clients</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/add')}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un client..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={clients}
        renderItem={renderClient}
        keyExtractor={(item) => item._id}
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <User size={64} color="#D1D5DB" />
            <Text style={styles.emptyText}>Aucun client trouvé</Text>
            <TouchableOpacity 
              style={styles.addClientButton}
              onPress={() => router.push('/add-client')}
            >
              <Text style={styles.addClientText}>Ajouter un client</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    padding: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#111827',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  clientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  clientDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clientPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  clientBalance: {
    alignItems: 'flex-end',
  },
  balanceText: {
    fontSize: 18,
    fontWeight: '700',
  },
  debtText: {
    color: '#EF4444',
  },
  paidText: {
    color: '#10B981',
  },
  balanceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  lastTransaction: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 24,
  },
  addClientButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addClientText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});