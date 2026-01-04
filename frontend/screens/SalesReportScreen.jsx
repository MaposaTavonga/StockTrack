import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SalesReportScreen({ route, navigation }) {
  const transactions = route.params?.transactions || [];

  const report = useMemo(() => {
    let totalRevenue = 0;
    let totalUnits = 0;
    let cashSales = 0;
    let creditSales = 0;

    const dailyMap = {};

    transactions.forEach(t => {
      if (t.type === 'cash_sale' || t.type === 'credit_sale') {
        totalRevenue += t.total || 0;
        totalUnits += t.quantity || 0;

        if (t.type === 'cash_sale') cashSales += t.total || 0;
        if (t.type === 'credit_sale') creditSales += t.total || 0;

        if (!dailyMap[t.date]) {
          dailyMap[t.date] = { date: t.date, revenue: 0, units: 0 };
        }

        dailyMap[t.date].revenue += t.total || 0;
        dailyMap[t.date].units += t.quantity || 0;
      }
    });

    return {
      totalRevenue,
      totalUnits,
      cashSales,
      creditSales,
      daily: Object.values(dailyMap).sort((a, b) =>
        a.date < b.date ? 1 : -1
      ),
    };
  }, [transactions]);

  const renderDay = ({ item }) => (
    <View style={styles.dayCard}>
      <View>
        <Text style={styles.day}>{item.date}</Text>
        <Text style={styles.sub}>{item.units} units sold</Text>
      </View>
      <Text style={styles.amount}>${item.revenue.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Sales Report</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Summary cards */}
      <View style={styles.summaryRow}>
        <View style={styles.card}>
          <Ionicons name="cash-outline" size={24} color="#2a9d8f" />
          <Text style={styles.value}>${report.totalRevenue.toFixed(2)}</Text>
          <Text style={styles.label}>Total Revenue</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="cube-outline" size={24} color="#4361ee" />
          <Text style={styles.value}>{report.totalUnits}</Text>
          <Text style={styles.label}>Units Sold</Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.card}>
          <Ionicons name="wallet-outline" size={22} color="#2a9d8f" />
          <Text style={styles.value}>${report.cashSales.toFixed(2)}</Text>
          <Text style={styles.label}>Cash Sales</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="document-text-outline" size={22} color="#f72585" />
          <Text style={styles.value}>${report.creditSales.toFixed(2)}</Text>
          <Text style={styles.label}>Credit Sales</Text>
        </View>
      </View>

      {/* Daily breakdown */}
      <Text style={styles.section}>Daily Breakdown</Text>

      {report.daily.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="bar-chart-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No sales data available</Text>
        </View>
      ) : (
        <FlatList
          data={report.daily}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderDay}
          contentContainerStyle={{ paddingBottom: 20 }}
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

  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 6,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 6,
    color: '#333',
  },
  label: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },

  section: {
    fontSize: 16,
    fontWeight: '700',
    margin: 16,
    color: '#333',
  },

  dayCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    borderRadius: 12,
  },
  day: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sub: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2a9d8f',
  },

  empty: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#aaa',
  },
});
