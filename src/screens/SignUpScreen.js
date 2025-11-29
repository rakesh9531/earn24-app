// import React, { useState, useEffect, useContext } from 'react';
// import {
//   View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput,
//   ScrollView, KeyboardAvoidingView, Platform, Alert
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';
// import { authService } from '../services/authService'; 

// const CustomTextInput = ({ label, icon, isPassword, editable = true, ...props }) => {
//   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
//   const containerStyle = !editable ? [styles.inputContainer, styles.disabledInputContainer] : styles.inputContainer;
//   const labelStyle = !editable ? [styles.inputLabel, styles.disabledLabel] : styles.inputLabel;
//   return (
//     <View style={containerStyle}>
//       <Text style={labelStyle}>{label}</Text>
//       <View style={styles.inputRow}>
//         <TextInput style={styles.input} secureTextEntry={isPassword && !isPasswordVisible} placeholderTextColor="#BDBDBD" editable={editable} {...props}/>
//         {isPassword && (
//           <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
//             <Icon name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'} size={24} color="#828282" />
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// };

// const CustomCheckbox = ({ label, isChecked, onCheck, disabled = false }) => (
//   <TouchableOpacity style={[styles.checkboxContainer, disabled && styles.disabledCheckbox]} onPress={onCheck} disabled={disabled} activeOpacity={0.6}>
//     <Icon name={isChecked ? 'checkbox' : 'square-outline'} size={24} color={disabled ? '#BDBDBD' : '#0CA201'}/>
//     <Text style={[styles.checkboxText, disabled && styles.disabledLabel]}>{label}</Text>
//   </TouchableOpacity>
// );

// const SignUpScreen = ({ navigation }) => {
//   const [fullName, setFullName] = useState('');
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [referralCode, setReferralCode] = useState('');
//   const [isDefaultSponsor, setIsDefaultSponsor] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { login } = useContext(AuthContext);

//   useEffect(() => {
//     if (isDefaultSponsor) {
//       setReferralCode('');
//     }
//   }, [isDefaultSponsor]);

//   // const handleSignUp = async () => {
//   //   if (!fullName || !username || !email || !mobileNumber || !password || !confirmPassword) {
//   //     Alert.alert("Error", "Please fill in all required fields.");
//   //     return;
//   //   }
//   //   if (password !== confirmPassword) {
//   //     Alert.alert("Error", "Passwords do not match.");
//   //     return;
//   //   }
//   //   setIsLoading(true);
//   //   try {
//   //     const deviceToken = "placeholder_for_testing";
//   //     const userData = {
//   //       full_name: fullName, username, email, mobile_number: mobileNumber, password,
//   //       referral_code: referralCode, default_sponsor: isDefaultSponsor, device_token: deviceToken,
//   //     };
      
//   //     const API_URL = 'http://192.168.0.171:3000/api/user/registerUser';
//   //     const response = await axios.post(API_URL, userData);

//   //     if (response.data && response.data.status === true) {
//   //       const userDetails = response.data.data;
//   //       const userToken = response.data.data.token; // Corrected path to token

//   //       if (userDetails && userToken) {
//   //           Alert.alert("Success", "Registration successful!");
//   //           await login(userDetails, userToken);

//   //           // *** KEY CHANGE: THIS NAVIGATES USER TO HOME SCREEN ***
//   //           navigation.reset({
//   //             index: 0,
//   //             routes: [{ name: 'AppTabs' }], // 'AppTabs' is the name of your Tab Navigator
//   //           });
//   //           // *** END OF CHANGE ***

//   //       } else {
//   //           throw new Error("Registration successful, but failed to retrieve user data.");
//   //       }
//   //     } else {
//   //       throw new Error(response.data.message || 'An unknown API error occurred.');
//   //     }
//   //   } catch (error) {
//   //     let errorMessage = 'An unexpected error occurred.';
//   //     if (error.response) {
//   //       errorMessage = error.response.data.message || 'Validation failed.';
//   //     } else if (error.request) {
//   //       errorMessage = 'Cannot connect to the server. Please check your network connection.';
//   //     } else {
//   //       errorMessage = error.message;
//   //     }
//   //     Alert.alert("Sign Up Failed", errorMessage);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };




