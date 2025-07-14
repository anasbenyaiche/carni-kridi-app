import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useLoading } from '../contexts/LoadingContext';

export default function LoadingOverlay() {
  const { loading, loadingMessage } = useLoading();

  if (!loading) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#10B981" />
        {loadingMessage && (
          <Text style={styles.message}>{loadingMessage}</Text>
        )}
      </View>
    </View>
  );
}

export function LoadingSpinner({ 
  size = "large", 
  color = "#10B981", 
  message 
}: { 
  size?: "small" | "large", 
  color?: string, 
  message?: string 
}) {
  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text style={styles.spinnerMessage}>{message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(31,41,55,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 120,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
  },
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  spinnerMessage: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});