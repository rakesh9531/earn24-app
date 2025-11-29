// // import React, { createContext, useState, useContext, useEffect } from 'react';
// // import { useAuth } from './AuthContext'; // Assuming you have an AuthContext to know if user is logged in
// // import { cartService } from '../services/cartService'; // We will create this new service

// // // 1. Create the Context
// // export const CartContext = createContext();

// // // 2. Create the Provider Component
// // export const CartProvider = ({ children }) => {
// //   const { user } = useAuth(); // Get the current user status
// //   const [cartItems, setCartItems] = useState([]);
// //   const [isLoading, setIsLoading] = useState(true);

// //   // Function to fetch the cart from the backend
// //   const fetchCart = async () => {
// //     if (!user) { // Don't fetch if there's no user
// //       setCartItems([]);
// //       setIsLoading(false);
// //       return;
// //     }
// //     try {
// //       setIsLoading(true);
// //       const response = await cartService.getCart();
// //       if (response.status && Array.isArray(response.data)) {
// //         setCartItems(response.data);
// //       }
// //     } catch (error) {
// //       console.error("Failed to fetch cart:", error);
// //       // Don't show an alert here, let screens handle errors if needed
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   // Fetch the cart when the user logs in or the app starts
// //   useEffect(() => {
// //     fetchCart();
// //   }, [user]);

// //   // --- CART MANAGEMENT FUNCTIONS (Now they call the API) ---

// //   const addToCart = async (product, quantity) => {
// //     try {
// //       // Call the API to add the item
// //       await cartService.addItem({
// //         sellerProductId: product.offer_id, // Use the offer_id
// //         quantity: quantity
// //       });
// //       // After success, refresh the cart from the server to get the latest state
// //       await fetchCart();
// //     } catch (error) {
// //       console.error("Failed to add to cart:", error);
// //     }
// //   };
  
// //   const updateQuantity = async (cartItemId, newQuantity) => {
// //       // Optimistically update the UI for a snappy feel
// //       setCartItems(prevItems => 
// //           prevItems.map(item => 
// //               item.cart_item_id === cartItemId ? { ...item, quantity: newQuantity } : item
// //           )
// //       );
// //       try {
// //         await cartService.updateItem(cartItemId, newQuantity);
// //         // Silently refresh the cart in the background to ensure consistency
// //         await fetchCart();
// //       } catch (error) {
// //           console.error("Failed to update quantity:", error);
// //           // If the update fails, refresh the cart to revert the optimistic update
// //           await fetchCart(); 
// //       }
// //   };

// //   const removeFromCart = async (cartItemId) => {
// //     try {
// //       // Optimistically remove from UI
// //       setCartItems(prevItems => prevItems.filter(item => item.cart_item_id !== cartItemId));
// //       await cartService.removeItem(cartItemId);
// //     } catch (error) {
// //       console.error("Failed to remove from cart:", error);
// //       await fetchCart(); // Revert on failure
// //     }
// //   };

// //   const clearCart = async () => {
// //     try {
// //         setCartItems([]); // Optimistic update
// //         await cartService.clearCart();
// //     } catch (error) {
// //         console.error("Failed to clear cart:", error);
// //         await fetchCart(); // Revert on failure
// //     }
// //   };

// //   // --- CALCULATED VALUES ---
// //   const totalItemsInCart = cartItems.reduce((sum, item) => sum + item.quantity, 0);
// //   const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.selling_price) * item.quantity), 0);

// //   const value = {
// //     cartItems,
// //     isLoading,
// //     fetchCart,
// //     addToCart,
// //     updateQuantity,
// //     removeFromCart,
// //     clearCart,
// //     totalItemsInCart,
// //     subtotal,
// //   };

// //   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// // };

// // // 3. Custom hook for easy access
// // export const useCart = () => {
// //     return useContext(CartContext);
// // };








// import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
// import { useAuth } from './AuthContext'; // Make sure this path is correct
// import { cartService } from '../services/cartService'; // Make sure this path is correct
// import { usePincode } from './PincodeContext'; 


// // 1. Create the Context
// export const CartContext = createContext();

