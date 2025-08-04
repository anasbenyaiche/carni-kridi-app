import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import StoreList from '../../components/StoreList';
import AddStoreForm from '../../components/AddStoreForm';
import { Plus } from 'lucide-react-native';

export default function StoresScreen() {
  const { user } = useAuth();
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleStoreAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Only show to admin or attara users
  if (!user || (user.role !== 'admin' && user.role !== 'attara')) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Magasins</Text>
        </View>
        <View style={styles.unauthorizedContainer}>
          <Text style={styles.unauthorizedText}>Accès non autorisé</Text>
          <Text style={styles.unauthorizedSubtext}>
            Vous n&apos;avez pas les permissions pour voir cette page
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Magasins</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddStoreModal(true)}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <StoreList
          refreshTrigger={refreshTrigger}
          onStorePress={(store) => {
            // TODO: Navigate to store details
            console.log('Store pressed:', store);
          }}
        />
      </View>

      <AddStoreForm
        visible={showAddStoreModal}
        onClose={() => setShowAddStoreModal(false)}
        onSubmit={handleStoreAdded}
      />
    </>
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#10B981',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  unauthorizedText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  unauthorizedSubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
