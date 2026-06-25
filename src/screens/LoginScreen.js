
// import React, { useState, useContext } from 'react';
// import {
//   View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput,
//   ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { AuthContext } from '../context/AuthContext';
// import { authService } from '../services/authService';
// import { useAlert } from '../components/CustomAlert';

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
//   const { showAlert, AlertModal } = useAlert();

//   const handleLogin = async () => {
//     if (!loginInput || !password) {
//       showAlert('error', 'Missing Fields', 'Please enter your email/username and password.');
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const credentials = { identifier: loginInput, password };
//       const response = await authService.login(credentials);

//       if (response && response.status === true) {
//         await login(response.data.user, response.data.token);
//         navigation.reset({ index: 0, routes: [{ name: 'AppTabs' }] });
//       } else {
//         throw new Error(response.message || 'An unknown error occurred.');
//       }
//     } catch (error) {
//       showAlert('error', 'Login Failed', error.message || 'An unexpected error occurred.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           <Text style={styles.logo}>Earn24</Text>
//           <View style={styles.formContainer}>
//             <Text style={styles.title}>Log In</Text>
//             <Text style={styles.subtitle}>Enter your credentials to continue</Text>
//             <CustomTextInput label="Email, Username, or Mobile" value={loginInput} onChangeText={setLoginInput} placeholder="e.g., rohan@gmail.com" autoCapitalize="none" />
//             <CustomTextInput label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" isPassword />
            
//             {/* FIX: Forgot Password — full-width container prevents text wrapping/clipping */}
//             <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => navigation.navigate('ForgotPassword')}>
//                 <Text style={styles.forgotPasswordText} numberOfLines={1}>Forgot Password?</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={[styles.loginButton, isLoading && styles.disabledButton]} onPress={handleLogin} disabled={isLoading}>
//               {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.loginButtonText}>Log In</Text>}
//             </TouchableOpacity>

//             {/* FIX: Sign Up link — use a row View instead of nested Text to prevent word wrapping hiding last word */}
//             <TouchableOpacity style={styles.footerTextContainer} onPress={() => navigation.replace('SignUp')}>
//               <View style={styles.footerRow}>
//                 <Text style={styles.footerText}>Don't have an account?</Text>
//                 <Text style={[styles.footerText, styles.linkText]}>Sign Up</Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//       <AlertModal />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#FCF8F7' }, scrollContent: { flexGrow: 1, justifyContent: 'flex-end' }, logo: { fontSize: 40, fontWeight: 'bold', color: '#0CA201', textAlign: 'center', marginBottom: 40 },
//   formContainer: { paddingHorizontal: 25, paddingTop: 40, paddingBottom: 40, backgroundColor: '#FFFFFF', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
//   title: { fontSize: 26, fontWeight: '600', color: '#181725', marginBottom: 10 }, subtitle: { fontSize: 16, color: '#7C7C7C', marginBottom: 40 },
//   inputContainer: { marginBottom: 25 }, inputLabel: { fontSize: 16, color: '#7C7C7C', marginBottom: 10 },
//   inputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E2E2E2', paddingBottom: 8 },
//   input: { flex: 1, fontSize: 18, color: '#181725', fontWeight: '500', paddingVertical: 0 },
//   // FIX: use alignItems:'flex-end' on stretch container so text never wraps off-screen
//   forgotPasswordContainer: { alignItems: 'flex-end', marginVertical: 15 },
//   forgotPasswordText: { fontSize: 14, color: '#181725' },
//   loginButton: { backgroundColor: '#0CA201', paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
//   disabledButton: { opacity: 0.6 }, loginButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
//   footerTextContainer: { marginTop: 25, alignItems: 'center' },
//   // FIX: row layout prevents nested-text word-wrap bug
//   footerRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 4 },
//   footerText: { fontSize: 14, color: '#181725' },
//   linkText: { color: '#0CA201' },
// });

// export default LoginScreen;






// Final done


import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';
import { useAlert } from '../components/CustomAlert';

