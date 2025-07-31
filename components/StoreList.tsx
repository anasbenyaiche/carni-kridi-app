import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { formatCardDate } from '../utils/dateUtils';
import { Store, storeService } from '../services/storeService';
import { useLoading } from '../contexts/LoadingContext';
import { LoadingSpinner } from './LoadingOverlay';
import {
  Store as StoreIcon,
  MapPin,
  Phone,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react-native';

interface StoreListProps {
  onStorePress?: (store: Store) => void;
  refreshTrigger?: number;
}

export default function StoreList({
  onStorePress,
  refreshTrigger,
}: StoreListProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { showLoading, hideLoading, setLoadingMessage } = useLoading();

  useEffect(() => {
    loadStores();
  }, [refreshTrigger]);

  const loadStores = async () => {
    try {
      const storeList = await storeService.getStoresByOwner();
      setStores(storeList);
    } catch (error: any) {
      console.error('Error loading stores:', error);
      Alert.alert('Erreur', 'Impossible de charger les magasins');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStores();
  };

  const toggleStoreStatus = async (store: Store) => {
    try {
      showLoading();
      setLoadingMessage('Mise à jour du statut...');

      const updatedStore = await storeService.toggleStoreStatus(store._id);

      setStores((prev) =>
        prev.map((s) => (s._id === store._id ? updatedStore : s))
      );

      Alert.alert(
        'Succès',
        `Magasin ${updatedStore.active ? 'activé' : 'désactivé'} avec succès`
      );
    } catch (error: any) {
      console.error('Error toggling store status:', error);
      Alert.alert('Erreur', 'Impossible de changer le statut du magasin');
    } finally {
      hideLoading();
      setLoadingMessage(undefined);
    }
  };

  const renderStore = ({ item }: { item: Store }) => (
    <TouchableOpacity
      style={[styles.storeCard, !item.active && styles.inactiveStore]}
      onPress={() => onStorePress?.(item)}
    >
      <View style={styles.storeHeader}>
        <View style={styles.storeInfo}>
          <View style={styles.storeTitleRow}>
            <StoreIcon size={20} color="#10B981" />
            <Text style={styles.storeName}>{item.name}</Text>
          </View>
          {item.address && (
            <View style={styles.storeDetailRow}>
              <MapPin size={14} color="#6B7280" />
              <Text style={styles.storeAddress}>{item.address}</Text>
            </View>
          )}
          {item.phone && (
            <View style={styles.storeDetailRow}>
              <Phone size={14} color="#6B7280" />
              <Text style={styles.storePhone}>{item.phone}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.statusToggle}
          onPress={() => toggleStoreStatus(item)}
        >
          {item.active ? (
            <ToggleRight size={32} color="#10B981" />
          ) : (
            <ToggleLeft size={32} color="#6B7280" />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.storeFooter}>
        <Text style={styles.storeStatus}>
          {item.active ? 'Actif' : 'Inactif'}
        </Text>
        <Text style={styles.storeDate}>
          Créé le {formatCardDate(item.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingSpinner message="Chargement des magasins..." />;
  }

  return (
    <FlatList
      data={stores}
      renderItem={renderStore}
      keyExtractor={(item) => item._id}
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <StoreIcon size={64} color="#D1D5DB" />
          <Text style={styles.emptyText}>Aucun magasin trouvé</Text>
          <Text style={styles.emptySubtext}>
            Commencez par ajouter votre premier magasin
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  storeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  inactiveStore: {
    opacity: 0.7,
    backgroundColor: '#F9FAFB',
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  storeInfo: {
    flex: 1,
  },
  storeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  storeDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  storeAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    flex: 1,
  },
  storePhone: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  statusToggle: {
    padding: 4,
  },
  storeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  storeStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  storeDate: {
    fontSize: 12,
    color: '#6B7280',
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
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
