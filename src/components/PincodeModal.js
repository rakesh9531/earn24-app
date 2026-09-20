// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Keyboard, ActivityIndicator } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { usePincode } from '../context/PincodeContext';

// const PincodeModal = ({ visible }) => {
//   const [input, setInput] = useState('');
//   const [error, setError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { updatePincode } = usePincode();

//   const handleSubmit = async () => {
//     Keyboard.dismiss();
//     if (input.length !== 6 || !/^\d{6}$/.test(input)) {
//       setError('Please enter a valid 6-digit pincode.');
//       return;
//     }
//     setError('');
//     setIsSubmitting(true);
    
//     // Simulate a quick validation/API call if needed, then update context
//     await new Promise(resolve => setTimeout(resolve, 300)); 
    
//     await updatePincode(input);
//     setIsSubmitting(false);
//   };

//   return (
//     <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={() => {}}>
//       <View style={styles.overlay}>
//         <View style={styles.container}>
//           <Icon name="location-sharp" size={40} color="#0CA201" style={styles.icon} />
//           <Text style={styles.title}>Select Your Delivery Location</Text>
//           <Text style={styles.subtitle}>Enter your pincode to check for product availability and faster delivery options.</Text>
          
//           <TextInput
//             style={[styles.input, error ? styles.inputError : null]}
//             placeholder="Enter 6-digit Pincode"
//             keyboardType="number-pad"
//             maxLength={6}
//             value={input}
//             onChangeText={setInput}
//             placeholderTextColor="#999"
//           />
//           {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
//           <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
//             {isSubmitting ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.buttonText}>Continue</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//     overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
//     container: { backgroundColor: 'white', borderRadius: 12, padding: 24, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
//     icon: { marginBottom: 15 },
//     title: { fontSize: 22, fontWeight: '700', color: '#222', marginBottom: 8, textAlign: 'center' },
//     subtitle: { fontSize: 15, color: '#555', textAlign: 'center', marginBottom: 25, lineHeight: 22 },
//     input: { width: '100%', height: 55, borderWidth: 1.5, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 20, fontSize: 18, textAlign: 'center', color: '#333' },
//     inputError: { borderColor: '#D32F2F' },
//     errorText: { color: '#D32F2F', marginTop: 8, fontSize: 14 },
//     button: { width: '100%', backgroundColor: '#0CA201', paddingVertical: 16, borderRadius: 8, alignItems: 'center', marginTop: 20, height: 55, justifyContent: 'center' },
//     buttonText: { color: 'white', fontSize: 18, fontWeight: '600' }
// });

// export default PincodeModal;










import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Keyboard, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { usePincode } from '../context/PincodeContext';
import { productService } from '../services/productService';

const PincodeModal = ({ visible, onDismiss }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updatePincode } = usePincode();

  const handleSubmit = async () => {
    Keyboard.dismiss();
    const cleanPin = input.trim();
    if (cleanPin.length !== 6 || !/^[1-9][0-9]{5}$/.test(cleanPin)) {
      setError('Please enter a valid 6-digit Indian pincode (e.g. 828207).');
      return;
    }
    setError('');
    setIsSubmitting(true);
    
    try {
      const res = await productService.checkPincode(cleanPin);
      if (res && res.status) {
        await updatePincode(cleanPin);
        setIsSubmitting(false);
        onDismiss();
      } else {
        setError(res?.message || 'Invalid pincode. Please check your pincode.');
        setIsSubmitting(false);
      }
    } catch (e) {
      await updatePincode(cleanPin);
      setIsSubmitting(false);
      onDismiss();
    }
  };

  const handleSkip = async () => {
    Keyboard.dismiss();
    await updatePincode('ALL');
    onDismiss();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onDismiss}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onDismiss}>
        <TouchableWithoutFeedback>
          <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton} onPress={onDismiss} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Icon name="close" size={24} color="#555" />
            </TouchableOpacity>
            <Icon name="location-sharp" size={40} color="#0CA201" style={styles.icon} />
            <Text style={styles.title}>Select Your Delivery Location</Text>
            <Text style={styles.subtitle}>Enter your 6-digit pincode to check local product availability, or choose All India to view Pan-India offers.</Text>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              placeholder="Enter 6-digit Pincode"
              keyboardType="number-pad"
              maxLength={6}
              value={input}
              onChangeText={(val) => {
                setInput(val);
                if (error) setError('');
              }}
              placeholderTextColor="#999"
              allowFontScaling={false}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit Pincode</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Deliver All India / Clear Pincode</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
    container: { backgroundColor: 'white', borderRadius: 16, padding: 24, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
    closeButton: { position: 'absolute', top: 14, right: 14, padding: 5, zIndex: 10 },
    icon: { marginBottom: 12, marginTop: 6 },
    title: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 8, textAlign: 'center' },
    subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 20, lineHeight: 20 },
    input: { width: '100%', height: 50, borderWidth: 1.5, borderColor: '#CBD5E1', borderRadius: 10, paddingHorizontal: 16, fontSize: 18, textAlign: 'center', color: '#1F2937', backgroundColor: '#F8FAFC' },
    inputError: { borderColor: '#EF4444' },
    errorText: { color: '#EF4444', marginTop: 8, fontSize: 13, fontWeight: '500' },
    button: { width: '100%', backgroundColor: '#0CA201', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 18, height: 50, justifyContent: 'center' },
    buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
    skipButton: { width: '100%', paddingVertical: 12, alignItems: 'center', marginTop: 8 },
    skipButtonText: { color: '#0CA201', fontSize: 14, fontWeight: '600' }
});

export default PincodeModal;