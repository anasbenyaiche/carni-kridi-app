import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

// Initialize Sentry
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || 'YOUR_SENTRY_DSN_HERE',
  environment: Constants.expoConfig?.extra?.ENVIRONMENT || 'development',
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 30000,
  enableAutoPerformanceTracing: true,
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Filter out development errors in production
    if (__DEV__) {
      return null;
    }
    return event;
  },
});

// Helper functions for crash reporting
export const reportError = (error: Error, context?: Record<string, any>) => {
  if (context) {
    Sentry.setContext('error_context', context);
  }
  Sentry.captureException(error);
};

export const reportMessage = (
  message: string,
  level: 'info' | 'warning' | 'error' = 'info'
) => {
  Sentry.captureMessage(message, level);
};

export const setUserContext = (user: {
  id: string;
  email?: string;
  role?: string;
}) => {
  Sentry.setUser(user);
};

export const addBreadcrumb = (
  message: string,
  category?: string,
  data?: Record<string, any>
) => {
  Sentry.addBreadcrumb({
    message,
    category: category || 'custom',
    data,
    level: 'info',
    timestamp: Date.now() / 1000,
  });
};

export default Sentry;
