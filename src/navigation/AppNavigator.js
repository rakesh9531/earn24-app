// import React from 'react';
// import { View, Text } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Icon from 'react-native-vector-icons/Ionicons';

// // Import all your existing screens
// import HomeScreen from '../screens/HomeScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import SignUpScreen from '../screens/SignUpScreen';
// import LoginScreen from '../screens/LoginScreen';
// import MlmDashboardScreen from '../screens/MlmDashboardScreen';
// import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';
// import MyNetworkScreen from '../screens/MyNetworkScreen';
// import CartScreen from '../screens/CartScreen';
// import AddressListScreen from '../screens/AddressListScreen';
// import AddEditAddressScreen from '../screens/AddEditAddressScreen';
// import OrderSummaryScreen from '../screens/OrderSummaryScreen';
// import OrderSuccessScreen from '../screens/OrderSuccessScreen';
// import OrderHistoryScreen from '../screens/OrderHistoryScreen';
// import OrderDetailsScreen from '../screens/OrderDetailsScreen';
// import ProductDetailsScreen from '../screens/ProductDetailsScreen';

// // --- IMPORT THE NEW SCREENS ---
// import SearchScreen from '../screens/SearchScreen';
// import SearchResultsScreen from '../screens/SearchResultsScreen';
// import FilterScreen from '../screens/FilterScreen';

// import CategoryProductsScreen from '../screens/CategoryProductsScreen';

// // A simple placeholder for unfinished tabs
// const PlaceholderScreen = ({ route }) => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <Text>{route.name} Screen</Text>
//   </View>
// );

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// function MainTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarActiveTintColor: '#0CA201',
//         tabBarInactiveTintColor: 'gray',
//         tabBarStyle: { paddingBottom: 5, height: 60, borderTopWidth: 0, elevation: 0 },
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;
//           if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
//           else if (route.name === 'Favourite') iconName = focused ? 'heart' : 'heart-outline';
//           else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
//           else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
//           return <Icon name={iconName} size={size} color={color} />;
//         },
//       })}>
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{ headerShown: true }}
//       />
//       <Tab.Screen
//         name="Favourite"
//         component={PlaceholderScreen}
//         options={{ headerShown: false }}
//       />

//       {/* ==========================================================
//           === THE FIX IS HERE: Only one screen named "Search"    ===
//           ========================================================== */}
//       <Tab.Screen
//         name="Search"
//         component={SearchScreen} // Use the new SearchScreen here
//         options={{
//             headerShown: true,
//             title: "Search"
//         }}
//       />

//       <Tab.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{ headerShown: false }}
//       />
//     </Tab.Navigator>
//   );
// }

// const AppNavigator = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="AppTabs"
//         component={MainTabs}
//         options={{ headerShown: false }}
//       />
//       {/* All your existing Stack Screens */}
//       <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'My Basket', presentation: 'modal' }}/>
//       <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
//       <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }}/>
//       <Stack.Screen name="MlmDashboard" component={MlmDashboardScreen} options={{ title: 'My Wallet & Network' }}/>
//       <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen}/>
//       <Stack.Screen name="MyNetwork" component={MyNetworkScreen} options={{ title: 'My Network' }}/>
//       <Stack.Screen name="AddressList" component={AddressListScreen} options={{ title: 'Select Delivery Address' }}/>
//       <Stack.Screen name="AddEditAddress" component={AddEditAddressScreen} options={{ title: 'Manage Address' }}/>
//       <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} options={{ title: 'Confirm Order' }} />
//       <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} options={{ headerShown: false }} />
//       <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ title: 'My Orders' }} />
//       <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} options={{ title: 'Order Details' }} />
//       <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={({ route }) => ({ title: route.params.product.name, headerBackTitle: 'Back' })} />

//       {/* --- ADD THE NEW SCREENS TO THE MAIN STACK NAVIGATOR --- */}
//       <Stack.Screen
//         name="SearchResults"
//         component={SearchResultsScreen}
//         options={({ route }) => ({ title: `Results for "${route.params.query}"` })}
//       />
//       <Stack.Screen
//         name="Filter"
//         component={FilterScreen}
//         options={{
//           title: 'Filter & Refine',
//           presentation: 'modal',
//         }}
//       />

//       <Stack.Screen
//         name="CategoryProducts" // This name MUST exactly match what you use in navigation.navigate()
//         component={CategoryProductsScreen}
//         // The title will be set dynamically inside the screen itself
//       />

//     </Stack.Navigator>

//   );
// };

// export default AppNavigator;

// New code with otp

