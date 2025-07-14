import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';
import ConfirmModal from '../../components/ConfirmModal';
import AddEmployerForm from '../../components/AddEmployerForm';
import { Users, Shield, UserCheck } from 'lucide-react-native';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showWorkerModal, setShowWorkerModal] = useState(false);

  const handleLogout = async () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  // Handle adding worker
  const handleAddWorker = (data: { name: string; phone: string }) => {
    // TODO: Call your API or logic here
    console.log('Adding worker:', data);
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Consistent header style */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Paramètres</Text>
        </View>

        {/* Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profil</Text>
          <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
            <UserCheck size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.actionButtonText}>Modifier le profil</Text>
          </TouchableOpacity>
          <View style={styles.spacer} />
          <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
            <Shield size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.actionButtonText}>Changer le mot de passe</Text>
          </TouchableOpacity>
        </View>

        {/* Admin/Attara specific actions */}
        {user?.role === 'admin' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Administration</Text>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => router.push('/admin')}
            >
              <Shield size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.actionButtonText}>Interface Admin</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Attara-specific actions */}
        {user?.role === 'attara' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gestion des employés</Text>
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowWorkerModal(true)}>
              <Users size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.actionButtonText}>Ajouter un employé</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Activer les notifications</Text>
            <Switch value={true} onValueChange={() => {}} />
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compte</Text>
          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
            <Text style={styles.actionButtonText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <Text style={styles.aboutText}>Version 1.0.0</Text>
          <Text style={styles.aboutSubtext}>Carni Kridi - Gestion des crédits</Text>
        </View>
      </ScrollView>
      
      <ConfirmModal
        visible={showLogoutModal}
        title="Déconnexion"
        message="Voulez-vous vraiment vous déconnecter ?"
        confirmText="Se déconnecter"
        cancelText="Annuler"
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
      
      <AddEmployerForm
        visible={showWorkerModal}
        onClose={() => setShowWorkerModal(false)}
        onSubmit={handleAddWorker}
      />
    </>
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
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#10B981',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
    // Consistent with stats/clients
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  aboutText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  spacer: {
    height: 8,
  },
  actionButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  aboutSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
});