import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatTransactionDate } from '../utils/dateUtils';

export default function TransactionCard({ transaction }: { transaction: any }) {
  const isDebt = transaction.type === 'debt';

  return (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionType}>
            {isDebt ? 'Dette' : 'Paiement'}
          </Text>
          <Text style={styles.transactionDate}>
            {formatTransactionDate(transaction.createdAt)}
          </Text>
        </View>
        <Text
          style={[styles.transactionAmount, isDebt ? styles.debt : styles.ok]}
        >
          {isDebt ? '+' : '-'}
          {transaction.amount.toFixed(2)} TND
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#E5E7EB',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  debt: {
    color: '#EF4444',
    fontWeight: '700',
  },
  ok: {
    color: '#10B981',
    fontWeight: '700',
  },
  transactionDate: {
    fontSize: 12,
    color: '#6B7280',
  },
});
