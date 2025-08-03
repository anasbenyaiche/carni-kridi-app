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
                  (() => {
                    const balance = client.totalDebt - client.totalPaid;
                    // If balance > 0: client owes money (show in red)
                    // If balance <= 0: client is paid up or overpaid (show in green)
                    return balance > 0
                      ? globalStyles.debtText
                      : globalStyles.paidText;
                  })(),
                ]}
              >
                {(() => {
                  const balance = client.totalDebt - client.totalPaid;
                  // If balance is negative (overpaid), show absolute value in green
                  // If balance is positive (debt), show as is in red
                  return formatCurrency(
                    balance < 0 ? Math.abs(balance) : balance
                  );
                })()}
              </Text>
              <Text style={globalStyles.statLabel}>
                {(() => {
                  const balance = client.totalDebt - client.totalPaid;
                  if (balance > 0) return 'À payer';
                  if (balance < 0) return 'Crédit';
                  return 'Soldé';
                })()}
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