// // 2. Create the Provider Component
// export const CartProvider = ({ children }) => {
//   const { user } = useAuth(); // Get the current user status
//   const [cartItems, setCartItems] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Function to fetch the cart from the backend
//   const fetchCart = async () => {
//     if (!user || !pincode) { // Don't fetch if there's no user logged in
//       setCartItems([]);
//       setIsLoading(false);
//       return;
//     }
//     try {
//       // No need to set loading true here if it's a background refresh
//       const response = await cartService.getCart(pincode);
//       if (response.status && Array.isArray(response.data)) {
//         setCartItems(response.data);
//       }
//     } catch (error) {
//       console.error("Failed to fetch cart:", error);
//     } finally {
//       // Only set loading to false on the initial load
//       if (isLoading) {
//         setIsLoading(false);
//       }
//     }
//   };

//   // Fetch the cart when the user's status changes (e.g., on login)
//   useEffect(() => {
//     setIsLoading(true);
//     fetchCart();
//   }, [user]);

//   // --- CART MANAGEMENT FUNCTIONS (These call the API) ---

//   const addToCart = async (product, quantity) => {
//     if (!user) {
//         // Handle guest user case, maybe navigate to login
//         alert('Please log in to add items to your cart.');
//         return;
//     }
//     try {
//       await cartService.addItem({
//         sellerProductId: product.offer_id,
//         quantity: quantity
//       });
//       // After success, refresh the cart from the server to get the latest state
//       await fetchCart();
//     } catch (error) {
//       console.error("Failed to add to cart:", error);
//       alert('Could not add item to cart.'); // Inform the user
//     }
//   };
  
//   const updateQuantity = async (cartItemId, newQuantity) => {
//       const originalItems = [...cartItems];
//       // Optimistically update the UI for a snappy feel
//       setCartItems(prevItems => 
//           prevItems.map(item => 
//               item.cart_item_id === cartItemId ? { ...item, quantity: newQuantity } : item
//           )
//       );
//       try {
//         await cartService.updateItem(cartItemId, newQuantity);
//         // Silently refresh in the background to ensure data consistency
//         await fetchCart();
//       } catch (error) {
//           console.error("Failed to update quantity:", error);
//           setCartItems(originalItems); // Revert UI on failure
//       }
//   };

//   const removeFromCart = async (cartItemId) => {
//     const originalItems = [...cartItems];
//     try {
//       setCartItems(prevItems => prevItems.filter(item => item.cart_item_id !== cartItemId));
//       await cartService.removeItem(cartItemId);
//     } catch (error) {
//       console.error("Failed to remove from cart:", error);
//       setCartItems(originalItems); // Revert UI on failure
//     }
//   };

//   const clearCart = async () => {
//     const originalItems = [...cartItems];
//     try {
//         setCartItems([]);
//         await cartService.clearCart();
//     } catch (error) {
//         console.error("Failed to clear cart:", error);
//         setCartItems(originalItems); // Revert UI on failure
//     }
//   };

//   // --- CALCULATED VALUES (using useMemo for performance) ---
//   const { totalItemsInCart, subtotal, totalBvInCart } = useMemo(() => {
//     let totalItems = 0;
//     let currentSubtotal = 0;
//     let totalBv = 0;

//     for (const item of cartItems) {
//       totalItems += item.quantity;
//       currentSubtotal += parseFloat(item.selling_price) * item.quantity;
//       totalBv += parseFloat(item.bv_earned || 0) * item.quantity;
//     }
//     return { totalItemsInCart: totalItems, subtotal: currentSubtotal, totalBvInCart: totalBv };
//   }, [cartItems]);

//   const value = {
//     cartItems,
//     isLoading,
//     fetchCart,
//     addToCart,
//     updateQuantity,
//     removeFromCart,
//     clearCart,
//     totalItemsInCart,
//     subtotal,
//     totalBvInCart, // Export the new total BV value
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };

// // 3. Custom hook for easy access
// export const useCart = () => {
//     return useContext(CartContext);
// };





// import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
// import { useFocusEffect } from '@react-navigation/native';
// import { useAuth } from './AuthContext';
// import { usePincode } from './PincodeContext';
// import { cartService } from '../services/cartService';

// // 1. Create the Context
// export const CartContext = createContext();

