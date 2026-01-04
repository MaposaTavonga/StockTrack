import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TransactionHistoryScreen({ route, navigation }) {
  const product = route.params?.product || {};
  const transactions = route.params?.transactions || [];

  const getIcon = (type) => {
    switch (type) {
      case 'cash_sale':
        return { name: 'cash-outline', color: '#2a9d8f' };
      case 'credit_sale':
        return { name: 'document-text-outline', color: '#4361ee' };
      case 'credit_buy':
        return { name: 'cart-outline', color: '#f72585' };
      case 'stock_adjust':
        return { name: 'trending-up-outline', color: '#ff9e00' };
      case 'return':
        return { name: 'arrow-back-outline', color: '#e63946' };
      default:
        return { name: 'receipt-outline', color: '#999' };
    }
  };

  const renderItem = ({ item }) => {
    const icon = getIcon(item.type);

    return (
      <View style={styles.card}>
        <View style={styles.left}>
          <View style={[styles.iconBox, { backgroundColor: `${icon.color}20` }]}>
            <Ionicons name={icon.name} size={18} color={icon.color} />
          </View>

          <View>
            <Text style={styles.type}>
              {item.type.replace('_', ' ').toUpperCase()}
            </Text>
            <Text style={styles.date}>{item.date}</Text>

            {item.customer && (
              <Text style={styles.meta}>Customer: {item.customer}</Text>
            )}
            {item.supplier && (
              <Text style={styles.meta}>Supplier: {item.supplier}</Text>
            )}
            {item.reason && (
              <Text style={styles.meta}>Reason: {item.reason}</Text>
            )}
          </View>
        </View>

        <View style={styles.right}>
          <Text style={styles.qty}>
            {item.quantity} {product.unit || 'unit'}
          </Text>
          <Text style={styles.amount}>
            ${item.total?.toFixed(2) || '0.00'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>

        <Text style={styles.title}>
          {product.name || 'Product'} History
        </Text>

        <View style={{ width: 26 }} />
      </View>

      {/* List */}
      {transactions.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="receipt-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No transactions found</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },

  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  left: {
    flexDirection: 'row',
    flex: 1,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  type: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  meta: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  qty: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2a9d8f',
    marginTop: 4,
  },

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#aaa',
  },
});
