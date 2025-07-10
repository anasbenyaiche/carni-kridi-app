import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { clientService, Client } from '../../services/clientService';
import { Phone } from 'lucide-react-native';

export default function ClientDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await clientService.getClient(id);
        setClient(data);
      } catch (error) {
        setClient(null);
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

  const debt = (client.totalDebt || 0) - (client.totalPaid || 0);
  const debtColor = debt > 0 ? styles.debt : styles.ok;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <View style={styles.card}>
        <Text style={styles.name}>{client.name}</Text>
        <View style={styles.row}>
          <Phone size={18} color="#6B7280" />
          <Text style={styles.info}>{client.phone}</Text>
        </View>
        {client.email ? (
          <Text style={styles.info}>{client.email}</Text>
        ) : null}
        {client.address ? (
          <Text style={styles.info}>{client.address}</Text>
        ) : null}
        <View style={styles.debtContainer}>
          <Text style={[styles.debtLabel, debtColor]}>
            {debt > 0 ? 'Dette actuelle' : 'Situation'}
          </Text>
          <Text style={[styles.debtValue, debtColor]}>
            {debt.toFixed(2)} TND
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Limite de crédit</Text>
          <Text style={styles.info}>{client.creditLimit ? `${client.creditLimit} TND` : 'Non défini'}</Text>
        </View>
        {client.notes ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.info}>{client.notes}</Text>
          </View>
        ) : null}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dernière transaction</Text>
          <Text style={styles.info}>
            {client.lastTransaction
              ? new Date(client.lastTransaction).toLocaleDateString()
              : 'Aucune'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  info: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 4,
    marginBottom: 4,
  },
  debtContainer: {
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  debtLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  debtValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  debt: {
    color: '#EF4444',
  },
  ok: {
    color: '#10B981',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 18,
    fontWeight: '600',
  },
});