// // 2. Create the Provider Component
// export const CartProvider = ({ children }) => {
//   const { user } = useAuth();
//   const { pincode } = usePincode();
//   const [cartItems, setCartItems] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchCart = useCallback(async () => {
//     if (!user || !pincode) {
//       setCartItems([]);
//       setIsLoading(false);
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await cartService.getCart(pincode); 
//       if (response.status && Array.isArray(response.data)) {
//         setCartItems(response.data);
//       } else {
//         setCartItems([]);
//       }
//     } catch (error) {
//       console.error("Failed to fetch cart:", error.response?.data?.message || error.message);
//       setCartItems([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [user, pincode]);

//   useFocusEffect(
//     useCallback(() => {
//       fetchCart();
//     }, [fetchCart])
//   );

//   const addToCart = async (product, quantity) => {
//     if (!user) {
//         alert('Please log in to add items to your cart.');
//         return false;
//     }
//     try {
//       await cartService.addItem({
//         sellerProductId: product.offer_id,
//         quantity: quantity
//       });
//       await fetchCart();
//       return true;
//     } catch (error) {
//       console.error("Failed to add to cart:", error);
//       alert('Could not add item to cart.');
//       return false;
//     }
//   };
  
//   const updateQuantity = async (cartItemId, newQuantity) => {
//       const originalItems = [...cartItems];
//       setCartItems(prevItems => 
//           prevItems.map(item => 
//               item.cart_item_id === cartItemId ? { ...item, quantity: newQuantity } : item
//           )
//       );
//       try {
//         await cartService.updateItem(cartItemId, newQuantity);
//         await fetchCart();
//       } catch (error) {
//           console.error("Failed to update quantity:", error);
//           setCartItems(originalItems);
//       }
//   };

//   const removeFromCart = async (cartItemId) => {
//     const originalItems = [...cartItems];
//     try {
//       setCartItems(prevItems => prevItems.filter(item => item.cart_item_id !== cartItemId));
//       await cartService.removeItem(cartItemId);
//     } catch (error) {
//       console.error("Failed to remove from cart:", error);
//       setCartItems(originalItems);
//     }
//   };

//   const clearCart = async () => {
//     const originalItems = [...cartItems];
//     try {
//         setCartItems([]);
//         await cartService.clearCart();
//     } catch (error) {
//         console.error("Failed to clear cart:", error);
//         setCartItems(originalItems);
//     }
//   };

//   // --- CALCULATED VALUES (with the new total physical item count) ---
//   const { totalPhysicalItems, subtotal, totalBvInCart } = useMemo(() => {
    
//     // --- THIS IS THE FIX ---
//     // 1. Calculate the total physical items first, regardless of availability.
//     const physicalTotal = cartItems.reduce((sum, item) => sum + item.quantity, 0);

//     // 2. Then, filter for available items for financial calculations.
//     const availableItems = cartItems.filter(item => item.is_available);

//     // 3. Calculate subtotal and BV only on available items.
//     let currentSubtotal = 0;
//     let totalBv = 0;
//     for (const item of availableItems) {
//       currentSubtotal += parseFloat(item.selling_price) * item.quantity;
//       totalBv += parseFloat(item.bv_earned || 0) * item.quantity;
//     }
    
//     // 4. Return all three values.
//     return { 
//       totalPhysicalItems: physicalTotal, 
//       subtotal: currentSubtotal, 
//       totalBvInCart: totalBv 
//     };
//   }, [cartItems]);

//   // --- EXPORT THE NEW VALUE ---
//   const value = {
//     cartItems,
//     isLoading,
//     fetchCart,
//     addToCart,
//     updateQuantity,
//     removeFromCart,
//     clearCart,
//     totalPhysicalItems, // <-- Use this for the home screen badge
//     subtotal,
//     totalBvInCart,
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };

// // 3. Custom hook for easy access
// export const useCart = () => {
//     return useContext(CartContext);
// };







// import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
// import { useFocusEffect } from '@react-navigation/native';
// import { useAuth } from './AuthContext';
// import { usePincode } from './PincodeContext';
// import { cartService } from '../services/cartService';

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const { user } = useAuth();
//   const { pincode } = usePincode();
//   const [cartItems, setCartItems] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // --- NEW: State to track which items are selected for checkout ---
//   const [selectedItemIds, setSelectedItemIds] = useState({});

//   const fetchCart = useCallback(async () => {
//     if (!user || !pincode) {
//       setCartItems([]);
//       setSelectedItemIds({}); // Clear selections
//       setIsLoading(false);
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await cartService.getCart(pincode);
//       if (response.status && Array.isArray(response.data)) {
//         const items = response.data;
//         setCartItems(items);
        
