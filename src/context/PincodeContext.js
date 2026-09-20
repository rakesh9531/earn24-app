import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PincodeContext = createContext({
  pincode: null,
  isLoadingPincode: true,
  updatePincode: async (newPincode) => {},
});

const PINCODE_STORAGE_KEY = '@session_pincode';

export const PincodeProvider = ({ children }) => {
  const [pincode, setPincode] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedPincode = await AsyncStorage.getItem(PINCODE_STORAGE_KEY);
        if (storedPincode && storedPincode !== 'undefined' && storedPincode !== 'null' && storedPincode !== 'ALL' && storedPincode.trim().length > 0) {
          setPincode(storedPincode.trim());
        } else {
          setPincode('ALL');
        }
      } catch (e) {
        console.error("PincodeContext: Failed to load pincode from storage.", e);
        setPincode('ALL');
      } finally {
        setIsLoading(false);
      }
    };
    bootstrapAsync();
  }, []);

  const updatePincode = useCallback(async (newPincode) => {
    try {
      if (newPincode && newPincode !== 'ALL' && newPincode !== 'undefined' && newPincode !== 'null' && typeof newPincode === 'string' && newPincode.trim().length > 0) {
        const clean = newPincode.trim();
        await AsyncStorage.setItem(PINCODE_STORAGE_KEY, clean);
        setPincode(clean);
      } else {
        await AsyncStorage.removeItem(PINCODE_STORAGE_KEY);
        setPincode('ALL');
      }
    } catch (e) {
      console.error("PincodeContext: Failed to save pincode to storage.", e);
    }
  }, []);

  const value = {
    pincode,
    isLoadingPincode: isLoading,
    updatePincode,
  };

  return (
    <PincodeContext.Provider value={value}>
      {children}
    </PincodeContext.Provider>
  );
};

export const usePincode = () => useContext(PincodeContext);