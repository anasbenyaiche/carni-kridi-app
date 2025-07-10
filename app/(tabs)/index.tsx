import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { kridiService } from '../../services/kridiService';
import { clientService } from '../../services/clientService';
import RoleHeader from '../../components/RoleHeader';
import StatsSection from '../../components/StatsSection';
import RecentClientsSection from '../../components/RecentClientsSection';
import globalStyles from '../../styles/globalStyles';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<any>(null);
  const [recentClients, setRecentClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user]);

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
      <View style={globalStyles.loadingContainer}>
        <Text style={globalStyles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  let content = null;
  if (user?.role === 'admin') {
    content = (
      <Text style={{ textAlign: 'center', marginTop: 40, color: '#6B7280' }}>
        Tableau de bord d'administration (à personnaliser)
      </Text>
    );
  } else if (user?.role === 'attara' || user?.role === 'worker') {
    content = (
      <>
        <StatsSection summary={summary} formatCurrency={formatCurrency} />
        <RecentClientsSection recentClients={recentClients} formatCurrency={formatCurrency} />
      </>
    );
  } else if (user?.role === 'client') {
    content = (
      <Text style={{ textAlign: 'center', marginTop: 40, color: '#6B7280' }}>
        Bienvenue sur votre espace client.
      </Text>
    );
  }

  return (
    <ScrollView
      style={globalStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <RoleHeader user={user} />
      {content}
    </ScrollView>
  );
}