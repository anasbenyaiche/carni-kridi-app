import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../contexts/AuthContext'; // Make sure path is correct
import { LoadingProvider } from '../contexts/LoadingContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import LoadingOverlay from '../components/LoadingOverlay';

// This is the "Gatekeeper" component. It will handle redirection.
const AuthGate = () => {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // If the auth state is still loading, do nothing. The loading spinner will be shown.
    if (loading) {
      return;
    }

    const inTabsGroup = segments[0] === '(tabs)';
    const inClientRoute = segments[0] === 'client';
    const inAdminRoute = segments[0] === 'admin';
    const inAuthenticatedArea = inTabsGroup || inClientRoute || inAdminRoute;

    // If the user is logged in but not in any authenticated section, redirect them to tabs.
    if (
      user &&
      !inAuthenticatedArea &&
      segments[0] !== 'login' &&
      segments[0] !== 'register'
    ) {
      router.replace('/(tabs)');
    }
    // If the user is not logged in but is trying to access authenticated areas, redirect them to login.
    else if (!user && inAuthenticatedArea) {
      router.replace('/login');
    }
  }, [user, segments, loading]); // While checking auth, show a loading indicator.
  // This prevents the app from rendering a page before we know where to go.
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  // Once loading is done, render the children (the Stack Navigator).
  // The useEffect will have already initiated a redirect if necessary.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="client" />
      <Stack.Screen name="admin" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};

// This is the main RootLayout component.
export default function RootLayout() {
  // Your useFrameworkReady hook can stay if you need it.
  useFrameworkReady();

  return (
    <LoadingProvider>
      <AuthProvider>
        <AuthGate />
        <LoadingOverlay />
        <StatusBar style="auto" />
      </AuthProvider>
    </LoadingProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB', // Or your app's background color
  },
});
