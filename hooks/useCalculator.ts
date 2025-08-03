import { useState } from 'react';
import { Alert } from 'react-native';

export const useCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [calculatedAmount, setCalculatedAmount] = useState(0);

  const handleInput = (value: string) => {
    if (display === '0' && value !== '.') {
      setDisplay(value);
    } else {
      setDisplay((prev) => prev + value);
    }
  };

  const clear = () => {
    setDisplay('0');
    setCalculatedAmount(0);
  };

  const backspace = () => {
    setDisplay((prev) => prev.slice(0, -1) || '0');
  };

  const calculate = () => {
    try {
      // Basic validation to prevent dangerous eval usage
      const safeExpression = display.replace(/[^0-9+\-*/.]/g, '');
      if (safeExpression !== display) {
        Alert.alert('Erreur', 'Expression invalide');
        return false;
      }

      // Simple evaluation - in production, use a proper math parser
      const result = Function(`"use strict"; return (${safeExpression})`)();

      if (isNaN(result) || !isFinite(result)) {
        Alert.alert('Erreur', 'Résultat invalide');
        return false;
      }

      const roundedResult = Math.round(result * 100) / 100; // Round to 2 decimal places
      setDisplay(roundedResult.toString());
      setCalculatedAmount(roundedResult);
      return true;
    } catch {
      Alert.alert('Erreur', 'Calcul invalide');
      return false;
    }
  };

  const isValidAmount = () => calculatedAmount > 0;

  return {
    display,
    calculatedAmount,
    handleInput,
    clear,
    backspace,
    calculate,
    isValidAmount,
  };
};
