import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { kridiService } from '../../services/kridiService';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  FileText,
} from 'lucide-react-native';
import { formatMonthYear } from '../../utils/dateUtils';

export default function StatsScreen() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await kridiService.getSummary();
      setSummary(data);
    } catch (error) {
      console.error('Error loading stats:', error);
      Alert.alert('Erreur', 'Impossible de charger les statistiques');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} TND`;
  };

  const getDebtSummary = () => {
    const debtData = summary?.summary?.find((s: any) => s._id === 'debt');
    return {
      total: debtData?.total || 0,
      remaining: debtData?.remaining || 0,
      count: debtData?.count || 0,
    };
  };

  const getPaymentSummary = () => {
    const paymentData = summary?.summary?.find((s: any) => s._id === 'payment');
    return {
      total: paymentData?.total || 0,
      count: paymentData?.count || 0,
    };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement des statistiques...</Text>
      </View>
    );
  }

  const debtSummary = getDebtSummary();
  const paymentSummary = getPaymentSummary();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Statistiques</Text>
        <TouchableOpacity style={styles.exportButton}>
          <FileText size={20} color="#FFFFFF" />
          <Text style={styles.exportText}>Exporter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <TrendingUp size={24} color="#EF4444" />
            <Text style={styles.statTitle}>Crédits</Text>
          </View>
          <Text style={styles.statValue}>
            {formatCurrency(debtSummary.remaining)}
          </Text>
          <Text style={styles.statSubtext}>
            {debtSummary.count} transaction(s) •{' '}
            {formatCurrency(debtSummary.total)} total
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <TrendingDown size={24} color="#10B981" />
            <Text style={styles.statTitle}>Paiements</Text>
          </View>
          <Text style={styles.statValue}>
            {formatCurrency(paymentSummary.total)}
          </Text>
          <Text style={styles.statSubtext}>
            {paymentSummary.count} paiement(s) reçu(s)
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Users size={24} color="#3B82F6" />
            <Text style={styles.statTitle}>Clients</Text>
          </View>
          <Text style={styles.statValue}>{summary?.clientCount || 0}</Text>
          <Text style={styles.statSubtext}>
            {summary?.activeClients || 0} client(s) actif(s)
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <DollarSign size={24} color="#F59E0B" />
            <Text style={styles.statTitle}>Solde Net</Text>
          </View>
          <Text
            style={[
              styles.statValue,
              debtSummary.remaining - paymentSummary.total > 0
                ? styles.positiveValue
                : styles.negativeValue,
            ]}
          >
            {formatCurrency(debtSummary.remaining - paymentSummary.total)}
          </Text>
          <Text style={styles.statSubtext}>
            {debtSummary.remaining - paymentSummary.total > 0
              ? 'À recevoir'
              : 'Excédent'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Résumé Mensuel</Text>
        <View style={styles.monthlyCard}>
          <View style={styles.monthlyHeader}>
            <Calendar size={20} color="#6B7280" />
            <Text style={styles.monthlyTitle}>{formatMonthYear()}</Text>
          </View>
          <View style={styles.monthlyStats}>
            <View style={styles.monthlyStat}>
              <Text style={styles.monthlyStatLabel}>Nouveaux crédits</Text>
              <Text style={styles.monthlyStatValue}>
                {formatCurrency(debtSummary.total)}
              </Text>
            </View>
            <View style={styles.monthlyStat}>
              <Text style={styles.monthlyStatLabel}>Paiements reçus</Text>
              <Text style={styles.monthlyStatValue}>
                {formatCurrency(paymentSummary.total)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Indicateurs</Text>
        <View style={styles.indicatorCard}>
          <View style={styles.indicator}>
            <Text style={styles.indicatorLabel}>Taux de recouvrement</Text>
            <Text style={styles.indicatorValue}>
              {debtSummary.total > 0
                ? `${((paymentSummary.total / debtSummary.total) * 100).toFixed(
                    1
                  )}%`
                : '0%'}
            </Text>
          </View>
          <View style={styles.indicator}>
            <Text style={styles.indicatorLabel}>Crédit moyen par client</Text>
            <Text style={styles.indicatorValue}>
              {summary?.clientCount > 0
                ? formatCurrency(debtSummary.remaining / summary.clientCount)
                : '0.00 TND'}
            </Text>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  exportText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  positiveValue: {
    color: '#EF4444',
  },
  negativeValue: {
    color: '#10B981',
  },
  statSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  monthlyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthlyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  monthlyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textTransform: 'capitalize',
  },
  monthlyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthlyStat: {
    flex: 1,
    alignItems: 'center',
  },
  monthlyStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  monthlyStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  indicatorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  indicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  indicatorLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  indicatorValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});
