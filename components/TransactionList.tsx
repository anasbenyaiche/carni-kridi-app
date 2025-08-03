import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from 'react-native';
import TransactionCard from './TransactionCard';

export default function TransactionList({
  transactions,
  loading,
}: {
  transactions: any[];
  loading: boolean;
}) {
  return (
    <View style={styles.transactionsSection}>
      <Text style={styles.transactionsTitle}>Transactions</Text>
      {loading ? (
        <ActivityIndicator
          size="small"
          color="#10B981"
          style={{ marginTop: 16 }}
        />
      ) : transactions.length === 0 ? (
        <Text style={styles.noTransactions}>Aucune transaction trouvée.</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <TransactionCard transaction={item} />}
          contentContainerStyle={{ paddingVertical: 4 }}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  transactionsSection: {
    marginTop: 12,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  noTransactions: {
    color: '#6B7280',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
  },
});
