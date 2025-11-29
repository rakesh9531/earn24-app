// import React, { useState, useContext } from 'react';
// import {
//   View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput,
//   ScrollView, KeyboardAvoidingView, Platform, Alert
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';

// import { authService } from '../services/authService'; 

// const CustomTextInput = ({ label, icon, isPassword, ...props }) => {
//   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
//   return (
//     <View style={styles.inputContainer}>
//       <Text style={styles.inputLabel}>{label}</Text>
//       <View style={styles.inputRow}>
//         <TextInput
//           style={styles.input}
//           secureTextEntry={isPassword && !isPasswordVisible}
//           placeholderTextColor="#BDBDBD"
//           {...props}
//         />
//         {isPassword && (
//           <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
//             <Icon name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'} size={24} color="#828282" />
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// };

// const LoginScreen = ({ navigation }) => {
//   const [loginInput, setLoginInput] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { login } = useContext(AuthContext);

//   // const handleLogin = async () => {
//   //   if (!loginInput || !password) {
//   //     Alert.alert("Error", "Please enter your credentials.");
//   //     return;
//   //   }
//   //   setIsLoading(true);
//   //   try {
//   //     const loginData = { login: loginInput, password };
//   //     // const API_URL = 'http://192.168.0.171:3000/api/user/userLogin';
//   //     const API_URL = 'http://192.168.0.171:3000/api/auth/user/login';
//   //     const response = await axios.post(API_URL, loginData);

//   //     if (response.data && response.data.status === true) {
//   //       const userDetails = response.data.data;
//   //       const userToken = response.data.token; // Corrected path to token

//   //       if (userDetails && userToken) {
//   //           await login(userDetails, userToken);
            
//   //           // *** KEY CHANGE: THIS NAVIGATES USER TO HOME SCREEN ***
//   //           navigation.reset({
//   //             index: 0,
//   //             routes: [{ name: 'AppTabs' }], // 'AppTabs' is the name of your Tab Navigator
//   //           });
//   //           // *** END OF CHANGE ***

//   //       } else {
//   //           throw new Error("Login successful, but failed to retrieve user data from the server.");
//   //       }
//   //     } else {
//   //       throw new Error(response.data.message || 'An unknown API error occurred.');
//   //     }
//   //   } catch (error) {
//   //     let errorMessage = 'An unexpected error occurred.';
//   //     if (error.response) {
//   //       errorMessage = error.response.data.message || 'Invalid credentials.';
//   //     } else if (error.request) {
//   //       errorMessage = 'Cannot connect to the server. Please check your network connection.';
//   //     } else {
//   //       errorMessage = error.message;
//   //     }
//   //     Alert.alert("Login Failed", errorMessage);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };








//   const handleLogin = async () => {
//     if (!loginInput || !password) {
//       Alert.alert("Error", "Please enter your credentials.");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const loginData = { login: loginInput, password };
      
//       // Use the new service instead of axios directly
//       const response = await authService.login(loginData);

//       if (response && response.status === true) {
//         const userDetails = response.data;
//         const userToken = response.token;

//         if (userDetails && userToken) {
//             await login(userDetails, userToken); // Call context to save data
            
//             navigation.reset({
//               index: 0,
//               routes: [{ name: 'AppTabs' }],
//             });
//         } else {
//             throw new Error("Login successful, but server response was incomplete.");
//         }
//       } else {
//         // This case handles { status: false, message: '...' }
//         throw new Error(response.message || 'An unknown API error occurred.');
//       }
//     } catch (error) {
//       // The service now throws a clean error object
//       Alert.alert("Login Failed", error.message || 'An unexpected error occurred.');
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
//             <Text style={styles.title}>Log In</Text>
//             <Text style={styles.subtitle}>Enter your credentials to continue</Text>
//             <CustomTextInput
//               label="Email, Username, or Mobile"
//               value={loginInput}
//               onChangeText={setLoginInput}
//               placeholder="e.g., rohan@gmail.com"
//               autoCapitalize="none"
//             />
//             <CustomTextInput
//               label="Password"
//               value={password}
//               onChangeText={setPassword}
//               placeholder="••••••••"
//               isPassword
//             />
//             <TouchableOpacity style={styles.forgotPasswordContainer}>
//               <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
//             </TouchableOpacity>
            