//   const handleSignUp = async () => {
//     // Input validation remains the same
//     if (!fullName || !username || !email || !mobileNumber || !password || !confirmPassword) {
//       Alert.alert("Error", "Please fill in all required fields.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       Alert.alert("Error", "Passwords do not match.");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const userData = {
//         full_name: fullName,
//         username,
//         email,
//         mobile_number: mobileNumber,
//         password,
//         referral_code: isDefaultSponsor ? null : referralCode,
//         default_sponsor: isDefaultSponsor,
//         device_token: "placeholder_for_testing",
//       };
      
//       // <-- 2. USE the new authService instead of axios directly
//       const response = await authService.register(userData);

//       if (response && response.status === true) {
//         // The backend returns the user data and token inside a 'data' object on success
//         const userDetails = response.data;
//         const userToken = response.data.token; // <-- 3. CORRECT path to the token

//         if (userDetails && userToken) {
//             Alert.alert("Success", "Registration successful!");
            
//             // Call the context's login function to save user and token
//             await login(userDetails, userToken);

//             // Navigate to the main app screen
//             navigation.reset({
//               index: 0,
//               routes: [{ name: 'AppTabs' }],
//             });
//         } else {
//             // This case handles if the server responds with status:true but no data/token
//             throw new Error("Registration successful, but server response was incomplete.");
//         }
//       } else {
//         // This case handles a { status: false, message: '...' } response
//         throw new Error(response.message || 'An unknown API error occurred.');
//       }
//     } catch (error) {
//       // <-- 4. SIMPLIFIED error handling, as the service now throws clean errors
//       Alert.alert("Sign Up Failed", error.message || 'An unexpected error occurred.');
//     } finally {
//       setIsLoading(false);
//     }
//   };







//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           <Text style={styles.logo}>Earn 24</Text>
//           <View style={styles.formContainer}>
//             <Text style={styles.title}>Sign Up</Text>
//             <Text style={styles.subtitle}>Enter your credentials to continue</Text>
//             <CustomTextInput label="Full Name" value={fullName} onChangeText={setFullName} />
//             <CustomTextInput label="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
//             <CustomTextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
//             <CustomTextInput
//               label="Mobile Number"
//               value={mobileNumber}
//               onChangeText={setMobileNumber}
//               keyboardType="phone-pad"
//               placeholder="Your 10-digit mobile number"
//               maxLength={10}
//             />
//             <CustomTextInput label="Password" value={password} onChangeText={setPassword} isPassword />
//             <CustomTextInput label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} isPassword />
//             <CustomTextInput label="Referral Code" value={referralCode} onChangeText={setReferralCode} editable={!isDefaultSponsor} autoCapitalize="none"/>
//             <CustomCheckbox label="Join as a Default Sponsor" isChecked={isDefaultSponsor} onCheck={() => setIsDefaultSponsor(!isDefaultSponsor)} disabled={referralCode.trim() !== ''}/>
//             <View style={styles.termsContainer}>
//               <Text style={styles.termsText}>
//                 By continuing you agree to our{' '}
//                 <Text style={styles.linkText} onPress={() => {}}>Terms of Service</Text> and{' '}
//                 <Text style={styles.linkText} onPress={() => {}}>Privacy Policy.</Text>
//               </Text>
//             </View>
//             <TouchableOpacity style={[styles.signUpButton, isLoading && styles.disabledButton]} onPress={handleSignUp} disabled={isLoading}>
//                 <Text style={styles.signUpButtonText}>Sign Up</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.footerTextContainer} onPress={() => navigation.replace('Login')}>
//               <Text style={styles.footerText}>
//                 Already have an account?{' '}
//                 <Text style={styles.linkText}>Sign In</Text>
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FCF8F7' },
//   scrollContent: { flexGrow: 1, justifyContent: 'flex-end' },
//   logo: { fontSize: 40, fontWeight: 'bold', color: '#0CA201', textAlign: 'center', marginBottom: 40, marginTop:40 },
//   formContainer: { paddingHorizontal: 25, paddingTop: 40, paddingBottom: 40, backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
//   title: { fontSize: 26, fontWeight: '600', color: '#181725', marginBottom: 10 },
//   subtitle: { fontSize: 16, color: '#7C7C7C', marginBottom: 30 },
//   inputContainer: { marginBottom: 20 },
//   disabledInputContainer: { opacity: 0.5 },
//   inputLabel: { fontSize: 16, color: '#7C7C7C', marginBottom: 10 },
//   disabledLabel: { color: '#BDBDBD' },
//   inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E2E2E2', paddingBottom: 8 },
//   input: { flex: 1, fontSize: 16, color: '#181725', fontWeight: '500', paddingVertical: 0 },
//   checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 5 },
//   checkboxText: { marginLeft: 12, fontSize: 14, color: '#555' },
//   disabledCheckbox: { opacity: 0.5 },
//   termsContainer: { marginVertical: 20 },
//   termsText: { fontSize: 14, color: '#7C7C7C', textAlign: 'center', lineHeight: 22 },
//   linkText: { color: '#0CA201' },
//   signUpButton: { backgroundColor: '#0CA201', paddingVertical: 18, borderRadius: 20, alignItems: 'center', marginTop: 10 },
//   disabledButton: { opacity: 0.6 },
//   signUpButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
//   footerTextContainer: { marginTop: 25, alignItems: 'center' },
//   footerText: { fontSize: 14, color: '#181725' },
// });

