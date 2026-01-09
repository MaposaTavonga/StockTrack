import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params || {
    id: '1',
    name: 'Sample Product',
    stock: 25,
    price: 4.99,
    category: 'Pantry',
    brand: 'Sample Brand',
    unit: 'unit'
  };

  // State for main functionality
  const [quantity, setQuantity] = useState('1');
 
const [salePrice, setSalePrice] = useState(product?.price?.toString() || '0.00');

  const [customerName, setCustomerName] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [notes, setNotes] = useState('');
  const [isCreditSale, setIsCreditSale] = useState(false);
  const [isCreditBuy, setIsCreditBuy] = useState(false);
  const [saleHistory, setSaleHistory] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  // Animation values
  const sidebarAnim = useRef(new Animated.Value(-width * 0.7)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  // Sale transaction types
  const transactionTypes = [
    { id: 'cash_sale', label: 'Cash Sale', icon: 'cash-outline' },
    { id: 'credit_sale', label: 'Credit Sale', icon: 'document-text-outline' },
    
  ];

  const [selectedTransaction, setSelectedTransaction] = useState('cash_sale');

  // Sample sales history data
  useEffect(() => {
    // This would come from your database/API
    const sampleHistory = [
      { id: '1', date: '2024-01-15', type: 'cash_sale', quantity: 2, price: 4.99, total: 9.98, customer: 'John Doe' },
      { id: '2', date: '2024-01-14', type: 'credit_sale', quantity: 1, price: 4.99, total: 4.99, customer: 'Jane Smith', dueDate: '2024-02-14' },
      { id: '3', date: '2024-01-13', type: 'credit_buy', quantity: 10, price: 3.50, total: 35.00, supplier: 'Supplier Co' },
      { id: '4', date: '2024-01-12', type: 'stock_adjust', quantity: 5, adjustment: '+5', reason: 'Found in storage' },
    ];
    setSaleHistory(sampleHistory);
  }, []);

  const toggleSidebar = () => {
    if (sidebarVisible) {
      Animated.parallel([
        Animated.timing(sidebarAnim, {
          toValue: -width * 0.7,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => setSidebarVisible(false));
    } else {
      setSidebarVisible(true);
      Animated.parallel([
        Animated.timing(sidebarAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const handleRecordSale = () => {
    const qty = parseInt(quantity);
    const price = parseFloat(salePrice);

    if (!qty || qty <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity');
      return;
    }

    if (!price || price <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price');
      return;
    }

    const total = qty * price;
    
    let message = '';
    let title = '';

    switch(selectedTransaction) {
      case 'cash_sale':
        title = 'Cash Sale Recorded';
        message = `Sold ${qty} ${product.unit}(s) of ${product.name} for R${total.toFixed(2)}`;
        break;
      
      case 'credit_sale':
        if (!customerName.trim()) {
          Alert.alert('Customer Required', 'Please enter customer name for credit sale');
          return;
        }
        title = 'Credit Sale Recorded';
        message = `Credit sale of ${qty} ${product.unit}(s) to ${customerName} for R${total.toFixed(2)}`;
        break;
      
      case 'credit_buy':
        if (!supplierName.trim()) {
          Alert.alert('Supplier Required', 'Please enter supplier name for credit purchase');
          return;
        }
        title = 'Credit Purchase Recorded';
        message = `Purchased ${qty} ${product.unit}(s) from ${supplierName} on credit for R${total.toFixed(2)}`;
        break;
      
      case 'stock_adjust':
        title = 'Stock Adjusted';
        message = `Adjusted stock by ${qty} ${product.unit}(s). New stock: ${product.stock + qty}`;
        break;
      
      case 'return':
        title = 'Return Recorded';
        message = `Returned ${qty} ${product.unit}(s) from ${customerName || 'customer'}`;
        break;
    }

    if (notes) {
      message += `\nNotes: ${notes}`;
    }

    Alert.alert(
      title,
      message,
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setQuantity('1');
            setSalePrice(product?.price?.toString() || '0.00'); // <-- safe
            setCustomerName('');
            setSupplierName('');
            setNotes('');
            setSelectedTransaction('cash_sale');
          }
        }
      ]
    );
  };

  const calculateTotal = () => {
    const qty = parseInt(quantity) || 0;
    const price = parseFloat(salePrice) || 0;
    return (qty * price).toFixed(2);
  };

  const getTransactionIcon = (type) => {
    switch(type) {
      case 'cash_sale': return 'cash-outline';
      case 'credit_sale': return 'document-text-outline';
      case 'credit_buy': return 'cart-outline';
      case 'stock_adjust': return 'trending-up-outline';
      case 'return': return 'arrow-back-outline';
      default: return 'cash-outline';
    }
  };

  const renderTransactionForm = () => {
    const formStyles = {
      cash_sale: { borderColor: '#2a9d8f', backgroundColor: '#e9f5f3' },
      credit_sale: { borderColor: '#4361ee', backgroundColor: '#eef2ff' },
      credit_buy: { borderColor: '#f72585', backgroundColor: '#fde8f1' },
      stock_adjust: { borderColor: '#ff9e00', backgroundColor: '#fff4e6' },
      return: { borderColor: '#e63946', backgroundColor: '#ffeaea' }
    };

    return (
      <View style={[styles.transactionForm, formStyles[selectedTransaction]]}>
        <View style={styles.transactionHeader}>
          <Ionicons name={getTransactionIcon(selectedTransaction)} size={24} color={formStyles[selectedTransaction].borderColor} />
          <Text style={[styles.transactionTitle, { color: formStyles[selectedTransaction].borderColor }]}>
            {transactionTypes.find(t => t.id === selectedTransaction)?.label}
          </Text>
        </View>

        <View style={styles.quantityPriceRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => {
                  const current = parseInt(quantity) || 0;
                  setQuantity(Math.max(1, current - 1).toString());
                }}
              >
                <Ionicons name="remove" size={20} color="#fff" />
              </TouchableOpacity>
              <TextInput
                style={[styles.input, styles.quantityInput]}
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
                placeholder="Qty"
              />
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => {
                  const current = parseInt(quantity) || 0;
                  setQuantity((current + 1).toString());
                }}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price per unit</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>R</Text>
              <TextInput
                style={[styles.input, styles.priceInput]}
                keyboardType="decimal-pad"
                value={salePrice}
                onChangeText={setSalePrice}
                placeholder="0.00"
              />
            </View>
          </View>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalAmount}>R{calculateTotal()}</Text>
        </View>

        {(selectedTransaction === 'credit_sale' || selectedTransaction === 'return') && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {selectedTransaction === 'credit_sale' ? 'Customer Name' : 'Customer Name (Return)'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={selectedTransaction === 'credit_sale' ? 'Enter customer name' : 'Enter customer name for return'}
              value={customerName}
              onChangeText={setCustomerName}
            />
          </View>
        )}

        {selectedTransaction === 'credit_buy' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Supplier Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter supplier name"
              value={supplierName}
              onChangeText={setSupplierName}
            />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Add any notes about this transaction..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>
      </View>
    );
  };

  const Sidebar = () => (
    <>
      <Animated.View 
        style={[
          styles.sidebarOverlay,
          { opacity: overlayAnim }
        ]}
        pointerEvents={sidebarVisible ? 'auto' : 'none'}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={toggleSidebar}
          activeOpacity={1}
        />
      </Animated.View>

      <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarAnim }] }]}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>Product Options</Text>
          <TouchableOpacity onPress={toggleSidebar}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.sidebarContent}>
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => {
              toggleSidebar();
              // Navigate to edit screen
              navigation.navigate('EditProductScreen', { product });
            }}
          >
            <Ionicons name="create-outline" size={22} color="#666" />
            <Text style={styles.sidebarItemText}>Edit Product</Text>
          </TouchableOpacity   >

          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => {
              toggleSidebar();
              // Navigate to stock history
              navigation.navigate('StockHistory', { product });
            }}
          >
            <Ionicons name="trending-up-outline" size={22} color="#666" />
            <Text style={styles.sidebarItemText}>Stock History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => {
              toggleSidebar();
              // Navigate to sales report
              navigation.navigate('SalesReport', { product });
            }}
          >
            <Ionicons name="bar-chart-outline" size={22} color="#666" />
            <Text style={styles.sidebarItemText}>Sales Report</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => {
              toggleSidebar();
              // Navigate to set reorder level
              navigation.navigate('ReorderLevel', { product });
            }}
          >
            <Ionicons name="alert-circle-outline" size={22} color="#666" />
            <Text style={styles.sidebarItemText}>Set Reorder Level</Text>
          </TouchableOpacity>

          <View style={styles.sidebarDivider} />

          <TouchableOpacity
            style={[styles.sidebarItem, styles.dangerItem]}
            onPress={() => {
              toggleSidebar();
              Alert.alert(
                'Delete Product',
                `Are you sure you want to delete ${product.name}?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: () => {
                      navigation.goBack();
                      // Add your delete logic here
                    }
                  }
                ]
              );
            }}
          >
            <Ionicons name="trash-outline" size={22} color="#e63946" />
            <Text style={[styles.sidebarItemText, styles.dangerText]}>Delete Product</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={() => {
              toggleSidebar();
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back-outline" size={22} color="#666" />
            <Text style={styles.sidebarItemText}>Back to Products</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.sidebarFooter}>
          <Text style={styles.sidebarFooterText}>Product Details</Text>
          <Text style={styles.sidebarFooterSubtext}>
            ID: {product.id} • Stock: {product.stock}
          </Text>
        </View>
      </Animated.View>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.productDetails}>
            Stock: {product.stock} • R{product.price}/{product.unit}
          </Text>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Product Info Card */}
        <View style={styles.productCard}>
          <View style={styles.productInfoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Current Stock</Text>
              <Text style={styles.infoValue}>{product.stock} {product.unit}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Price</Text>
              <Text style={styles.infoValue}>R{product.price}/{product.unit}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{product.category}</Text>
            </View>
          </View>
        </View>

        {/* Transaction Type Selector */}
        <Text style={styles.sectionTitle}>Select Transaction Type</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.transactionSelector}
        >
          {transactionTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.transactionTypeButton,
                selectedTransaction === type.id && styles.transactionTypeButtonActive
              ]}
              onPress={() => setSelectedTransaction(type.id)}
            >
              <Ionicons
                name={type.icon}
                size={24}
                color={selectedTransaction === type.id ? '#fff' : '#666'}
              />
              <Text style={[
                styles.transactionTypeText,
                selectedTransaction === type.id && styles.transactionTypeTextActive
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Transaction Form */}
        {renderTransactionForm()}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => {
              setQuantity('1');
              setSalePrice(product?.price?.toString() || '0.00'); // <-- safe
              setCustomerName('');
              setSupplierName('');
              setNotes('');
            }}
          >
            <Ionicons name="refresh-outline" size={20} color="#666" />
            <Text style={styles.cancelButtonText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.recordButton]}
            onPress={handleRecordSale}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.recordButtonText}>Record Transaction</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <View style={styles.historyCard}>
          {saleHistory.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Ionicons name="receipt-outline" size={48} color="#ddd" />
              <Text style={styles.emptyHistoryText}>No transactions yet</Text>
              <Text style={styles.emptyHistorySubtext}>Record your first transaction above</Text>
            </View>
          ) : (
            saleHistory.slice(0, 5).map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyItemLeft}>
                  <View style={[
                    styles.historyIcon,
                    { backgroundColor: item.type === 'cash_sale' ? '#e9f5f3' : 
                      item.type === 'credit_sale' ? '#eef2ff' :
                      item.type === 'credit_buy' ? '#fde8f1' :
                      item.type === 'stock_adjust' ? '#fff4e6' : '#ffeaea' }
                  ]}>
                    <Ionicons
                      name={getTransactionIcon(item.type)}
                      size={16}
                      color={item.type === 'cash_sale' ? '#2a9d8f' : 
                        item.type === 'credit_sale' ? '#4361ee' :
                        item.type === 'credit_buy' ? '#f72585' :
                        item.type === 'stock_adjust' ? '#ff9e00' : '#e63946'}
                    />
                  </View>
                  <View>
                    <Text style={styles.historyType}>
                      {transactionTypes.find(t => t.id === item.type)?.label}
                    </Text>
                    <Text style={styles.historyDate}>{item.date}</Text>
                    <Text style={styles.historyDetails}>
                      {item.customer && `Customer: ${item.customer}`}
                      {item.supplier && `Supplier: ${item.supplier}`}
                      {!item.customer && !item.supplier && item.reason}
                    </Text>
                  </View>
                </View>
                <View style={styles.historyItemRight}>
                  <Text style={styles.historyQuantity}>{item.quantity} {product.unit}</Text>
                  <Text style={styles.historyTotal}>R{item.total?.toFixed(2) || '0.00'}</Text>
                </View>
              </View>
            ))
          )}
          {saleHistory.length > 0 && (
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('TransactionHistory', { product })}
            >
              <Text style={styles.viewAllText}>View All Transactions</Text>
              <Ionicons name="arrow-forward" size={16} color="#2a9d8f" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Sidebar */}
      <Sidebar />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  productDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  productInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  transactionSelector: {
    marginBottom: 20,
  },
  transactionTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#eee',
  },
  transactionTypeButtonActive: {
    backgroundColor: '#2a9d8f',
    borderColor: '#2a9d8f',
  },
  transactionTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 8,
  },
  transactionTypeTextActive: {
    color: '#fff',
  },
  transactionForm: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#2a9d8f',
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  transactionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
  },
  quantityPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    backgroundColor: '#2a9d8f',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityInput: {
    textAlign: 'center',
    marginHorizontal: 8,
    width: 60,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2a9d8f',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#f1f3f4',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginLeft: 8,
  },
  recordButton: {
    backgroundColor: '#2a9d8f',
    shadowColor: '#2a9d8f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  recordButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyHistoryText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  historyDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  historyDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  historyItemRight: {
    alignItems: 'flex-end',
  },
  historyQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  historyTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2a9d8f',
    marginTop: 2,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2a9d8f',
    marginRight: 8,
  },
  // Sidebar Styles
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 999,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.7,
    backgroundColor: '#fff',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 50,
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  sidebarContent: {
    flex: 1,
    padding: 20,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  sidebarItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  dangerItem: {
    marginTop: 10,
  },
  dangerText: {
    color: '#e63946',
  },
  sidebarFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f8f9fa',
  },
  sidebarFooterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sidebarFooterSubtext: {
    fontSize: 12,
    color: '#666',
  },
});