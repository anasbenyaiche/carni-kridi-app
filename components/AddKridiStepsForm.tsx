import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native';
import { clientService } from '../services/clientService';
import { kridiService } from '../services/kridiService';
import { useCalculator } from '../hooks/useCalculator';
import { useClientSearch } from '../hooks/useClientSearch';
import StepIndicator from './StepIndicator';
import Calculator from './Calculator';
import ClientSearchStep from './ClientSearchStep';
import ConfirmationStep from './ConfirmationStep';
import SuccessAnimation from './SuccessAnimation';

interface Client {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  currentBalance?: number;
}

interface AddKridiStepsFormProps {
  onComplete: () => void;
}

const STEP_LABELS = ['Calculer', 'Client', 'Confirmer'];
const TOTAL_STEPS = 3;

export default function AddKridiStepsForm({
  onComplete,
}: AddKridiStepsFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const calculator = useCalculator();
  const clientSearch = useClientSearch();

  // Load recent clients when component mounts
  useEffect(() => {
    loadRecentClients();
  }, []);

  const loadRecentClients = async () => {
    try {
      const response = await clientService.getClients(1, 5, '');
      const mappedClients = (response.clients || []).map((client: any) => ({
        _id: client._id,
        name: client.name,
        phone: client.phone,
        email: client.email,
        currentBalance: client.currentBalance || 0,
      }));
      setRecentClients(mappedClients);
    } catch (error) {
      console.error('Error loading recent clients:', error);
    }
  };

  const handleCalculatorNext = () => {
    if (calculator.isValidAmount()) {
      setCurrentStep(2);
    } else {
      Alert.alert('Erreur', 'Veuillez calculer un montant valide');
    }
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setCurrentStep(3);
  };

  const handleCreateNewClient = () => {
    Alert.alert('Info', 'Création de client - à implémenter');
  };

  const handleConfirmKridi = async () => {
    if (!selectedClient || !calculator.isValidAmount()) {
      Alert.alert('Erreur', 'Données invalides');
      return;
    }

    try {
      const kridiData = {
        clientId: selectedClient._id,
        amount: calculator.calculatedAmount,
        reason: 'Kridi ajouté via calculateur',
        type: 'debt' as const,
      };

      await kridiService.addKridiEntry(kridiData);

      // Show success animation instead of alert
      setShowSuccessAnimation(true);
    } catch (error) {
      console.error('Error creating Kridi:', error);
      Alert.alert('Erreur', 'Impossible de créer le Kridi');
    }
  };

  const handleSuccessAnimationComplete = () => {
    setShowSuccessAnimation(false);

    // Reset all form state to start fresh
    setCurrentStep(1);
    setSelectedClient(null);
    calculator.clear();
    clientSearch.clearSearch();

    // Reload recent clients for next transaction
    loadRecentClients();

    // Optional: Call onComplete if you want to notify parent component
    // onComplete();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Calculator
            display={calculator.display}
            calculatedAmount={calculator.calculatedAmount}
            onInput={calculator.handleInput}
            onClear={calculator.clear}
            onBackspace={calculator.backspace}
            onCalculate={calculator.calculate}
            onNext={handleCalculatorNext}
          />
        );
      case 2:
        return (
          <ClientSearchStep
            calculatedAmount={calculator.calculatedAmount}
            searchQuery={clientSearch.searchQuery}
            searchResults={clientSearch.searchResults}
            recentClients={recentClients}
            loading={clientSearch.loading}
            isTyping={clientSearch.isTyping}
            onSearchChange={clientSearch.updateSearchQuery}
            onSearchClear={clientSearch.clearSearch}
            onClientSelect={handleClientSelect}
            onCreateClient={handleCreateNewClient}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <ConfirmationStep
            selectedClient={selectedClient}
            calculatedAmount={calculator.calculatedAmount}
            onConfirm={handleConfirmKridi}
            onBack={() => setCurrentStep(2)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {currentStep > 1 && (
        <StepIndicator
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          stepLabels={STEP_LABELS}
        />
      )}

      <View style={styles.content}>{renderCurrentStep()}</View>

      <SuccessAnimation
        visible={showSuccessAnimation}
        onComplete={handleSuccessAnimationComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