// export default SignUpScreen;








// import React, { useState, useEffect, useContext } from 'react';
// import {
//   View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput,
//   ScrollView, KeyboardAvoidingView, Platform, Alert
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { AuthContext } from '../context/AuthContext';
// import { authService } from '../services/authService'; // <-- IMPORT THE SERVICE

// const CustomTextInput = ({ label, icon, isPassword, editable = true, ...props }) => {
//   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
//   const containerStyle = !editable ? [styles.inputContainer, styles.disabledInputContainer] : styles.inputContainer;
//   const labelStyle = !editable ? [styles.inputLabel, styles.disabledLabel] : styles.inputLabel;
//   return (
//     <View style={containerStyle}>
//       <Text style={labelStyle}>{label}</Text>
//       <View style={styles.inputRow}>
//         <TextInput style={styles.input} secureTextEntry={isPassword && !isPasswordVisible} placeholderTextColor="#BDBDBD" editable={editable} {...props}/>
//         {isPassword && (
//           <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
//             <Icon name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'} size={24} color="#828282" />
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// };

// const CustomCheckbox = ({ label, isChecked, onCheck, disabled = false }) => (
//   <TouchableOpacity style={[styles.checkboxContainer, disabled && styles.disabledCheckbox]} onPress={onCheck} disabled={disabled} activeOpacity={0.6}>
//     <Icon name={isChecked ? 'checkbox' : 'square-outline'} size={24} color={disabled ? '#BDBDBD' : '#0CA201'}/>
//     <Text style={[styles.checkboxText, disabled && styles.disabledLabel]}>{label}</Text>
//   </TouchableOpacity>
// );

// const SignUpScreen = ({ navigation }) => {
//   const [fullName, setFullName] = useState('');
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [referralCode, setReferralCode] = useState('');
//   const [isDefaultSponsor, setIsDefaultSponsor] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const { login } = useContext(AuthContext);

//   useEffect(() => {
//     if (isDefaultSponsor) setReferralCode('');
//   }, [isDefaultSponsor]);

//   const handleSignUp = async () => {
//     if (!fullName || !username || !email || !mobileNumber || !password || !confirmPassword) {
//       Alert.alert("Error", "Please fill in all required fields.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       Alert.alert("Error", "Passwords do not match.");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const userData = {
//         full_name: fullName, username, email, mobile_number: mobileNumber, password,
//         referral_code: isDefaultSponsor ? null : referralCode,
//         default_sponsor: isDefaultSponsor,
//         device_token: "placeholder",
//       };
      
//       const response = await authService.register(userData);

//       if (response && response.status === true) {
//         await login(response.data, response.data.token);
        