import React from 'react';
import { View, Text, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import all your existing screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LoginScreen from '../screens/LoginScreen';
import MlmDashboardScreen from '../screens/MlmDashboardScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';
import MyNetworkScreen from '../screens/MyNetworkScreen';
import CartScreen from '../screens/CartScreen';
import AddressListScreen from '../screens/AddressListScreen';
import AddEditAddressScreen from '../screens/AddEditAddressScreen';
import OrderSummaryScreen from '../screens/OrderSummaryScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';

// NEW SEARCH SCREENS
import SearchScreen from '../screens/SearchScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import FilterScreen from '../screens/FilterScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';

// --- ✅ NEW AUTH SCREENS ---
import OtpVerificationScreen from '../screens/OtpVerificationScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import PaymentWebView from '../screens/PaymentWebView';
import InformationScreen from '../screens/InformationScreen';
import FavouriteScreen from '../screens/FavouriteScreen';
import MyRewardsScreen from '../screens/MyRewardsScreen';
import KYCVerificationScreen from '../screens/KYCVerificationScreen';
import WithdrawalScreen from '../screens/WithdrawalScreen';


// A simple placeholder for unfinished tabs
const PlaceholderScreen = ({ route }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{route.name} Screen</Text>
  </View>
);

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#0CA201',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          borderTopWidth: 0.5,
          borderTopColor: '#e0e0e0',
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          backgroundColor: '#fff',
          height: Platform.OS === 'ios'
            ? (insets.bottom > 0 ? 55 + insets.bottom : 65)
            : (insets.bottom > 0 ? 60 + insets.bottom : 65),
          paddingBottom: Platform.OS === 'ios'
            ? (insets.bottom > 0 ? insets.bottom : 10)
            : (insets.bottom > 0 ? insets.bottom : 10),
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home')
            iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Favourite')
            iconName = focused ? 'heart' : 'heart-outline';
          else if (route.name === 'Search')
            iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Profile')
            iconName = focused ? 'person' : 'person-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: true }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ headerShown: true, title: 'Search' }}
      />
      <Tab.Screen
        name="Favourite"
        component={FavouriteScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      {/* 1. App Tabs (Main Application) */}
      <Stack.Screen
        name="AppTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />

      {/* 2. Authentication Screens */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />

      {/* ✅ Added these for OTP flow */}
      <Stack.Screen
        name="OtpVerification"
        component={OtpVerificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ headerShown: false }}
      />

      {/* 3. Feature Screens */}
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'My Basket', presentation: 'modal' }}
      />
      <Stack.Screen
        name="MlmDashboard"
        component={MlmDashboardScreen}
        options={{ title: 'My Wallet & Network' }}
      />
      <Stack.Screen
        name="TransactionHistory"
        component={TransactionHistoryScreen}
      />
      <Stack.Screen
        name="MyNetwork"
        component={MyNetworkScreen}
        options={{ title: 'My Network' }}
      />
      <Stack.Screen
        name="AddressList"
        component={AddressListScreen}
        options={{ title: 'Select Delivery Address' }}
      />
      <Stack.Screen
        name="AddEditAddress"
        component={AddEditAddressScreen}
        options={{ title: 'Manage Address' }}
      />
      <Stack.Screen
        name="OrderSummary"
        component={OrderSummaryScreen}
        options={{ title: 'Confirm Order' }}
      />
      <Stack.Screen
        name="OrderSuccess"
        component={OrderSuccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{ title: 'My Orders' }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{ title: 'Order Details' }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={({ route }) => ({
          title: route.params.product.name,
          headerBackTitle: 'Back',
        })}
      />
      <Stack.Screen
        name="SearchResults"
        component={SearchResultsScreen}
        options={({ route }) => ({
          title: `Results for "${route.params.query}"`,
        })}
      />
      <Stack.Screen
        name="Filter"
        component={FilterScreen}
        options={{ title: 'Filter & Refine', presentation: 'modal' }}
      />
      <Stack.Screen
        name="CategoryProducts"
        component={CategoryProductsScreen}
      />

      <Stack.Screen
        name="PaymentWebView"
        component={PaymentWebView}
        options={{ headerShown: false }} // We handle the header inside the screen
      />

      <Stack.Screen name="Information" component={InformationScreen} />
      <Stack.Screen
        name="MyRewards"
        component={MyRewardsScreen}
        options={{ title: 'My Rewards & Funds' }}
      />
      <Stack.Screen
        name="KYCVerification"
        component={KYCVerificationScreen}
        options={{ title: 'KYC Verification' }}
      />
      <Stack.Screen
        name="Withdrawal"
        component={WithdrawalScreen}
        options={{ title: 'Request Withdrawal' }}
      />



    </Stack.Navigator>
  );
};

export default AppNavigator;
