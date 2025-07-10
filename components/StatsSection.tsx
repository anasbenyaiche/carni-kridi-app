import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown, Users, DollarSign } from 'lucide-react-native';
import globalStyles from '@/styles/globalStyles';


export default function StatsSection({
  summary,
  formatCurrency,
}: {
  summary: any;
  formatCurrency: (a: number) => string;
}) {
  return (
    <View style={globalStyles.statsContainer}>
      <View style={globalStyles.statCard}>
        <View style={globalStyles.statIcon}>
          <TrendingUp size={24} color="#10B981" />
        </View>
        <Text style={globalStyles.statValue}>
          {formatCurrency(summary?.summary?.find((s: any) => s._id === 'debt')?.remaining || 0)}
        </Text>
        <Text style={globalStyles.statLabel}>Crédits en cours</Text>
      </View>
      <View style={globalStyles.statCard}>
        <View style={globalStyles.statIcon}>
          <TrendingDown size={24} color="#3B82F6" />
        </View>
        <Text style={globalStyles.statValue}>
          {formatCurrency(summary?.summary?.find((s: any) => s._id === 'payment')?.total || 0)}
        </Text>
        <Text style={globalStyles.statLabel}>Paiements reçus</Text>
      </View>
      <View style={globalStyles.statCard}>
        <View style={globalStyles.statIcon}>
          <Users size={24} color="#F59E0B" />
        </View>
        <Text style={globalStyles.statValue}>{summary?.clientCount || 0}</Text>
        <Text style={globalStyles.statLabel}>Total clients</Text>
      </View>
      <View style={globalStyles.statCard}>
        <View style={globalStyles.statIcon}>
          <DollarSign size={24} color="#8B5CF6" />
        </View>
        <Text style={globalStyles.statValue}>{summary?.activeClients || 0}</Text>
        <Text style={globalStyles.statLabel}>Clients actifs</Text>
      </View>
    </View>
  );
}