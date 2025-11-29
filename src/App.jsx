// import React, { useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import SplashScreen from 'react-native-splash-screen';
// import AppNavigator from './navigation/AppNavigator';
// import { StatusBar } from 'react-native';

// import { AuthProvider } from './context/AuthContext'; // <-- IMPORT
// import { CartProvider } from './context/CartContext';
// import { PincodeProvider } from './context/PincodeContext'; // <-- THE CRUCIAL IMPORT

// const App = () => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       SplashScreen.hide();
//     }, 100);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <AuthProvider>
//       <PincodeProvider>
//        <CartProvider>
//       <NavigationContainer>
//         <StatusBar barStyle="dark-content" />
//         <AppNavigator />
//       </NavigationContainer>
//       </CartProvider>
//       </PincodeProvider>
//     </AuthProvider>
//   );
// };

// export default App;









import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'react-native';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { PincodeProvider } from './context/PincodeContext';

const App = () => {
  useEffect(() => {
    // This part for the splash screen is fine.
    const timer = setTimeout(() => {
      SplashScreen.hide();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    // ==========================================================
    // === THIS IS THE CORRECT AND FINAL ORDER FOR YOUR APP   ===
    // ==========================================================
    
    // 1. NavigationContainer must be at the top level.
    <NavigationContainer>
    
      {/* 2. Providers that don't depend on others can go first. */}
      <AuthProvider>
        <PincodeProvider>

          {/* 3. The CartProvider, which depends on the others, goes inside. */}
          <CartProvider>
          
            {/* 4. The rest of your app, including the navigator, goes at the very center. */}
            <StatusBar barStyle="dark-content" />
            <AppNavigator />
            
          </CartProvider>
        </PincodeProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;