import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatTransactionDate } from '../utils/dateUtils';

export default function TransactionCard({ transaction }: { transaction: any }) {
  const isDebt = transaction.type === 'debt';

  return (
    <View style={styles.transactionCard}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.transactionReason}>{transaction.reason}</Text>
        <Text
          style={[styles.transactionAmount, isDebt ? styles.debt : styles.ok]}
        >
          {isDebt ? '+' : '-'}
          {transaction.amount.toFixed(2)} TND
        </Text>
      </View>
      <Text style={styles.transactionDate}>
        {formatTransactionDate(transaction.date)}
      </Text>
      <Text style={styles.transactionType}>
        {isDebt ? 'Dette' : 'Paiement'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  transactionReason: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
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
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  transactionType: {
    fontSize: 13,
    color: '#374151',
    marginTop: 2,
    fontStyle: 'italic',
  },
});
