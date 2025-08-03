import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowRight, Check } from 'lucide-react-native';

interface CalculatorProps {
  display: string;
  calculatedAmount: number;
  onInput: (value: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onCalculate: () => void;
  onNext: () => void;
}

export default function Calculator({
  display,
  calculatedAmount,
  onInput,
  onClear,
  onBackspace,
  onCalculate,
  onNext,
}: CalculatorProps) {
  const calculatorButtons = [
    ['C', '/', '*', '←'],
    ['7', '8', '9', '-'],
    ['4', '5', '6', '+'],
    ['1', '2', '3', '='],
    ['0', '.', '', ''],
  ];

  const handleButtonPress = (button: string) => {
    if (button === 'C') onClear();
    else if (button === '←') onBackspace();
    else if (button === '=') onCalculate();
    else if (button !== '') onInput(button);
  };

  const isOperatorButton = (button: string) =>
    ['=', '+', '-', '*', '/'].includes(button);

  return (
    <View style={styles.container}>
      <View style={styles.display}>
        <Text style={styles.displayText}>{display}</Text>
      </View>

      <View style={styles.grid}>
        {calculatorButtons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((button, colIndex) => {
              if (button === '')
                return <View key={colIndex} style={styles.button} />;

              return (
                <TouchableOpacity
                  key={colIndex}
                  style={[
                    styles.button,
                    isOperatorButton(button) && styles.operatorButton,
                    button === 'C' && styles.clearButton,
                  ]}
                  onPress={() => handleButtonPress(button)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      isOperatorButton(button) && styles.operatorButtonText,
                      button === 'C' && styles.clearButtonText,
                    ]}
                  >
                    {button}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={onNext}>
        <Text style={styles.nextButtonText}>
          Continuer avec {calculatedAmount.toFixed(2)} TND
        </Text>
        <ArrowRight size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  display: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  displayText: {
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'right',
    fontWeight: '300',
  },
  grid: {
    gap: 12,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  button: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60,
  },
  operatorButton: {
    backgroundColor: '#10B981',
  },
  clearButton: {
    backgroundColor: '#EF4444',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  operatorButtonText: {
    color: '#FFFFFF',
  },
  clearButtonText: {
    color: '#FFFFFF',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 20,
    gap: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