// Custom Text Input Component
const CustomTextInput = ({ label, icon, isPassword, ...props }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  return (
    <View style={styles.inputContainer}>
      <Text allowFontScaling={false} style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput 
          style={styles.input} 
          secureTextEntry={isPassword && !isPasswordVisible} 
          placeholderTextColor="#BDBDBD" 
          allowFontScaling={false}
          {...props} 
        />
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
  const { showAlert, AlertModal } = useAlert();

  const handleLogin = async () => {
    if (!loginInput || !password) {
      showAlert('error', 'Missing Fields', 'Please enter your email/username and password.');
      return;
    }
    setIsLoading(true);
    try {
      const credentials = { identifier: loginInput, password };
      const response = await authService.login(credentials);

      if (response && response.status === true) {
        await login(response.data.user, response.data.token);
        navigation.reset({ index: 0, routes: [{ name: 'AppTabs' }] });
      } else {
        throw new Error(response.message || 'An unknown error occurred.');
      }
    } catch (error) {
      showAlert('error', 'Login Failed', error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <Text allowFontScaling={false} style={styles.logo}>Earn24</Text>

          {/* Form Card Section */}
          <View style={styles.formContainer}>
            <Text allowFontScaling={false} style={styles.title}>Log In</Text>
            <Text allowFontScaling={false} style={styles.subtitle}>Enter your credentials to continue</Text>
            
            {/* Inputs */}
            <CustomTextInput 
              label="Email, Username, or Mobile" 
              value={loginInput} 
              onChangeText={setLoginInput} 
              placeholder="e.g., rohan@gmail.com" 
              autoCapitalize="none" 
            />
            <CustomTextInput 
              label="Password" 
              value={password} 
              onChangeText={setPassword} 
              placeholder="••••••••" 
              isPassword 
            />
            
            {/* Forgot Password Fix: Removed numberOfLines and added proper layout */}
            <TouchableOpacity 
                style={styles.forgotPasswordContainer} 
                onPress={() => navigation.navigate('ForgotPassword')}
            >
                <Text allowFontScaling={false} style={styles.forgotPasswordText}>
                    Forgot Password?
                </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity 
                style={[styles.loginButton, isLoading && styles.disabledButton]} 
                onPress={handleLogin} 
                disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text allowFontScaling={false} style={styles.loginButtonText}>Log In</Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link Fix: Using Nested Text for perfect wrapping */}
            <TouchableOpacity 
                style={styles.footerTextContainer} 
                onPress={() => navigation.replace('SignUp')}
            >
                <Text allowFontScaling={false} style={styles.footerText}>
                    Don't have an account? <Text style={styles.linkText}>Sign Up</Text>
                </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Alert Modal */}
      <AlertModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FCF8F7' 
  }, 
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'flex-end' 
  }, 
  logo: { 
    fontSize: 40, 
    fontWeight: 'bold', 
    color: '#0CA201', 
    textAlign: 'center', 
    marginBottom: 40 
  },
  formContainer: { 
    paddingHorizontal: 25, 
    paddingTop: 40, 
    paddingBottom: 60, // Screen ke niche se gap badhaya hai
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30,
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10
  },
  title: { 
    fontSize: 26, 
    fontWeight: '600', 
    color: '#181725', 
    marginBottom: 10 
  }, 
  subtitle: { 
    fontSize: 16, 
    color: '#7C7C7C', 
    marginBottom: 40 
  },
  inputContainer: { 
    marginBottom: 25 
  }, 
  inputLabel: { 
    fontSize: 16, 
    color: '#7C7C7C', 
    marginBottom: 10 
  },
  inputRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderBottomWidth: 1, 
    borderBottomColor: '#E2E2E2', 
    paddingBottom: 8 
  },
  input: { 
    flex: 1, 
    fontSize: 18, 
    color: '#181725', 
    fontWeight: '500', 
    paddingVertical: 0 
  },
  
  // Forgot Password Container Styling
  forgotPasswordContainer: { 
    width: '100%', 
    alignItems: 'flex-end', 
    marginVertical: 15 
  },
  forgotPasswordText: { 
    fontSize: 14, 
    color: '#181725', 
    fontWeight: '500' 
  },
  
  loginButton: { 
    backgroundColor: '#0CA201', 
    paddingVertical: 18, 
    borderRadius: 20, 
    alignItems: 'center',
    marginTop: 10
  },
  disabledButton: { 
    opacity: 0.6 
  }, 
  loginButtonText: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: '600' 
  },
  
  // Footer Text Styling
  footerTextContainer: { 
    marginTop: 25, 
    alignItems: 'center', 
    width: '100%',
    paddingBottom: 10 
  },
  footerText: { 
    fontSize: 15, 
    color: '#181725', 
    textAlign: 'center',
    lineHeight: 22 
  },
  linkText: { 
    color: '#0CA201', 
    fontWeight: 'bold' 
  },
});

export default LoginScreen;