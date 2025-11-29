// // import React from 'react';
// // import { View, Text } from 'react-native';
// // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // import Icon from 'react-native-vector-icons/Ionicons';

// // // Import all your screens
// // import HomeScreen from '../screens/HomeScreen';
// // import ProfileScreen from '../screens/ProfileScreen';
// // import SignUpScreen from '../screens/SignUpScreen';
// // import LoginScreen from '../screens/LoginScreen';
// // import MlmDashboardScreen from '../screens/MlmDashboardScreen';
// // import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';
// // import MyNetworkScreen from '../screens/MyNetworkScreen';

// // import CartScreen from '../screens/CartScreen';

// // import AddressListScreen from '../screens/AddressListScreen';
// // import AddEditAddressScreen from '../screens/AddEditAddressScreen';

// // import OrderSummaryScreen from '../screens/OrderSummaryScreen';
// // import OrderSuccessScreen from '../screens/OrderSuccessScreen';
// // import OrderHistoryScreen from '../screens/OrderHistoryScreen';
// // import OrderDetailsScreen from '../screens/OrderDetailsScreen';

// // import ProductDetailsScreen from '../screens/ProductDetailsScreen';

// // // A simple placeholder for unfinished tabs
// // const PlaceholderScreen = ({ route }) => (
// //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
// //     <Text>{route.name} Screen</Text>
// //   </View>
// // );

// // const Tab = createBottomTabNavigator();
// // const Stack = createNativeStackNavigator();

// // // This component defines your bottom tab bar. It's correct as is.
// // function MainTabs() {
// //   return (
// //     <Tab.Navigator
// //       screenOptions={({ route }) => ({
// //         headerShown: false,
// //         tabBarActiveTintColor: '#0CA201',
// //         tabBarInactiveTintColor: 'gray',
// //         tabBarStyle: { paddingBottom: 5, height: 60 },
// //         tabBarIcon: ({ focused, color, size }) => {
// //           let iconName;
// //           if (route.name === 'Home') {
// //             iconName = focused ? 'home' : 'home-outline';
// //           } else if (route.name === 'Favourite') {
// //             iconName = focused ? 'heart' : 'heart-outline';
// //           } else if (route.name === 'Search') {
// //             iconName = focused ? 'search' : 'search-outline';
// //           } else if (route.name === 'Profile') {
// //             iconName = focused ? 'person' : 'person-outline';
// //           }
// //           return <Icon name={iconName} size={size} color={color} />;
// //         },
// //       })}>
// //       <Tab.Screen name="Home" component={HomeScreen} />
// //       <Tab.Screen name="Favourite" component={PlaceholderScreen} />
// //       <Tab.Screen name="Search" component={PlaceholderScreen} />
// //       <Tab.Screen name="Profile" component={ProfileScreen} />
// //     </Tab.Navigator>
// //   );
// // }

// // // This is the main navigator for the entire app.
// // // It restores your logic of allowing non-logged-in users to browse.
// // const AppNavigator = () => {
// //   // No user check is performed here. All screens are part of one stack.
// //   // The logic to show/hide content is handled inside the ProfileScreen.

// //   return (
// //     <Stack.Navigator>
// //       {/* The first screen loaded is the Tab Navigator, making HomeScreen the default */}
// //       <Stack.Screen
// //         name="AppTabs"
// //         component={MainTabs}
// //         options={{ headerShown: false }}
// //       />

// //       <Stack.Screen
// //         name="Cart"
// //         component={CartScreen}
// //         options={{
// //           title: 'My Basket',
// //           // This makes the screen appear as a modal on iOS
// //           presentation: 'modal',
// //         }}
// //       />

// //       {/* All other screens are available to be navigated to from anywhere */}
// //       <Stack.Screen
// //         name="Login"
// //         component={LoginScreen}
// //         options={{ headerShown: false }}
// //       />
// //       <Stack.Screen
// //         name="SignUp"
// //         component={SignUpScreen}
// //         options={{ headerShown: false }}
// //       />
// //       <Stack.Screen
// //         name="MlmDashboard"
// //         component={MlmDashboardScreen}
// //         options={{ title: 'My Wallet & Network' }}
// //       />
// //       <Stack.Screen
// //         name="TransactionHistory"
// //         component={TransactionHistoryScreen}
// //       // The title for this screen will be set dynamically upon navigation
// //       />
// //       <Stack.Screen
// //         name="MyNetwork"
// //         component={MyNetworkScreen}
// //         options={{ title: 'My Network' }}
// //       />

// //       <Stack.Screen
// //         name="AddressList"
// //         component={AddressListScreen}
// //         options={{ title: 'Select Delivery Address' }}
// //       />

// //       {/* --- ADD THIS NEW SCREEN --- */}
// //       <Stack.Screen
// //         name="AddEditAddress"
// //         component={AddEditAddressScreen}
// //         // The title will be set dynamically inside the screen itself
// //         options={{ title: 'Manage Address' }}
// //       />

// //        {/* --- ADD THE NEW ORDER SCREENS TO THE STACK --- */}
// //         <Stack.Screen 
// //             name="OrderSummary" 
// //             component={OrderSummaryScreen} 
// //             options={{ title: 'Confirm Order' }} 
// //         />
// //         <Stack.Screen 
// //             name="OrderSuccess" 
// //             component={OrderSuccessScreen} 
// //             // Hide the header for the success screen for a full-screen effect
// //             options={{ headerShown: false }} 
// //         />

