// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useCart } from '../context/CartContext'; // Import the global cart hook

// const CartIcon = () => {
//   const navigation = useNavigation();
//   const { totalItemsInCart } = useCart(); // Get the total item count from the context

//   return (
//     <TouchableOpacity 
//         style={styles.container} 
//         onPress={() => navigation.navigate('Cart')} // You'll need a 'Cart' screen in your navigator
//     >
//       <Icon name="basket-outline" size={28} color="#333" />
//       {/* Only show the badge if there are items in the cart */}
//       {totalItemsInCart > 0 && (
//         <View style={styles.badgeContainer}>
//           <Text style={styles.badgeText}>{totalItemsInCart}</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 5,
//   },
//   badgeContainer: {
//     position: 'absolute',
//     top: -2,
//     right: -4,
//     backgroundColor: '#D32F2F', // Red for the badge
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#fff',
//   },
//   badgeText: {
//     color: '#fff',
//     fontSize: 11,
//     fontWeight: 'bold',
//   },
// });

// export default CartIcon;




import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useCart } from '../context/CartContext'; // Import the global cart hook

const CartIcon = () => {
  const navigation = useNavigation();

  // ==========================================================
  // === THE FIX IS HERE: Use 'totalPhysicalItems' instead   ====
  // ==========================================================
  const { totalPhysicalItems } = useCart();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('Cart')}
    >
      <Icon name="basket-outline" size={28} color="#1F2937" />

      {/* This logic now correctly checks against totalPhysicalItems */}
      {totalPhysicalItems > 0 && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{totalPhysicalItems}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#EF4444',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    zIndex: 10,
    elevation: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    includeFontPadding: false,
    lineHeight: 12,
  },
});

export default CartIcon;