//         // --- NEW: By default, select all items that ARE available ---
//         const initialSelection = {};
//         items.forEach(item => {
//           if (item.is_available) {
//             initialSelection[item.cart_item_id] = true;
//           }
//         });
//         setSelectedItemIds(initialSelection);

//       } else {
//         setCartItems([]);
//         setSelectedItemIds({});
//       }
//     } catch (error) {
//       console.error("Failed to fetch cart:", error.response?.data?.message || error.message);
//       setCartItems([]);
//       setSelectedItemIds({});
//     } finally {
//       setIsLoading(false);
//     }
//   }, [user, pincode]);

//   useFocusEffect(
//     useCallback(() => {
//       fetchCart();
//     }, [fetchCart])
//   );

//   // --- NEW: Function to toggle an item's selected state ---
//   const toggleItemSelected = (cartItemId) => {
//     setSelectedItemIds(prev => ({
//       ...prev,
//       [cartItemId]: !prev[cartItemId]
//     }));
//   };
  
//   const addToCart = async (product, quantity) => {
//     if (!user) {
//         alert('Please log in to add items to your cart.');
//         return false;
//     }
//     try {
//       await cartService.addItem({
//         sellerProductId: product.offer_id,
//         quantity: quantity
//       });
//       await fetchCart();
//       return true;
//     } catch (error) {
//       console.error("Failed to add to cart:", error);
//       alert('Could not add item to cart.');
//       return false;
//     }
//   };
  
//   const updateQuantity = async (cartItemId, newQuantity) => {
//       const originalItems = [...cartItems];
//       setCartItems(prevItems => 
//           prevItems.map(item => 
//               item.cart_item_id === cartItemId ? { ...item, quantity: newQuantity } : item
//           )
//       );
//       try {
//         await cartService.updateItem(cartItemId, newQuantity);
//         await fetchCart();
//       } catch (error) {
//           console.error("Failed to update quantity:", error);
//           setCartItems(originalItems);
//       }
//   };

//   const removeFromCart = async (cartItemId) => {
//     const originalItems = [...cartItems];
//     try {
//       setCartItems(prevItems => prevItems.filter(item => item.cart_item_id !== cartItemId));
//       await cartService.removeItem(cartItemId);
//     } catch (error) {
//       console.error("Failed to remove from cart:", error);
//       setCartItems(originalItems);
//     }
//   };

//   const clearCart = async () => {
//     const originalItems = [...cartItems];
//     try {
//         setCartItems([]);
//         await cartService.clearCart();
//     } catch (error) {
//         console.error("Failed to clear cart:", error);
//         setCartItems(originalItems);
//     }
//   };

//   // --- CALCULATIONS: Now depend on the selected state ---
//   const { totalPhysicalItems, subtotal, totalBvInCart, selectedItemsForCheckout } = useMemo(() => {
//     const physicalTotal = cartItems.reduce((sum, item) => sum + item.quantity, 0);

//     // Filter for items that are BOTH available AND selected by the user
//     const itemsForCheckout = cartItems.filter(
//       item => item.is_available && selectedItemIds[item.cart_item_id]
//     );

//     let currentSubtotal = 0;
//     let totalBv = 0;
//     for (const item of itemsForCheckout) {
//       currentSubtotal += parseFloat(item.selling_price) * item.quantity;
//       totalBv += parseFloat(item.bv_earned || 0) * item.quantity;
//     }
    
//     return { 
//       totalPhysicalItems: physicalTotal, 
//       subtotal: currentSubtotal, 
//       totalBvInCart: totalBv,
//       selectedItemsForCheckout: itemsForCheckout
//     };
//   }, [cartItems, selectedItemIds]);

//   const value = {
//     cartItems,
//     isLoading,
//     fetchCart,
//     addToCart,
//     updateQuantity,
//     removeFromCart,
//     clearCart,
//     totalPhysicalItems,
//     subtotal,
//     totalBvInCart,
//     // --- EXPORT NEW STATE AND FUNCTION ---
//     selectedItemIds,
//     toggleItemSelected,
//     selectedItemsForCheckout
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };

// export const useCart = () => {
//   return useContext(CartContext);
// };
















