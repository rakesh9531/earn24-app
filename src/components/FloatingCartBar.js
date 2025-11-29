import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import Icon from 'react-native-vector-icons/Ionicons';

const FloatingCartBar = () => {
  const navigation = useNavigation();
  const { cartItems, totalPhysicalItems  } = useCart();

  // --- NEW STATE & ANIMATION LOGIC ---
  const [isVisible, setIsVisible] = useState(false);
  // Use Animated.Value for smooth animations
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    // This effect runs whenever the number of items in the cart changes.
    if (totalPhysicalItems  > 0) {
      // If items are in the cart, make the bar visible.
      setIsVisible(true);
      // Set a timer to automatically hide the bar after 4 seconds (4000 ms).
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 1000);

      // Clean up the timer if the component unmounts or if the cart changes again.
      return () => clearTimeout(timer);
    } else {
      // If the cart is empty, make sure the bar is hidden.
      setIsVisible(false);
    }
  }, [totalPhysicalItems ]); // The key dependency: this effect re-runs when totalPhysicalItems  changes.


  // This effect handles the smooth fade-in and slide-up animation.
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isVisible ? 1 : 0, // Animate to 1 (visible) or 0 (hidden)
      duration: 100, // Animation duration in milliseconds
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  }, [isVisible]); // This effect re-runs when `isVisible` changes.


  // Define the animated styles
  const animatedContainerStyle = {
    opacity: animatedValue, // Fade in/out
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0], // Slide up from bottom
        }),
      },
    ],
  };
  // --- END OF NEW LOGIC ---

  // If the cart is completely empty, don't render anything at all.
  if (cartItems.length === 0) {
    return null;
  }
  
  // We now wrap the TouchableOpacity in an Animated.View
  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
        <TouchableOpacity 
            style={styles.touchableContent}
            onPress={() => navigation.navigate('Cart')}
        >
            <View style={styles.imageStack}>
                {cartItems.slice(0, 4).map((item, index) => (
                <Image
                    key={item.offer_id}
                    source={{ uri: `http://192.168.0.171:3000${item.main_image_url}` }}
                    style={[styles.itemImage, { zIndex: 4 - index, marginLeft: index > 0 ? -15 : 0 }]}
                />
                ))}
            </View>
            <Text style={styles.text}>View Basket</Text>
            <View style={styles.basketContainer}>
                <Icon name="basket" size={24} color="#fff" />
                <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{totalPhysicalItems}</Text>
                </View>
            </View>
        </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 70, // Adjust this based on your tab bar height
    left: 20,
    right: 20,
    height: 60,
  },
  touchableContent: {
    flex: 1,
    backgroundColor: '#0CA201',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  imageStack: {
    flexDirection: 'row',
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#f0f0f0',
  },
  text: {
    flex: 1,
    marginLeft: 15,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  basketContainer: {
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: '#D32F2F',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default FloatingCartBar;