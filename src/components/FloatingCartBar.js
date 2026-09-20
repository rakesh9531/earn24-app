import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FloatingCartBar = ({ visible }) => {
  const navigation = useNavigation();
  const { cartItems, totalPhysicalItems } = useCart();
  const insets = useSafeAreaInsets();

  const isIos = Platform.OS === 'ios';
  const tabHeight = isIos 
    ? (insets.bottom > 0 ? 55 + insets.bottom : 65) 
    : (insets.bottom > 0 ? 60 + insets.bottom : 65);
  const bottomPosition = tabHeight + 10;

  const [internalVisible, setInternalVisible] = useState(false);
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const isFirstMount = React.useRef(true);
  const prevCount = React.useRef(totalPhysicalItems);

  // If visible prop is explicitly passed by parent, use it; otherwise use internal timer
  const isShown = visible !== undefined ? visible : internalVisible;

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevCount.current = totalPhysicalItems;
      return;
    }

    if (totalPhysicalItems > prevCount.current) {
      setInternalVisible(true);
      const timer = setTimeout(() => {
        setInternalVisible(false);
      }, 3500);
      prevCount.current = totalPhysicalItems;
      return () => clearTimeout(timer);
    }

    prevCount.current = totalPhysicalItems;
    if (totalPhysicalItems === 0) {
      setInternalVisible(false);
    }
  }, [totalPhysicalItems]);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isShown ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isShown]);

  const animatedContainerStyle = {
    opacity: animatedValue,
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
        }),
      },
    ],
  };

  // If cart is empty OR bar is hidden, return null so it disappears completely
  if (cartItems.length === 0 || !isShown) {
    return null;
  }
  
  // We now wrap the TouchableOpacity in an Animated.View
  return (
    <Animated.View style={[styles.container, animatedContainerStyle, { bottom: bottomPosition }]}>
        <TouchableOpacity 
            style={styles.touchableContent}
            onPress={() => navigation.navigate('Cart')}
        >
            <View style={styles.imageStack}>
                {cartItems.slice(0, 4).map((item, index) => (
                <Image
                    key={item.offer_id}
                    source={{ uri: `https://newapi.earn24.in${item.main_image_url}` }}
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