// import React, { createContext, useState, useContext, useMemo, useCallback, useEffect } from 'react';
// import { useFocusEffect } from '@react-navigation/native';
// import { useAuth } from './AuthContext';
// import { usePincode } from './PincodeContext';
// import { cartService } from '../services/cartService';
// import { settingsService } from '../services/settingsService'; // Your existing service

// export const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const { user } = useAuth();
//   const { pincode } = usePincode();
//   const [cartItems, setCartItems] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedItemIds, setSelectedItemIds] = useState({});
  
//   // --- CORRECTED: Use a single, clear state variable for settings ---
//   const [deliverySettings, setDeliverySettings] = useState(null);

//   useEffect(() => {
//     const fetchRules = async () => {
//       try {
//         // Call the new, dedicated service function
//         const response = await settingsService.getDeliveryRules(); // <-- USING THE CORRECT FUNCTION
        
//         if (response.status) {
//           setDeliverySettings(response.data);
//           console.log("CartContext: Delivery settings loaded successfully.", response.data);
//         }
//       } catch (e) {
//         console.error("CartContext: Could not fetch delivery settings.", e.message);
//       }
//     };
//     fetchRules();
// }, []);

//   const fetchCart = useCallback(async () => {
//     if (!user || !pincode) {
//       setCartItems([]);
//       setSelectedItemIds({});
//       setIsLoading(false);
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await cartService.getCart(pincode); 
//       if (response.status && Array.isArray(response.data)) {
//         const items = response.data;
//         setCartItems(items);
//         const initialSelection = {};
//         items.forEach(item => {
//           if (item.is_available) {
//             initialSelection[item.cart_item_id] = true;
//           }
//         });
//         setSelectedItemIds(initialSelection);
//       } else {
//         setCartItems([]);
//         setSelectedItemIds({});
//       }
//     } catch (error) {
//       console.error("Failed to fetch cart:", error.response?.data?.message || error.message);
//       setCartItems([]);
//       setSelectedItemIds({});
//     } finally {
//       setIsLoading(false);
//     }
//   }, [user, pincode]);

//   useFocusEffect(
//     useCallback(() => {
//       fetchCart();
//     }, [fetchCart])
//   );

//   const toggleItemSelected = (cartItemId) => {
//     setSelectedItemIds(prev => ({
//       ...prev,
//       [cartItemId]: !prev[cartItemId]
//     }));
//   };
  
//   const addToCart = async (product, quantity) => {
//     if (!user) {
//         alert('Please log in to add items to your cart.');
//         return false;
//     }
//     try {
//       await cartService.addItem({
//         sellerProductId: product.offer_id,
//         quantity: quantity
//       });
//       await fetchCart();
//       return true;
//     } catch (error) {
//       console.error("Failed to add to cart:", error);
//       alert('Could not add item to cart.');
//       return false;
//     }
//   };
  
//   const updateQuantity = async (cartItemId, newQuantity) => {
//       const originalItems = [...cartItems];
//       setCartItems(prevItems => 
//           prevItems.map(item => 
//               item.cart_item_id === cartItemId ? { ...item, quantity: newQuantity } : item
//           )
//       );
//       try {
//         await cartService.updateItem(cartItemId, newQuantity);
//         await fetchCart();
//       } catch (error) {
//           console.error("Failed to update quantity:", error);
//           setCartItems(originalItems);
//       }
//   };

//   const removeFromCart = async (cartItemId) => {
//     const originalItems = [...cartItems];
//     try {
//       setCartItems(prevItems => prevItems.filter(item => item.cart_item_id !== cartItemId));
//       await cartService.removeItem(cartItemId);
//     } catch (error) {
//       console.error("Failed to remove from cart:", error);
//       setCartItems(originalItems);
//     }
//   };

//   const clearCart = async () => {
//     const originalItems = [...cartItems];
//     try {
//         setCartItems([]);
//         setSelectedItemIds({});
//         await cartService.clearCart();
//     } catch (error) {
//         console.error("Failed to clear cart:", error);
//         setCartItems(originalItems);
//     }
//   };

//   const { totalPhysicalItems, subtotal, totalBvInCart, selectedItemsForCheckout } = useMemo(() => {
//     const physicalTotal = cartItems.reduce((sum, item) => sum + item.quantity, 0);
//     const itemsForCheckout = cartItems.filter(item => item.is_available && selectedItemIds[item.cart_item_id]);
    
