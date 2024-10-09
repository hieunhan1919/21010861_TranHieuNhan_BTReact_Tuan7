import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ShopsNearMe from './screens/ShopsNearMe';
import DrinksScreen from './screens/DrinksScreen';
import CartScreen from './screens/CartScreen'; 
import Home from './screens/Home';
import { CartProvider } from './contexts/CartContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <CartProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
        name="Home" 
        component={Home} 
        options={{ headerShown: false }}
        />
        <Stack.Screen 
        name="ShopsNearMe" 
        component={ShopsNearMe} 
        options={{ 
            headerTitle: '',
            headerBackTitleVisible: false, 
            headerStyle: {
            elevation: 0, 
            shadowOpacity: 0, 
            borderBottomWidth: 0, 
            },
        header: () => null,
        }} 
        />
        <Stack.Screen 
        name="DrinksScreen" 
        component={DrinksScreen} 
        options={{ 
            headerTitle: '',
            headerBackTitleVisible: false, 
            headerStyle: {
              elevation: 0, 
              shadowOpacity: 0, 
              borderBottomWidth: 0, 
            },
        header: () => null,
        }}
        />
        <Stack.Screen 
        name="CartScreen" 
        component={CartScreen} 
        options={{ 
            headerTitle: '',
            headerBackTitleVisible: false, 
            headerStyle: {
              elevation: 0, 
              shadowOpacity: 0, 
              borderBottomWidth: 0, 
            },
        header: () => null,
        }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </CartProvider>
  );
}