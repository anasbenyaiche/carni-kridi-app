import globalStyles from '@/styles/globalStyles';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function RecentClientsSection({
  recentClients,
  formatCurrency,
  onClientPress,
}: {
  recentClients: any[];
  formatCurrency: (a: number) => string;
  onClientPress: (client: any) => void;
}) {
  return (
    <View style={globalStyles.section}>
      <Text style={globalStyles.sectionTitle}>Clients récents</Text>
      {recentClients.length > 0 ? (
        recentClients.map((client) => (
          <TouchableOpacity
            key={client._id}
            style={globalStyles.clientCard}
            onPress={() => onClientPress(client)}
          >
            <View style={globalStyles.clientInfo}>
              <Text style={globalStyles.clientName}>{client.name}</Text>
              <Text style={globalStyles.clientPhone}>{client.phone}</Text>
            </View>
            <View style={globalStyles.clientBalance}>
              <Text
                style={[
                  globalStyles.balanceText,
                  client.totalDebt > 0
                    ? globalStyles.debtText
                    : globalStyles.paidText,
                ]}
              >
                {formatCurrency(client.totalDebt - client.totalPaid)}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={globalStyles.emptyText}>Aucun client trouvé</Text>
      )}
    </View>
  );
}