//         Alert.alert("Success", "Registration successful!");
//         navigation.reset({
//           index: 0,
//           routes: [{ name: 'AppTabs' }],
//         });
//       } else {
//         throw new Error(response.message || 'An unknown error occurred.');
//       }
//     } catch (error) {
//       Alert.alert("Sign Up Failed", error.message || 'An unexpected error occurred.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           <Text style={styles.logo}>Earn 24</Text>
//           <View style={styles.formContainer}>
//             <Text style={styles.title}>Sign Up</Text>
//             <Text style={styles.subtitle}>Enter your credentials to continue</Text>
//             <CustomTextInput label="Full Name" value={fullName} onChangeText={setFullName} />
//             <CustomTextInput label="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
//             <CustomTextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
//             <CustomTextInput label="Mobile Number" value={mobileNumber} onChangeText={setMobileNumber} keyboardType="phone-pad" placeholder="Your 10-digit mobile number" maxLength={10}/>
//             <CustomTextInput label="Password" value={password} onChangeText={setPassword} isPassword />
//             <CustomTextInput label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} isPassword />
//             <CustomTextInput label="Referral Code" value={referralCode} onChangeText={setReferralCode} editable={!isDefaultSponsor} autoCapitalize="none"/>
//             <CustomCheckbox label="Join as a Default Sponsor" isChecked={isDefaultSponsor} onCheck={() => setIsDefaultSponsor(!isDefaultSponsor)} disabled={referralCode.trim() !== ''}/>
//             <View style={styles.termsContainer}>
//               <Text style={styles.termsText}>By continuing you agree to our{' '}<Text style={styles.linkText}>Terms of Service</Text> and{' '}<Text style={styles.linkText}>Privacy Policy.</Text></Text>
//             </View>
//             <TouchableOpacity style={[styles.signUpButton, isLoading && styles.disabledButton]} onPress={handleSignUp} disabled={isLoading}>
//                 <Text style={styles.signUpButtonText}>Sign Up</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.footerTextContainer} onPress={() => navigation.replace('Login')}>
//               <Text style={styles.footerText}>Already have an account?{' '}<Text style={styles.linkText}>Sign In</Text></Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FCF8F7' },
//   scrollContent: { flexGrow: 1, justifyContent: 'flex-end' },
//   logo: { fontSize: 40, fontWeight: 'bold', color: '#0CA201', textAlign: 'center', marginBottom: 40, marginTop:40 },
//   formContainer: { paddingHorizontal: 25, paddingTop: 40, paddingBottom: 40, backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
//   title: { fontSize: 26, fontWeight: '600', color: '#181725', marginBottom: 10 },
//   subtitle: { fontSize: 16, color: '#7C7C7C', marginBottom: 30 },
//   inputContainer: { marginBottom: 20 },
//   disabledInputContainer: { opacity: 0.5 },
//   inputLabel: { fontSize: 16, color: '#7C7C7C', marginBottom: 10 },
//   disabledLabel: { color: '#BDBDBD' },
//   inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E2E2E2', paddingBottom: 8 },
//   input: { flex: 1, fontSize: 16, color: '#181725', fontWeight: '500', paddingVertical: 0 },
//   checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 5 },
//   checkboxText: { marginLeft: 12, fontSize: 14, color: '#555' },
//   disabledCheckbox: { opacity: 0.5 },
//   termsContainer: { marginVertical: 20 },
//   termsText: { fontSize: 14, color: '#7C7C7C', textAlign: 'center', lineHeight: 22 },
//   linkText: { color: '#0CA201' },
//   signUpButton: { backgroundColor: '#0CA201', paddingVertical: 18, borderRadius: 20, alignItems: 'center', marginTop: 10 },
//   disabledButton: { opacity: 0.6 },
//   signUpButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
//   footerTextContainer: { marginTop: 25, alignItems: 'center' },
//   footerText: { fontSize: 14, color: '#181725' },
// });

// export default SignUpScreen;









import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';