// //         <Stack.Screen 
// //             name="OrderHistory" 
// //             component={OrderHistoryScreen} 
// //             options={{ title: 'My Orders' }} 
// //         />

// //           <Stack.Screen 
// //             name="OrderDetails" 
// //             component={OrderDetailsScreen} 
// //             options={{ title: 'Order Details' }} 
// //         />


// //         <Stack.Screen 
// //           name="ProductDetails" 
// //           component={ProductDetailsScreen} 
// //           options={({ route }) => ({ 
// //               title: route.params.product.name, // Sets the header title dynamically
// //               headerBackTitle: 'Back'
// //           })} 
// //       />



// //     </Stack.Navigator>
// //   );
// // };

// // export default AppNavigator;










// import React from 'react';
// import { View, Text } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Icon from 'react-native-vector-icons/Ionicons';

// // Import all your screens
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
// // import SearchResultsScreen from '../screens/SearchResultsScreen';
// // import FilterScreen from '../screens/FilterScreen';

// // A simple placeholder for unfinished tabs
// const PlaceholderScreen = ({ route }) => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <Text>{route.name} Screen</Text>
//   </View>
// );

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// // --- THIS FUNCTION IS CORRECTED ---
// function MainTabs() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         // REMOVED `headerShown: false` from the global options
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
//       {/* Set headerShown individually for each screen */}
//       <Tab.Screen 
//         name="Home" 
//         component={HomeScreen} 
//         options={{ headerShown: true }} // <-- ALLOW header for Home
//       />
//       <Tab.Screen 
//         name="Favourite" 
//         component={PlaceholderScreen} 
//         options={{ headerShown: false }} // <-- HIDE header for others
//       />
//       <Tab.Screen 
//         name="Search" 
//         component={PlaceholderScreen} 
//         options={{ headerShown: false }} // <-- HIDE header for others
//       />


//       <Tab.Screen 
//         name="Search" 
//         component={SearchScreen} // Use the new SearchScreen here
//         options={{ 
//             headerShown: true, // Show the header for this screen
//             title: "Search"    // Set the header title
//         }}
//       />



//       <Tab.Screen 
//         name="Profile" 
//         component={ProfileScreen} 
//         options={{ headerShown: false }} // <-- HIDE header for others
//       />
//     </Tab.Navigator>
//   );
// }

// // This outer navigator does not need any changes.
// const AppNavigator = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="AppTabs"
//         component={MainTabs}
//         options={{ headerShown: false }}
//       />
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
//     </Stack.Navigator>
//   );
// };

// export default AppNavigator;





















import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

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

// --- IMPORT THE NEW SCREENS ---
import SearchScreen from '../screens/SearchScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import FilterScreen from '../screens/FilterScreen';

import CategoryProductsScreen from '../screens/CategoryProductsScreen'; 

// A simple placeholder for unfinished tabs
const PlaceholderScreen = ({ route }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{route.name} Screen</Text>
  </View>
);

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#0CA201',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { paddingBottom: 5, height: 60, borderTopWidth: 0, elevation: 0 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Favourite') iconName = focused ? 'heart' : 'heart-outline';
          else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: true }}
      />
      <Tab.Screen 
        name="Favourite" 
        component={PlaceholderScreen} 
        options={{ headerShown: false }}
      />
      
      {/* ==========================================================
          === THE FIX IS HERE: Only one screen named "Search"    ===
          ========================================================== */}
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} // Use the new SearchScreen here
        options={{ 
            headerShown: true,
            title: "Search"
        }}
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
      <Stack.Screen
        name="AppTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      {/* All your existing Stack Screens */}
      <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'My Basket', presentation: 'modal' }}/>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="MlmDashboard" component={MlmDashboardScreen} options={{ title: 'My Wallet & Network' }}/>
      <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen}/>
      <Stack.Screen name="MyNetwork" component={MyNetworkScreen} options={{ title: 'My Network' }}/>
      <Stack.Screen name="AddressList" component={AddressListScreen} options={{ title: 'Select Delivery Address' }}/>
      <Stack.Screen name="AddEditAddress" component={AddEditAddressScreen} options={{ title: 'Manage Address' }}/>
      <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} options={{ title: 'Confirm Order' }} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} options={{ headerShown: false }} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ title: 'My Orders' }} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} options={{ title: 'Order Details' }} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={({ route }) => ({ title: route.params.product.name, headerBackTitle: 'Back' })} />
      
      {/* --- ADD THE NEW SCREENS TO THE MAIN STACK NAVIGATOR --- */}
      <Stack.Screen 
        name="SearchResults" 
        component={SearchResultsScreen} 
        options={({ route }) => ({ title: `Results for "${route.params.query}"` })}
      />
      <Stack.Screen 
        name="Filter" 
        component={FilterScreen} 
        options={{ 
          title: 'Filter & Refine',
          presentation: 'modal',
        }}
      />

      <Stack.Screen 
        name="CategoryProducts" // This name MUST exactly match what you use in navigation.navigate()
        component={CategoryProductsScreen} 
        // The title will be set dynamically inside the screen itself
      />


    </Stack.Navigator>

    

  );
};

export default AppNavigator;