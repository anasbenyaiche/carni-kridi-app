import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { clientService } from '../../services/clientService';
import { Phone, ArrowLeft, Menu } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import TransactionList from '../../components/TransactionList';

export default function ClientDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [client, setClient] = useState<any>(null);
  const [balance, setBalance] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await clientService.getClient(id);
        setClient(res.client);
        setBalance(res.balance);
        setTransactions(res.recentTransactions || []);
      } catch (error) {
        setClient(null);
        setBalance(null);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  if (!client) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Client introuvable.</Text>
      </View>
    );
  }

  const debt = balance?.currentBalance ?? 0;
  const debtColor = debt > 0 ? styles.debt : styles.ok;

  return (
    <>
      <StatusBar style="dark" backgroundColor="#F9FAFB" />
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Client</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.headerBtn}>
          <Menu size={24} color="#111827" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
        <View style={styles.card}>
          <Text style={styles.title}>Informations du client</Text>
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Nom :</Text>
            <Text style={styles.value}>{client.name}</Text>
          </View>
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Téléphone :</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Phone size={16} color="#6B7280" style={{ marginRight: 4 }} />
              <Text style={styles.value}>{client.phone}</Text>
            </View>
          </View>
          {client.email ? (
            <View style={styles.infoGroup}>
              <Text style={styles.label}>Email :</Text>
              <Text style={styles.value}>{client.email}</Text>
            </View>
          ) : null}
          {client.address ? (
            <View style={styles.infoGroup}>
              <Text style={styles.label}>Adresse :</Text>
              <Text style={styles.value}>{client.address}</Text>
            </View>
          ) : null}
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Limite de crédit :</Text>
            <Text style={styles.value}>{client.creditLimit ? `${client.creditLimit} TND` : 'Non défini'}</Text>
          </View>
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Kridi (Dette) :</Text>
            <Text style={[styles.value, debtColor]}>
              {debt.toFixed(2)} TND
            </Text>
          </View>
          {client.notes ? (
            <View style={styles.infoGroup}>
              <Text style={styles.label}>Notes :</Text>
              <Text style={styles.value}>{client.notes}</Text>
            </View>
          ) : null}
          <View style={styles.infoGroup}>
            <Text style={styles.label}>Dernière transaction :</Text>
            <Text style={styles.value}>
              {transactions[0]?.createdAt && !isNaN(Date.parse(transactions[0].createdAt))
                ? new Date(transactions[0].createdAt).toLocaleDateString()
                : 'Aucune'}
            </Text>
          </View>
        </View>

        {/* Transaction List */}
        <TransactionList transactions={transactions} loading={false} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: 16,  
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    justifyContent: 'space-between',
  },
  headerBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  container: {
    backgroundColor: '#F9FAFB',
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 18,
    textAlign: 'center',
  },
  infoGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 2,
  },
  value: {
    fontSize: 17,
    color: '#111827',
    fontWeight: '500',
  },
  debt: {
    color: '#EF4444',
    fontWeight: '700',
  },
  ok: {
    color: '#10B981',
    fontWeight: '700',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 18,
    fontWeight: '600',
  },
});