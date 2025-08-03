import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowRight } from 'lucide-react-native';

interface Client {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  currentBalance?: number;
}

interface ClientItemProps {
  client: Client;
  onSelect: (client: Client) => void;
}

export default function ClientItem({ client, onSelect }: ClientItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onSelect(client)}>
      <View style={styles.info}>
        <Text style={styles.name}>{client.name}</Text>
        <Text style={styles.phone}>{client.phone}</Text>
        {client.currentBalance !== undefined && (
          <Text
            style={[
              styles.balance,
              client.currentBalance > 0
                ? styles.debtBalance
                : styles.creditBalance,
            ]}
          >
            {client.currentBalance > 0 ? 'Dette: ' : 'Crédit: '}
            {Math.abs(client.currentBalance).toFixed(2)} TND
          </Text>
        )}
      </View>
      <ArrowRight size={20} color="#6B7280" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  phone: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  balance: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  debtBalance: {
    color: '#EF4444',
  },
  creditBalance: {
    color: '#10B981',
  },
});
