import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import {
  Users,
  Store,
  BarChart3,
  Settings,
  Shield,
  Database,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react-native';

export default function AdminDashboard() {
  const { user } = useAuth();

  // Only allow admin access
  if (!user || user.role !== 'admin') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Administration</Text>
        </View>
        <View style={styles.unauthorizedContainer}>
          <Shield size={64} color="#EF4444" />
          <Text style={styles.unauthorizedText}>Accès non autorisé</Text>
          <Text style={styles.unauthorizedSubtext}>
            Seuls les administrateurs peuvent accéder à cette interface
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const adminActions = [
    {
      title: 'Gestion des utilisateurs',
      description: 'Gérer les comptes utilisateurs',
      icon: Users,
      onPress: () => router.push('/admin/users'),
      color: '#3B82F6',
    },
    {
      title: 'Gestion des magasins',
      description: 'Superviser tous les magasins',
      icon: Store,
      onPress: () => router.push('/admin/stores'),
      color: '#10B981',
    },
    {
      title: 'Statistiques globales',
      description: 'Voir les statistiques système',
      icon: BarChart3,
      onPress: () => router.push('/admin/stats'),
      color: '#8B5CF6',
    },
    {
      title: 'Configuration système',
      description: 'Paramètres globaux',
      icon: Settings,
      onPress: () => router.push('/admin/settings'),
      color: '#F59E0B',
    },
    {
      title: 'Base de données',
      description: 'Maintenance et backup',
      icon: Database,
      onPress: () => router.push('/admin/database'),
      color: '#6B7280',
    },
    {
      title: "Rapports d'activité",
      description: 'Logs et activités',
      icon: TrendingUp,
      onPress: () => router.push('/admin/reports'),
      color: '#EF4444',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Administration</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>Bienvenue, {user.name}</Text>
        <Text style={styles.welcomeSubtitle}>
          Interface d'administration système
        </Text>
      </View>

      <View style={styles.quickStats}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Utilisateurs actifs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Magasins</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Transactions</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Actions administratives</Text>

      <View style={styles.actionsGrid}>
        {adminActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.actionCard, { borderLeftColor: action.color }]}
            onPress={action.onPress}
          >
            <View style={styles.actionHeader}>
              <action.icon size={24} color={action.color} />
              <Text style={styles.actionTitle}>{action.title}</Text>
            </View>
            <Text style={styles.actionDescription}>{action.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.alertsSection}>
        <View style={styles.alertCard}>
          <AlertTriangle size={20} color="#F59E0B" />
          <Text style={styles.alertText}>
            Interface d'administration en développement
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#1F2937',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  quickStats: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  actionsGrid: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 12,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 36,
  },
  alertsSection: {
    marginHorizontal: 20,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  alertText: {
    fontSize: 14,
    color: '#92400E',
    marginLeft: 8,
    flex: 1,
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  unauthorizedText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  unauthorizedSubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
});
