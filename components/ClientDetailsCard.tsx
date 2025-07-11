import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Phone } from 'lucide-react-native';
import { Client } from '../services/clientService';

export default function ClientDetailsCard({
  client,
  onPress,
  formatCurrency,
}: {
  client: Client;
  onPress: (client: Client) => void;
  formatCurrency: (amount: number) => string;
}) {
  return (
    <TouchableOpacity style={styles.clientCard} onPress={() => onPress(client)}>
      <View style={styles.clientHeader}>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{client.name}</Text>
          <View style={styles.clientDetails}>
            <Phone size={14} color="#6B7280" />
            <Text style={styles.clientPhone}>{client.phone}</Text>
          </View>
        </View>
        <View style={styles.clientBalance}>
          <Text
            style={[
              styles.balanceText,
              (client.totalDebt - client.totalPaid) > 0 ? styles.debtText : styles.paidText,
            ]}
          >
            {formatCurrency(client.totalDebt - client.totalPaid)}
          </Text>
          <Text style={styles.balanceLabel}>
            {(client.totalDebt - client.totalPaid) > 0 ? 'À payer' : 'Soldé'}
          </Text>
        </View>
      </View>
      {client.lastTransaction && (
        <Text style={styles.lastTransaction}>
          Dernière transaction: {new Date(client.lastTransaction).toLocaleDateString()}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});