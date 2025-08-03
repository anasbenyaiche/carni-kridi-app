import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { CreditCard, Banknote } from 'lucide-react-native';
import AddKridiStepsForm from '../../components/AddKridiStepsForm';
import AddPaymentForm from '../../components/AddPaymentForm';

export default function AddTransactionScreen() {
  const [activeTab, setActiveTab] = useState<'kridi' | 'payment'>('kridi');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Ajouter Transaction</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'kridi' && styles.activeTab]}
          onPress={() => setActiveTab('kridi')}
        >
          <CreditCard
            size={18}
            color={activeTab === 'kridi' ? '#FFFFFF' : '#6B7280'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'kridi' && styles.activeTabText,
            ]}
          >
            Kridi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'payment' && styles.activeTab]}
          onPress={() => setActiveTab('payment')}
        >
          <Banknote
            size={18}
            color={activeTab === 'payment' ? '#FFFFFF' : '#6B7280'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'payment' && styles.activeTabText,
            ]}
          >
            Paiement
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeTab === 'kridi' && (
          <ScrollView style={styles.kridiScroll}>
            <AddKridiStepsForm onComplete={() => setActiveTab('payment')} />
          </ScrollView>
        )}
        {activeTab === 'payment' && (
          <ScrollView style={styles.paymentScroll}>
            <AddPaymentForm onComplete={() => setActiveTab('kridi')} />
          </ScrollView>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#10B981',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  kridiScroll: {
    flex: 1,
  },
  paymentScroll: {
    flex: 1,
    padding: 20,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
  },
  radioButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  radioText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  radioTextActive: {
    color: '#FFFFFF',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 20,
    gap: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  placeholderText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