//             <TouchableOpacity
//               style={[styles.loginButton, isLoading && styles.disabledButton]}
//               onPress={handleLogin}
//               disabled={isLoading}
//             >
//               <Text style={styles.loginButtonText}>Log In</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.footerTextContainer}
//               onPress={() => navigation.replace('SignUp')}
//             >
//               <Text style={styles.footerText}>
//                 Don't have an account?{' '}
//                 <Text style={styles.linkText}>Sign Up</Text>
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
//   logo: { fontSize: 40, fontWeight: 'bold', color: '#0CA201', textAlign: 'center', marginBottom: 40 },
//   formContainer: { paddingHorizontal: 25, paddingTop: 40, paddingBottom: 40, backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
//   title: { fontSize: 26, fontWeight: '600', color: '#181725', marginBottom: 10 },
//   subtitle: { fontSize: 16, color: '#7C7C7C', marginBottom: 40 },
//   inputContainer: { marginBottom: 25 },
//   inputLabel: { fontSize: 16, color: '#7C7C7C', marginBottom: 10 },
//   inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E2E2E2', paddingBottom: 8 },
//   input: { flex: 1, fontSize: 18, color: '#181725', fontWeight: '500', paddingVertical: 0 },
//   forgotPasswordContainer: { alignSelf: 'flex-end', marginVertical: 15 },
//   forgotPasswordText: { fontSize: 14, color: '#181725' },
//   loginButton: { backgroundColor: '#0CA201', paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
//   disabledButton: { opacity: 0.6 },
//   loginButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
//   footerTextContainer: { marginTop: 25, alignItems: 'center' },
//   footerText: { fontSize: 14, color: '#181725' },
//   linkText: { color: '#0CA201' },
// });

// export default LoginScreen;








// import React, { useState, useContext } from 'react';
// import {
//   View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput,
//   ScrollView, KeyboardAvoidingView, Platform, Alert
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { AuthContext } from '../context/AuthContext';
// import { authService } from '../services/authService'; // <-- IMPORT THE SERVICE

// const CustomTextInput = ({ label, icon, isPassword, ...props }) => {
//   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
//   return (
//     <View style={styles.inputContainer}>
//       <Text style={styles.inputLabel}>{label}</Text>
//       <View style={styles.inputRow}>
//         <TextInput style={styles.input} secureTextEntry={isPassword && !isPasswordVisible} placeholderTextColor="#BDBDBD" {...props} />
//         {isPassword && (
//           <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
//             <Icon name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'} size={24} color="#828282" />
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// };

// const LoginScreen = ({ navigation }) => {
//   const [loginInput, setLoginInput] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { login } = useContext(AuthContext);

//   const handleLogin = async () => {
//     if (!loginInput || !password) {
//       Alert.alert("Error", "Please enter your credentials.");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const credentials = { login: loginInput, password };
      
//       // Use the centralized service instead of a direct axios call
//       const response = await authService.login(credentials);

//       if (response && response.status === true) {
//         // The service already returns the parsed JSON data
//         await login(response.data, response.token);
        
