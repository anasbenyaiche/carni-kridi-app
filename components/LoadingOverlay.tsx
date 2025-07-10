import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLoading } from '../contexts/LoadingContext';

export default function LoadingOverlay() {
  const { loading, setLoading } = useLoading();

  // Example of how to show and hide the spinner
  const showSpinner = () => setLoading(true);
  const hideSpinner = () => setLoading(false);

  if (!loading) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#10B981" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(31,41,55,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});