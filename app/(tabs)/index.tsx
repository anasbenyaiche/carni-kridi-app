import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { kridiService } from '../../services/kridiService';
import { clientService } from '../../services/clientService';
import { TrendingUp, TrendingDown, Users, DollarSign } from 'lucide-react-native';

export default function HomeScreen() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [recentClients, setRecentClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [summaryData, clientsData] = await Promise.all([
        kridiService.getSummary(),
        clientService.getClients(1, 5)
      ]);
      
      setSummary(summaryData);
      setRecentClients(clientsData.clients || []);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Erreur', 'Impossible de charger les données');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} TND`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.header}>
        <Text style={styles.greeting}>Bonjour, {user?.name}!</Text>
        <Text style={styles.subtitle}>Voici un aperçu de votre magasin</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <TrendingUp size={24} color="#10B981" />
          </View>
          <Text style={styles.statValue}>
            {formatCurrency(summary?.summary?.find((s: any) => s._id === 'debt')?.remaining || 0)}
          </Text>
          <Text style={styles.statLabel}>Crédits en cours</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <TrendingDown size={24} color="#3B82F6" />
          </View>
          <Text style={styles.statValue}>
            {formatCurrency(summary?.summary?.find((s: any) => s._id === 'payment')?.total || 0)}
          </Text>
          <Text style={styles.statLabel}>Paiements reçus</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Users size={24} color="#F59E0B" />
          </View>
          <Text style={styles.statValue}>{summary?.clientCount || 0}</Text>
          <Text style={styles.statLabel}>Total clients</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <DollarSign size={24} color="#8B5CF6" />
          </View>
          <Text style={styles.statValue}>{summary?.activeClients || 0}</Text>
          <Text style={styles.statLabel}>Clients actifs</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Clients récents</Text>
        {recentClients.length > 0 ? (
          recentClients.map((client) => (
            <TouchableOpacity key={client._id} style={styles.clientCard}>
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{client.name}</Text>
                <Text style={styles.clientPhone}>{client.phone}</Text>
              </View>
              <View style={styles.clientBalance}>
                <Text style={[styles.balanceText, 
                  client.totalDebt > 0 ? styles.debtText : styles.paidText
                ]}>
                  {formatCurrency(client.totalDebt - client.totalPaid)}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>Aucun client trouvé</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  clientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  clientPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  clientBalance: {
    alignItems: 'flex-end',
  },
  balanceText: {
    fontSize: 16,
    fontWeight: '600',
  },
  debtText: {
    color: '#EF4444',
  },
  paidText: {
    color: '#10B981',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 20,
  },
});