//         navigation.reset({
//           index: 0,
//           routes: [{ name: 'AppTabs' }],
//         });
//       } else {
//         throw new Error(response.message || 'An unknown API error occurred.');
//       }
//     } catch (error) {
//       Alert.alert("Login Failed", error.message || 'An unexpected error occurred.');
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
//             <Text style={styles.title}>Log In</Text>
//             <Text style={styles.subtitle}>Enter your credentials to continue</Text>
//             <CustomTextInput label="Email, Username, or Mobile" value={loginInput} onChangeText={setLoginInput} placeholder="e.g., rohan@gmail.com" autoCapitalize="none" />
//             <CustomTextInput label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" isPassword />
//             <TouchableOpacity style={styles.forgotPasswordContainer}>
//               <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={[styles.loginButton, isLoading && styles.disabledButton]} onPress={handleLogin} disabled={isLoading}>
//               <Text style={styles.loginButtonText}>Log In</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.footerTextContainer} onPress={() => navigation.replace('SignUp')}>
//               <Text style={styles.footerText}>Don't have an account?{' '}<Text style={styles.linkText}>Sign Up</Text></Text>
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
//   logo: { fontSize: 40, fontWeight: 'bold', color: '#0CA201', textAlign: 'center', marginBottom: 40 },
//   formContainer: { paddingHorizontal: 25, paddingTop: 40, paddingBottom: 40, backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
//   title: { fontSize: 26, fontWeight: '600', color: '#181725', marginBottom: 10 },
//   subtitle: { fontSize: 16, color: '#7C7C7C', marginBottom: 40 },
//   inputContainer: { marginBottom: 25 },
//   inputLabel: { fontSize: 16, color: '#7C7C7C', marginBottom: 10 },
//   inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E2E2E2', paddingBottom: 8 },
//   input: { flex: 1, fontSize: 18, color: '#181725', fontWeight: '500', paddingVertical: 0 },
//   forgotPasswordContainer: { alignSelf: 'flex-end', marginVertical: 15 },
//   forgotPasswordText: { fontSize: 14, color: '#181725' },
//   loginButton: { backgroundColor: '#0CA201', paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
//   disabledButton: { opacity: 0.6 },
//   loginButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
//   footerTextContainer: { marginTop: 25, alignItems: 'center' },
//   footerText: { fontSize: 14, color: '#181725' },
//   linkText: { color: '#0CA201' },
// });

// export default LoginScreen;






import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';

const CustomTextInput = ({ label, icon, isPassword, ...props }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput style={styles.input} secureTextEntry={isPassword && !isPasswordVisible} placeholderTextColor="#BDBDBD" {...props} />
        {isPassword && (
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Icon name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'} size={24} color="#828282" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const LoginScreen = ({ navigation }) => {
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!loginInput || !password) {
      Alert.alert("Error", "Please enter your credentials.");
      return;
    }
    setIsLoading(true);
    try {
      const credentials = { login: loginInput, password };
      const response = await authService.login(credentials);

      if (response && response.status === true) {
        await login(response.data, response.token);
        navigation.reset({ index: 0, routes: [{ name: 'AppTabs' }] });
      } else {
        throw new Error(response.message || 'An unknown error occurred.');
      }
    } catch (error) {
      Alert.alert("Login Failed", error.message || 'An unexpected error occurred.');
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
            <Text style={styles.title}>Log In</Text>
            <Text style={styles.subtitle}>Enter your credentials to continue</Text>
            <CustomTextInput label="Email, Username, or Mobile" value={loginInput} onChangeText={setLoginInput} placeholder="e.g., rohan@gmail.com" autoCapitalize="none" />
            <CustomTextInput label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" isPassword />
            <TouchableOpacity style={styles.forgotPasswordContainer}><Text style={styles.forgotPasswordText}>Forgot Password?</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.loginButton, isLoading && styles.disabledButton]} onPress={handleLogin} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.loginButtonText}>Log In</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerTextContainer} onPress={() => navigation.replace('SignUp')}>
              <Text style={styles.footerText}>Don't have an account?{' '}<Text style={styles.linkText}>Sign Up</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCF8F7' }, scrollContent: { flexGrow: 1, justifyContent: 'flex-end' }, logo: { fontSize: 40, fontWeight: 'bold', color: '#0CA201', textAlign: 'center', marginBottom: 40 },
  formContainer: { paddingHorizontal: 25, paddingTop: 40, paddingBottom: 40, backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  title: { fontSize: 26, fontWeight: '600', color: '#181725', marginBottom: 10 }, subtitle: { fontSize: 16, color: '#7C7C7C', marginBottom: 40 },
  inputContainer: { marginBottom: 25 }, inputLabel: { fontSize: 16, color: '#7C7C7C', marginBottom: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E2E2E2', paddingBottom: 8 },
  input: { flex: 1, fontSize: 18, color: '#181725', fontWeight: '500', paddingVertical: 0 },
  forgotPasswordContainer: { alignSelf: 'flex-end', marginVertical: 15 }, forgotPasswordText: { fontSize: 14, color: '#181725' },
  loginButton: { backgroundColor: '#0CA201', paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
  disabledButton: { opacity: 0.6 }, loginButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  footerTextContainer: { marginTop: 25, alignItems: 'center' }, footerText: { fontSize: 14, color: '#181725' },
  linkText: { color: '#0CA201' },
});

export default LoginScreen;