//     let currentSubtotal = 0;
//     let totalBv = 0;
//     for (const item of itemsForCheckout) {
//       currentSubtotal += parseFloat(item.selling_price) * item.quantity;
//       totalBv += parseFloat(item.bv_earned || 0) * item.quantity;
//     }
    
//     return { 
//       totalPhysicalItems: physicalTotal, 
//       subtotal: currentSubtotal, 
//       totalBvInCart: totalBv,
//       selectedItemsForCheckout: itemsForCheckout
//     };
//   }, [cartItems, selectedItemIds]);

//   const deliveryFee = useMemo(() => {
//     if (subtotal === 0 || !deliverySettings) {
//       return 0;
//     }
//     return (totalBvInCart >= deliverySettings.threshold) 
//       ? deliverySettings.special 
//       : deliverySettings.standard;
//   }, [totalBvInCart, subtotal, deliverySettings]);

//   const totalAmount = subtotal + deliveryFee;

//   const deliveryIncentive = useMemo(() => {
//     if (!deliverySettings || deliverySettings.special !== 0 || subtotal === 0) {
//       return null;
//     }
//     const bvNeeded = deliverySettings.threshold - totalBvInCart;
//     if (bvNeeded <= 0) {
//       return null;
//     }
//     const progress = (totalBvInCart / deliverySettings.threshold) * 100;
//     return {
//       bvNeeded,
//       threshold: deliverySettings.threshold,
//       progress: Math.min(progress, 100),
//     };
//   }, [totalBvInCart, subtotal, deliverySettings]);

//   const value = {
//     cartItems,
//     isLoading,
//     totalPhysicalItems,
//     subtotal,
//     totalBvInCart,
//     deliveryFee,
//     totalAmount,
//     deliveryIncentive,
//     selectedItemIds,
//     toggleItemSelected,
//     selectedItemsForCheckout,
//     fetchCart,
//     addToCart,
//     updateQuantity,
//     removeFromCart,
//     clearCart,
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };

// export const useCart = () => {
//   return useContext(CartContext);
// };












