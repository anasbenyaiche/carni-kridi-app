import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmModal from '../../components/ConfirmModal';
import AddStoreForm from '../../components/AddStoreForm';
import AddEmployerForm from '../../components/AddEmployerForm';
import { Store, Users } from 'lucide-react-native';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showWorkerModal, setShowWorkerModal] = useState(false);

  const handleLogout = async () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  // Replace with your actual logic to add store/worker
  const handleAddStore = (data: { name: string; address: string }) => {
    // TODO: Call your API or logic here
  };

  const handleAddWorker = (data: { name: string; phone: string }) => {
    // TODO: Call your API or logic here
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
            <Text style={styles.actionButtonText}>Modifier le profil</Text>
          </TouchableOpacity>
          <View style={styles.spacer} />
          <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
            <Text style={styles.actionButtonText}>Changer le mot de passe</Text>
          </TouchableOpacity>
        </View>

        {/* Attara-specific actions */}
        {user?.role === 'attara' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gestion du magasin</Text>
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowStoreModal(true)}>
              <Store size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.actionButtonText}>Ajouter un magasin</Text>
            </TouchableOpacity>
            <View style={styles.spacer} />
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
          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <Text style={styles.actionButtonText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          <Text style={styles.aboutText}>Version 1.0.0</Text>
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
      <AddStoreForm
        visible={showStoreModal}
        onClose={() => setShowStoreModal(false)}
        onSubmit={handleAddStore}
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
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});