import React from 'react';
import { View, Text } from 'react-native';
import globalStyles from '@/styles/globalStyles';

export default function RoleHeader({ user }: { user: any }) {
  switch (user?.role) {
    case 'admin':
      return (
        <View style={globalStyles.header}>
          <Text style={globalStyles.greeting}>
            Bonjour Admin, {user?.name}!
          </Text>
          <Text style={globalStyles.subtitle}>
            Vue d&apos;ensemble de l&apos;administration
          </Text>
        </View>
      );
    case 'attara':
      return (
        <View style={globalStyles.header}>
          <Text style={globalStyles.greeting}>Bonjour, {user?.name}!</Text>
          <Text style={globalStyles.subtitle}>
            Vue d&apos;ensemble du magasin
          </Text>
        </View>
      );
    case 'worker':
      return (
        <View style={globalStyles.header}>
          <Text style={globalStyles.greeting}>Bonjour, {user?.name}!</Text>
          <Text style={globalStyles.subtitle}>
            Vue d&apos;ensemble de magasin
          </Text>
        </View>
      );
    case 'client':
    default:
      return (
        <View style={globalStyles.header}>
          <Text style={globalStyles.greeting}>Bonjour, {user?.name}!</Text>
          <Text style={globalStyles.subtitle}>
            Voici un aperçu de votre compte
          </Text>
        </View>
      );
  }
}
