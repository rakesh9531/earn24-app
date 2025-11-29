import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PincodeContext = createContext({
  pincode: null,
  isLoadingPincode: true,
  updatePincode: async (newPincode) => {},
});

const PINCODE_STORAGE_KEY = '@session_pincode';

export const PincodeProvider = ({ children }) => {
  const [pincode, setPincode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedPincode = await AsyncStorage.getItem(PINCODE_STORAGE_KEY);
        if (storedPincode) {
          setPincode(storedPincode);
        }
      } catch (e) {
        console.error("PincodeContext: Failed to load pincode from storage.", e);
      } finally {
        setIsLoading(false);
      }
    };
    bootstrapAsync();
  }, []);

  const updatePincode = useCallback(async (newPincode) => {
    if (newPincode && typeof newPincode === 'string') {
      try {
        await AsyncStorage.setItem(PINCODE_STORAGE_KEY, newPincode);
        setPincode(newPincode);
      } catch (e) {
        console.error("PincodeContext: Failed to save pincode to storage.", e);
      }
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