const CustomTextInput = ({ label, icon, isPassword, editable = true, ...props }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const containerStyle = !editable ? [styles.inputContainer, styles.disabledInputContainer] : styles.inputContainer;
  const labelStyle = !editable ? [styles.inputLabel, styles.disabledLabel] : styles.inputLabel;
  return (
    <View style={containerStyle}>
      <Text style={labelStyle}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput style={styles.input} secureTextEntry={isPassword && !isPasswordVisible} placeholderTextColor="#BDBDBD" editable={editable} {...props}/>
        {isPassword && (
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Icon name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'} size={24} color="#828282" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const CustomCheckbox = ({ label, isChecked, onCheck, disabled = false }) => (
  <TouchableOpacity style={[styles.checkboxContainer, disabled && styles.disabledCheckbox]} onPress={onCheck} disabled={disabled} activeOpacity={0.6}>
    <Icon name={isChecked ? 'checkbox' : 'square-outline'} size={24} color={disabled ? '#BDBDBD' : '#0CA201'}/>
    <Text style={[styles.checkboxText, disabled && styles.disabledLabel]}>{label}</Text>
  </TouchableOpacity>
);

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isDefaultSponsor, setIsDefaultSponsor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  useEffect(() => {
    if (isDefaultSponsor) {
      setReferralCode('');
    }
  }, [isDefaultSponsor]);

  const handleSignUp = async () => {
    if (!fullName || !username || !email || !mobileNumber || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      const userData = {
        full_name: fullName,
        username,
        email,
        mobile_number: mobileNumber,
        password,
        referral_code: isDefaultSponsor ? null : referralCode,
        default_sponsor: isDefaultSponsor,
        device_token: "placeholder_for_testing",
      };
      
      const response = await authService.register(userData);

      if (response && response.status === true) {
        await login(response.data, response.data.token);
        
        Alert.alert("Success", "Registration successful!");
        navigation.reset({
          index: 0,
          routes: [{ name: 'AppTabs' }],
        });
      } else {
        throw new Error(response.message || 'An unknown error occurred.');
      }
    } catch (error) {
      Alert.alert("Sign Up Failed", error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.logo}>Earn 24</Text>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>Enter your credentials to continue</Text>
            <CustomTextInput label="Full Name" value={fullName} onChangeText={setFullName} />
            <CustomTextInput label="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
            <CustomTextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <CustomTextInput
              label="Mobile Number"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
              placeholder="Your 10-digit mobile number"
              maxLength={10}
            />
            <CustomTextInput label="Password" value={password} onChangeText={setPassword} isPassword />
            <CustomTextInput label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} isPassword />
            <CustomTextInput label="Referral Code" value={referralCode} onChangeText={setReferralCode} editable={!isDefaultSponsor} autoCapitalize="none"/>
            <CustomCheckbox label="Join as a Default Sponsor" isChecked={isDefaultSponsor} onCheck={() => setIsDefaultSponsor(!isDefaultSponsor)} disabled={referralCode.trim() !== ''}/>
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By continuing you agree to our{' '}
                <Text style={styles.linkText} onPress={() => {}}>Terms of Service</Text> and{' '}
                <Text style={styles.linkText} onPress={() => {}}>Privacy Policy.</Text>
              </Text>
            </View>
            <TouchableOpacity style={[styles.signUpButton, isLoading && styles.disabledButton]} onPress={handleSignUp} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.signUpButtonText}>Sign Up</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerTextContainer} onPress={() => navigation.replace('Login')}>
              <Text style={styles.footerText}>
                Already have an account?{' '}
                <Text style={styles.linkText}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF8F7' },
  scrollContent: { flexGrow: 1, justifyContent: 'flex-end' },
  logo: { fontSize: 40, fontWeight: 'bold', color: '#0CA201', textAlign: 'center', marginBottom: 40, marginTop:40 },
  formContainer: { paddingHorizontal: 25, paddingTop: 40, paddingBottom: 40, backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  title: { fontSize: 26, fontWeight: '600', color: '#181725', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#7C7C7C', marginBottom: 30 },
  inputContainer: { marginBottom: 20 },
  disabledInputContainer: { opacity: 0.5 },
  inputLabel: { fontSize: 16, color: '#7C7C7C', marginBottom: 10 },
  disabledLabel: { color: '#BDBDBD' },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E2E2E2', paddingBottom: 8 },
  input: { flex: 1, fontSize: 16, color: '#181725', fontWeight: '500', paddingVertical: 0 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 5 },
  checkboxText: { marginLeft: 12, fontSize: 14, color: '#555' },
  disabledCheckbox: { opacity: 0.5 },
  termsContainer: { marginVertical: 20 },
  termsText: { fontSize: 14, color: '#7C7C7C', textAlign: 'center', lineHeight: 22 },
  linkText: { color: '#0CA201' },
  signUpButton: { backgroundColor: '#0CA201', paddingVertical: 18, borderRadius: 20, alignItems: 'center', marginTop: 10 },
  disabledButton: { opacity: 0.6 },
  signUpButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  footerTextContainer: { marginTop: 25, alignItems: 'center' },
  footerText: { fontSize: 14, color: '#181725' },
});

export default SignUpScreen;