import React, { createContext, useState, useContext, useMemo, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from './AuthContext';
import { usePincode } from './PincodeContext';
import { cartService } from '../services/cartService';
import { settingsService } from '../services/settingsService';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const { pincode } = usePincode();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItemIds, setSelectedItemIds] = useState({});
  const [deliverySettings, setDeliverySettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      if (user) { // Only fetch settings if a user is logged in
        try {
          const response = await settingsService.getDeliveryRules();
          if (response.status) {
            setDeliverySettings(response.data);
            console.log("CartContext: Delivery settings loaded successfully.");
          }
        } catch (e) {
          console.error("CartContext: Could not fetch delivery settings.", e.message);
        }
      }
    };
    fetchSettings();
  }, [user]);

  // --- REFACTORED LOGIC FOR BUG FIX ---

  // This is a "safe" refresh that only updates item data (like quantity or availability)
  // but does NOT touch the user's selections.
  const refreshCartData = useCallback(async () => {
    if (!user || !pincode) return;
    try {
      const response = await cartService.getCart(pincode);
      if (response.status && Array.isArray(response.data)) {
        setCartItems(response.data);
      }
    } catch (error) {
      console.error("Failed to refresh cart data:", error.response?.data?.message || error.message);
    }
  }, [user, pincode]);

  // This effect handles the INITIAL load and RESETS selections when user/pincode changes.
  useFocusEffect(
    useCallback(() => {
      const initialLoadCart = async () => {
        if (!user || !pincode) {
          setCartItems([]);
          setSelectedItemIds({});
          setIsLoading(false);
          return;
        }
        setIsLoading(true);
        try {
          const response = await cartService.getCart(pincode);
          if (response.status && Array.isArray(response.data)) {
            const items = response.data;
            setCartItems(items);
            // Set default selections ONLY on this initial load.
            const initialSelection = {};
            items.forEach(item => {
              if (item.is_available) {
                initialSelection[item.cart_item_id] = true;
              }
            });
            setSelectedItemIds(initialSelection);
          } else {
            setCartItems([]);
            setSelectedItemIds({});
          }
        } catch (error) {
          console.error("Failed to perform initial cart load:", error.response?.data?.message || error.message);
          setCartItems([]);
          setSelectedItemIds({});
        } finally {
          setIsLoading(false);
        }
      };
      initialLoadCart();
    }, [user, pincode])
  );
  
  // SAFETY NET: Automatically deselects any item if it becomes unavailable.
  useEffect(() => {
      const newSelections = {...selectedItemIds};
      let selectionWasChanged = false;
      cartItems.forEach(item => {
          if(!item.is_available && newSelections[item.cart_item_id]) {
              newSelections[item.cart_item_id] = false;
              selectionWasChanged = true;
          }
      });
      if(selectionWasChanged) {
          setSelectedItemIds(newSelections);
      }
  }, [cartItems]);

  const toggleItemSelected = (cartItemId) => {
    setSelectedItemIds(prev => ({
      ...prev,
      [cartItemId]: !prev[cartItemId]
    }));
  };
  
  const addToCart = async (product, quantity) => {
    if (!user) {
        alert('Please log in to add items to your cart.');
        return false;
    }
    try {
      await cartService.addItem({ sellerProductId: product.offer_id, quantity: quantity });
      await refreshCartData(); // Use the safe refresh function
      return true;
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert('Could not add item to cart.');
      return false;
    }
  };
  
  const updateQuantity = async (cartItemId, newQuantity) => {
      const originalItems = [...cartItems];
      setCartItems(prevItems => prevItems.map(item => item.cart_item_id === cartItemId ? { ...item, quantity: newQuantity } : item ));
      try {
        await cartService.updateItem(cartItemId, newQuantity);
        await refreshCartData(); // Use the safe refresh function
      } catch (error) {
          console.error("Failed to update quantity:", error);
          setCartItems(originalItems);
      }
  };

  const removeFromCart = async (cartItemId) => {
    const originalItems = [...cartItems];
    try {
      setCartItems(prevItems => prevItems.filter(item => item.cart_item_id !== cartItemId));
      await cartService.removeItem(cartItemId);
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      setCartItems(originalItems);
    }
  };

  const clearCart = async () => {
    const originalItems = [...cartItems];
    try {
        setCartItems([]);
        setSelectedItemIds({});
        await cartService.clearCart();
    } catch (error) {
        console.error("Failed to clear cart:", error);
        setCartItems(originalItems);
    }
  };

  // --- All `useMemo` calculation blocks are correct and need no changes ---
  const { totalPhysicalItems, subtotal, totalBvInCart, selectedItemsForCheckout } = useMemo(() => {
    const physicalTotal = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const itemsForCheckout = cartItems.filter(item => item.is_available && selectedItemIds[item.cart_item_id]);
    
    let currentSubtotal = 0;
    let totalBv = 0;
    for (const item of itemsForCheckout) {
      currentSubtotal += parseFloat(item.selling_price) * item.quantity;
      totalBv += parseFloat(item.bv_earned || 0) * item.quantity;
    }
    
    return { 
      totalPhysicalItems: physicalTotal, 
      subtotal: currentSubtotal, 
      totalBvInCart: totalBv,
      selectedItemsForCheckout: itemsForCheckout
    };
  }, [cartItems, selectedItemIds]);

  const deliveryFee = useMemo(() => {
    if (subtotal === 0 || !deliverySettings) {
      return 0;
    }
    return (totalBvInCart >= deliverySettings.threshold) 
      ? deliverySettings.special 
      : deliverySettings.standard;
  }, [totalBvInCart, subtotal, deliverySettings]);

  const totalAmount = subtotal + deliveryFee;

  const deliveryIncentive = useMemo(() => {
    if (!deliverySettings || deliverySettings.special !== 0 || subtotal === 0) {
      return null;
    }
    const bvNeeded = deliverySettings.threshold - totalBvInCart;
    if (bvNeeded <= 0) {
      return null;
    }
    const progress = (totalBvInCart / deliverySettings.threshold) * 100;
    return {
      bvNeeded,
      threshold: deliverySettings.threshold,
      progress: Math.min(progress, 100),
    };
  }, [totalBvInCart, subtotal, deliverySettings]);

  const value = {
    cartItems,
    isLoading,
    totalPhysicalItems,
    subtotal,
    totalBvInCart,
    deliveryFee,
    totalAmount,
    deliveryIncentive,
    selectedItemIds,
    toggleItemSelected,
    selectedItemsForCheckout,
    // Note: We don't need to export fetchCart/initialLoadCart anymore
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  return useContext(CartContext);
};
