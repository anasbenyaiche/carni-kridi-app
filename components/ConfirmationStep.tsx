import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle, ArrowLeft } from 'lucide-react-native';

interface Client {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  currentBalance?: number;
}

interface ConfirmationStepProps {
  selectedClient: Client | null;
  calculatedAmount: number;
  onConfirm: () => void;
  onBack: () => void;
}

export default function ConfirmationStep({
  selectedClient,
  calculatedAmount,
  onConfirm,
  onBack,
}: ConfirmationStepProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmer le Kridi</Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Client:</Text>
          <Text style={styles.summaryValue}>{selectedClient?.name}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Téléphone:</Text>
          <Text style={styles.summaryValue}>{selectedClient?.phone}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Montant:</Text>
          <Text style={[styles.summaryValue, styles.amountValue]}>
            {calculatedAmount.toFixed(2)} TND
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
        <CheckCircle size={20} color="#FFFFFF" />
        <Text style={styles.confirmButtonText}>Confirmer le Kridi</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <ArrowLeft size={20} color="#6B7280" />
        <Text style={styles.backButtonText}>Retour à la recherche</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  amountValue: {
    color: '#10B981',
    fontSize: 18,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  backButtonText: {
    color: '#6B7280',
    fontSize: 16,
  },
});
