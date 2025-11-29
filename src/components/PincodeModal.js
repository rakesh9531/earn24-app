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
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Keyboard, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { usePincode } from '../context/PincodeContext';

const PincodeModal = ({ visible, onDismiss }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updatePincode } = usePincode();

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (input.length !== 6 || !/^\d{6}$/.test(input)) {
      setError('Please enter a valid 6-digit pincode.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    
    await updatePincode(input);

    setIsSubmitting(false);
    onDismiss();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
            <Icon name="close" size={24} color="#555" />
          </TouchableOpacity>
          <Icon name="location-sharp" size={40} color="#0CA201" style={styles.icon} />
          <Text style={styles.title}>Select Your Delivery Location</Text>
          <Text style={styles.subtitle}>Enter your pincode to check for product availability and faster delivery options.</Text>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            placeholder="Enter 6-digit Pincode"
            keyboardType="number-pad"
            maxLength={6}
            value={input}
            onChangeText={setInput}
            placeholderTextColor="#999"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Continue</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
    container: { backgroundColor: 'white', borderRadius: 12, padding: 24, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
    closeButton: { position: 'absolute', top: 10, right: 10, padding: 5 },
    icon: { marginBottom: 15 },
    title: { fontSize: 22, fontWeight: '700', color: '#222', marginBottom: 8, textAlign: 'center' },
    subtitle: { fontSize: 15, color: '#555', textAlign: 'center', marginBottom: 25, lineHeight: 22 },
    input: { width: '100%', height: 55, borderWidth: 1.5, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 20, fontSize: 18, textAlign: 'center', color: '#333' },
    inputError: { borderColor: '#D32F2F' },
    errorText: { color: '#D32F2F', marginTop: 8, fontSize: 14 },
    button: { width: '100%', backgroundColor: '#0CA201', paddingVertical: 16, borderRadius: 8, alignItems: 'center', marginTop: 20, height: 55, justifyContent: 'center' },
    buttonText: { color: 'white', fontSize: 18, fontWeight: '600' }
});

export default PincodeModal;