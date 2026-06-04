// import React from 'react';
// import { SafeAreaView, ActivityIndicator, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
// import { WebView } from 'react-native-webview';
// import Icon from 'react-native-vector-icons/Ionicons';

// const PaymentWebView = ({ route, navigation }) => {
//     const { checkoutUrl, successUrl, onOrderSuccess } = route.params;

//     const handleNavigationStateChange = (navState) => {
//         console.log("Current URL:", navState.url);

//         // If URL contains our success keyword (defined in backend surl)
//         if (navState.url.includes(successUrl) || navState.url.includes('payment-success')) {
//             onOrderSuccess();
//         } 
//         // If URL contains failure keywords
//         else if (navState.url.includes('payment-fail') || navState.url.includes('failure')) {
//             navigation.goBack();
//             alert("Payment Failed. Please try again.");
//         }
//     };

//     return (
//         <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
//             {/* Header with Back Button */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     <Icon name="arrow-back" size={24} color="#000" />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Secure Payment</Text>
//             </View>

//             <WebView
//                 source={{ uri: checkoutUrl }}
//                 onNavigationStateChange={handleNavigationStateChange}
//                 javaScriptEnabled={true}
//                 domStorageEnabled={true}
//                 startInLoadingState={true}
//                 renderLoading={() => <ActivityIndicator size="large" color="#0CA201" style={styles.loader} />}
//             />
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     header: { height: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
//     headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
//     loader: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -20 }, { translateY: -20 }] }
// });

// export default PaymentWebView;












// import React, { useState } from 'react';
// import { SafeAreaView, ActivityIndicator, View, StyleSheet, Alert } from 'react-native';
// import { WebView } from 'react-native-webview';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { useCart } from '../context/CartContext'; // Need context to clear cart on success

// const PaymentWebView = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { clearCart } = useCart();
  
//   // 1. Get Params passed from OrderSummaryScreen
//   // htmlContent: The auto-submitting form
//   // orderData: Order details for the success screen
//   // successTarget: Screen name to navigate to on success
//   const { htmlContent, orderData, successTarget } = route.params;

//   const handleNavigationStateChange = async (navState) => {
//     const { url } = navState;

//     // --- SUCCESS CHECK ---
//     // Make sure your backend redirects to a URL containing "verify-payment" or "payment-success"
//     if (url.includes('verify-payment') || url.includes('payment-success')) {
        
//         // 1. Clear the Cart locally
//         await clearCart();

//         // 2. Navigate to Success Screen
//         // We use 'reset' so the user can't go back to the payment page via back button
//         navigation.reset({
//           index: 1,
//           routes: [
//             { name: 'AppTabs' }, // Go to Home/Tabs
//             { name: successTarget || 'OrderSuccess', params: { order: orderData } }, // Show Success
//           ],
//         });
//         return;
//     }

//     // --- FAILURE CHECK ---
//     // Check if backend redirects to a failure URL or PayU returns a failure status
//     if (url.includes('payment-failure') || url.includes('status=failed') || url.includes('status=failure')) {
//         Alert.alert("Payment Failed", "The transaction could not be completed.");
//         navigation.goBack(); // Go back to Order Summary to retry
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <WebView
//         originWhitelist={['*']}
//         source={{ html: htmlContent }} // Load the PayU Form
//         onNavigationStateChange={handleNavigationStateChange}
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//         startInLoadingState={true}
//         renderLoading={() => (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#0CA201" />
//             <Text style={{marginTop: 10, color: '#666'}}>Processing Payment...</Text>
//           </View>
//         )}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff'
//   },
//   loadingContainer: {
//     position: 'absolute',
//     top: 0, left: 0, right: 0, bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     zIndex: 10
//   }
// });

// export default PaymentWebView;








// import React from 'react';
// import { SafeAreaView, ActivityIndicator, View, StyleSheet, Alert } from 'react-native';
// import { WebView } from 'react-native-webview';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { useCart } from '../context/CartContext';

// const PaymentWebView = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { clearCart } = useCart();
  
//   // Safe destructuring with default values to prevent undefined errors
//   const params = route.params || {};
//   const { htmlContent, orderData, successTarget } = params;

//   // Debug check
//   if (!htmlContent && !params.url) {
//     console.error("PaymentWebView Error: No HTML content or URL provided.");
//     Alert.alert("Error", "Payment configuration missing.");
//     navigation.goBack();
//     return null;
//   }

//   const handleNavigationStateChange = async (navState) => {
//     const { url } = navState;
//     if (!url) return;

//     // --- SUCCESS CHECK ---
//     if (url.includes('verify-payment') || url.includes('payment-success')) {
//         await clearCart();
//         navigation.reset({
//           index: 1,
//           routes: [
//             { name: 'AppTabs' }, 
//             { name: successTarget || 'OrderSuccess', params: { order: orderData } }, 
//           ],
//         });
//     }

//     // --- FAILURE CHECK ---
//     if (url.includes('payment-failure') || url.includes('status=failed') || url.includes('status=failure')) {
//         Alert.alert("Payment Failed", "The transaction could not be completed.");
//         navigation.goBack(); 
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <WebView
//         originWhitelist={['*']}
//         source={{ html: htmlContent }} 
//         onNavigationStateChange={handleNavigationStateChange}
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//         startInLoadingState={true}
//         // Important: flex: 1 ensures the WebView takes up height
//         style={{ flex: 1 }} 
//         renderLoading={() => (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#0CA201" />
//             <Text style={{marginTop: 10, color: '#666'}}>Processing Payment...</Text>
//           </View>
//         )}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1, // Crucial for WebView visibility
//     backgroundColor: '#fff'
//   },
//   loadingContainer: {
//     position: 'absolute',
//     top: 0, left: 0, right: 0, bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     zIndex: 10
//   }
// });

// export default PaymentWebView;



import React from 'react';
import { 
  SafeAreaView, 
  ActivityIndicator, 
  View, 
  StyleSheet, 
  Alert, 
  Text // <--- 1. ADD THIS IMPORT
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '../context/CartContext';

const PaymentWebView = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { clearCart, removeOrderedItems } = useCart();
  
  const params = route.params || {};
  const { htmlContent, orderData, successTarget, cartItemIds } = params;

  if (!htmlContent && !params.url) {
    console.error("PaymentWebView Error: No HTML content or URL provided.");
    Alert.alert("Error", "Payment configuration missing.");
    navigation.goBack();
    return null;
  }

  const handleNavigationStateChange = async (navState) => {
    const { url } = navState;
    if (!url) return;

    // --- SUCCESS CHECK ---
    if (url.includes('verify-payment') || url.includes('payment-success')) {
        if (cartItemIds && cartItemIds.length > 0) {
            removeOrderedItems(cartItemIds);
        } else {
            await clearCart(); // Fallback if no specific IDs provided
        }
        navigation.reset({
          index: 1,
          routes: [
            { name: 'AppTabs' }, 
            { name: successTarget || 'OrderSuccess', params: { order: orderData } }, 
          ],
        });
    }

    // --- FAILURE CHECK ---
    if (url.includes('payment-failure') || url.includes('status=failed') || url.includes('status=failure')) {
        Alert.alert("Payment Failed", "The transaction could not be completed.");
        navigation.goBack(); 
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }} 
        onNavigationStateChange={handleNavigationStateChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        style={{ flex: 1 }} 
        // 2. Now this Text component will work correctly
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0CA201" />
            <Text style={{marginTop: 10, color: '#666'}}>Processing Payment...</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#fff'
  },
  loadingContainer: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 10
  }
});

export default PaymentWebView;