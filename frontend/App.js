import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SetupUserScreen from './screens/SetupUserScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ProductsScreen from './screens/ProductsScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import EditProductScreen from './screens/EditProductScreen';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';
import SalesReportScreen from './screens/SalesReportScreen';
import AddProductScreen from './screens/AddProductScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SetupUser" component={SetupUserScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
<Stack.Screen name="Products" component={ProductsScreen} />
<Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="EditProductScreen" component={EditProductScreen} />
        <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
        <Stack.Screen name="SalesReport" component={SalesReportScreen} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
