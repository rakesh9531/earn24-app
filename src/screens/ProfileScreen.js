// import React, { useContext } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Share, Alert } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { AuthContext } from '../context/AuthContext';

// const MenuItem = ({ item, onPress }) => (
//     <TouchableOpacity style={styles.menuItem} onPress={onPress}>
//         <View style={styles.menuItemLeft}>
//             <Icon name={item.icon} size={22} color="#4F4F4F" />
//             <Text style={styles.menuItemText}>{item.text}</Text>
//         </View>
//         <Icon name="chevron-forward-outline" size={22} color="#757575" />
//     </TouchableOpacity>
// );

// const ProfileScreen = ({ navigation }) => {
//     const { user, logout } = useContext(AuthContext);

//     const handleShare = async (referralCode) => {
//         try {
//             await Share.share({
//                 message: `Join Earn 24 with my referral code and start earning! My code is: ${referralCode}`,
//             });
//         } catch (error) {
//             Alert.alert(error.message);
//         }
//     };

//     // Define menu items with navigation actions
//     const menuItems = [
//         { icon: 'wallet-outline', text: 'My Wallet & Network', action: () => navigation.navigate('MlmDashboard') },
//         { icon: 'briefcase-outline', text: 'Orders', action: () => navigation.navigate('OrderHistory') },
//         { icon: 'person-outline', text: 'My Details', action: () => {} },
//         { icon: 'location-outline', text: 'Delivery Address', action: () => navigation.navigate('AddressList') },

//         // NEW DYNAMIC PAGES
//         { 
//           icon: 'information-circle-outline', 
//           text: 'About Earn24', 
//           action: () => navigation.navigate('Information', { pageKey: 'about_us', title: 'About Us' }) 
//         },
//         { 
//           icon: 'shield-checkmark-outline', 
//           text: 'Privacy Policy', 
//           action: () => navigation.navigate('Information', { pageKey: 'privacy_policy', title: 'Privacy' }) 
//         },
//         { 
//           icon: 'document-text-outline', 
//           text: 'Terms & Conditions', 
//           action: () => navigation.navigate('Information', { pageKey: 'terms_conditions', title: 'Terms' }) 
//         },
//         { 
//           icon: 'headset-outline', 
//           text: 'Contact Support', 
//           action: () => navigation.navigate('Information', { pageKey: 'contact_us', title: 'Support' }) 
//         },


//     ];

//     return (
//         <SafeAreaView style={styles.container}>
//             <ScrollView>
//                 {user ? (
//                     <View style={styles.content}>
//                         <View style={styles.profileHeader}>
//                             <Image
//                                 source={{ uri: `https://i.pravatar.cc/150?u=${user.email}` }}
//                                 style={styles.profilePic}
//                             />
//                             <Text style={styles.profileName}>{user.full_name}</Text>
//                             <Text style={styles.profileEmail}>{user.email}</Text>
//                         </View>
//                         <View style={styles.referralBox}>
//                             <Text style={styles.referralTitle}>Your Referral Code</Text>
//                             <Text style={styles.referralCode}>{user.username}</Text>
//                             <TouchableOpacity style={styles.shareButtton} onPress={() => handleShare(user.username)}>
//                                 <Icon name="share-social-outline" size={20} color="#FFFFFF" />
//                                 <Text style={styles.shareButtonText}>Share Code</Text>
//                             </TouchableOpacity>
//                         </View>
//                         <View style={styles.menuList}>
//                             {menuItems.map((item, index) => (
//                                 <MenuItem key={index} item={item} onPress={item.action} />
//                             ))}
//                         </View>
//                         <TouchableOpacity style={styles.logoutButton} onPress={logout}>
//                             <Icon name="log-out-outline" size={22} color="#D32F2F" />
//                             <Text style={styles.logoutButtonText}>Log Out</Text>
//                         </TouchableOpacity>
//                     </View>
//                 ) : (
//                     <View style={[styles.content, styles.loggedOutContent]}>
//                         <Text style={styles.loggedOutTitle}>Welcome to Earn 24</Text>
//                         <Text style={styles.loggedOutSubtitle}>Please log in or sign up to continue</Text>
//                         <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}><Text style={styles.buttonText}>Sign Up</Text></TouchableOpacity>
//                         <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}><Text style={styles.buttonText}>Log In</Text></TouchableOpacity>
//                     </View>
//                 )}
//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#FFFFFF' },
//     content: { paddingBottom: 40 },
//     loggedOutContent: { paddingTop: 150, alignItems: 'center', paddingHorizontal: 25 },
//     loggedOutTitle: { fontSize: 24, fontWeight: 'bold', color: '#181725', marginBottom: 10 },
//     loggedOutSubtitle: { fontSize: 16, color: '#7C7C7C', marginBottom: 40, textAlign: 'center' },
//     profileHeader: { alignItems: 'center', paddingVertical: 30, paddingHorizontal: 25 },
//     profilePic: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
//     profileName: { fontSize: 22, fontWeight: 'bold', color: '#181725' },
//     profileEmail: { fontSize: 16, color: '#7C7C7C' },
//     referralBox: { backgroundColor: '#E8F5E9', borderRadius: 15, padding: 20, alignItems: 'center', marginHorizontal: 25, marginBottom: 30 },
//     referralTitle: { fontSize: 16, color: '#388E3C' },
//     referralCode: { fontSize: 24, fontWeight: 'bold', color: '#1B5E20', marginVertical: 10 },
//     shareButtton: { flexDirection: 'row', backgroundColor: '#4CAF50', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, alignItems: 'center' },
//     shareButtonText: { color: '#FFFFFF', marginLeft: 10, fontWeight: '600' },
//     button: { backgroundColor: '#0CA201', paddingVertical: 18, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 15, width: '100%' },
//     buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
//     menuList: { paddingHorizontal: 25 },
//     menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F2F2F2' },
//     menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
//     menuItemText: { marginLeft: 20, fontSize: 16, color: '#181725', fontWeight: '500' },
//     logoutButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30, padding: 15 },
//     logoutButtonText: { color: '#D32F2F', marginLeft: 10, fontSize: 16, fontWeight: 'bold' },
// });

// export default ProfileScreen;

















import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Image,
    Share,
    ActivityIndicator,
    Modal,
    TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { useAlert } from '../components/CustomAlert';
import { IMAGE_BASE_URL } from '../config';

const serverUrl = IMAGE_BASE_URL || 'https://newapi.earn24.in';

const MenuItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuItemLeft}>
            <View style={[styles.iconContainer, { backgroundColor: item.bgColor || '#F2F2F2' }]}>
                <Icon name={item.icon} size={20} color={item.iconColor || "#4F4F4F"} />
            </View>
            <Text style={styles.menuItemText}>{item.text}</Text>
        </View>
        <Icon name="chevron-forward-outline" size={20} color="#757575" />
    </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
    const { user, logout, token, updateUser } = useContext(AuthContext);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editMobile, setEditMobile] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [isSavingText, setIsSavingText] = useState(false);
    const { showAlert, AlertModal } = useAlert();

    // --- OTP State for Profile Edit ---
    const [editEmailOtp, setEditEmailOtp] = useState('');
    const [isEditEmailOtpSent, setIsEditEmailOtpSent] = useState(false);
    const [isEditEmailVerified, setIsEditEmailVerified] = useState(false);
    const [isSendingEditEmailOtp, setIsSendingEditEmailOtp] = useState(false);
    const [isVerifyingEditEmailOtp, setIsVerifyingEditEmailOtp] = useState(false);

    const [editMobileOtp, setEditMobileOtp] = useState('');
    const [isEditMobileOtpSent, setIsEditMobileOtpSent] = useState(false);
    const [isEditMobileVerified, setIsEditMobileVerified] = useState(false);
    const [isSendingEditMobileOtp, setIsSendingEditMobileOtp] = useState(false);
    const [isVerifyingEditMobileOtp, setIsVerifyingEditMobileOtp] = useState(false);

    const openEditModal = () => {
        setEditName(user?.full_name || '');
        setEditEmail(user?.email || '');
        setEditMobile(user?.mobile_number || '');
        setEditPassword('');

        setEditEmailOtp('');
        setIsEditEmailOtpSent(false);
        setIsEditEmailVerified(false);

        setEditMobileOtp('');
        setIsEditMobileOtpSent(false);
        setIsEditMobileVerified(false);

        setIsEditModalVisible(true);
    };

    const handleSendEditEmailOtp = async () => {
        if (!editEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail.trim())) {
            showAlert('error', 'Invalid Email', 'Please enter a valid email address.');
            return;
        }
        setIsSendingEditEmailOtp(true);
        try {
            const response = await axios.post(`${serverUrl}/api/user/send-email-otp`, { email: editEmail.trim() });
            if (response.data.status) {
                setIsEditEmailOtpSent(true);
                showAlert('success', 'OTP Sent 📧', response.data.message || `OTP sent to ${editEmail}.`);
                if (response.data.mockOtp) setEditEmailOtp(response.data.mockOtp);
            }
        } catch (e) {
            showAlert('error', 'Failed', e.response?.data?.message || 'Could not send Email OTP.');
        } finally {
            setIsSendingEditEmailOtp(false);
        }
    };

    const handleVerifyEditEmailOtp = async () => {
        if (!editEmailOtp.trim()) {
            showAlert('error', 'Enter OTP', 'Please enter the Email OTP.');
            return;
        }
        setIsVerifyingEditEmailOtp(true);
        try {
            const response = await axios.post(`${serverUrl}/api/user/verify-email-otp`, { email: editEmail.trim(), otp: editEmailOtp.trim() });
            if (response.data.status) {
                setIsEditEmailVerified(true);
                showAlert('success', 'Email Verified! ✓', 'Email verified successfully.');
            }
        } catch (e) {
            showAlert('error', 'Verification Failed', e.response?.data?.message || 'Invalid Email OTP.');
        } finally {
            setIsVerifyingEditEmailOtp(false);
        }
    };

    const handleSendEditMobileOtp = async () => {
        if (!editMobile || editMobile.trim().length !== 10) {
            showAlert('error', 'Invalid Mobile', 'Please enter a valid 10-digit mobile number.');
            return;
        }
        setIsSendingEditMobileOtp(true);
        try {
            const response = await axios.post(`${serverUrl}/api/user/profile/send-mobile-otp`, { mobile_number: editMobile.trim() }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.status) {
                setIsEditMobileOtpSent(true);
                showAlert('success', 'OTP Sent 📱', response.data.message || `OTP sent to ${editMobile}.`);
            }
        } catch (e) {
            showAlert('error', 'Failed', e.response?.data?.message || 'Could not send Mobile OTP.');
        } finally {
            setIsSendingEditMobileOtp(false);
        }
    };

    const handleVerifyEditMobileOtp = async () => {
        if (!editMobileOtp.trim()) {
            showAlert('error', 'Enter OTP', 'Please enter the Mobile OTP.');
            return;
        }
        setIsVerifyingEditMobileOtp(true);
        try {
            const response = await axios.post(`${serverUrl}/api/user/profile/verify-mobile-otp`, { mobile_number: editMobile.trim(), otp: editMobileOtp.trim() }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.status) {
                setIsEditMobileVerified(true);
                showAlert('success', 'Mobile Verified! ✓', 'Mobile number verified successfully.');
            }
        } catch (e) {
            showAlert('error', 'Verification Failed', e.response?.data?.message || 'Invalid Mobile OTP.');
        } finally {
            setIsVerifyingEditMobileOtp(false);
        }
    };

    const handleSaveDetails = async () => {
        if (!editName.trim()) {
            showAlert('error', 'Name Required', 'Name cannot be empty.');
            return;
        }

        const isEmailChanged = editEmail.trim() !== (user?.email || '');
        const isMobileChanged = editMobile.trim() !== (user?.mobile_number || '');

        if (isEmailChanged && !isEditEmailVerified) {
            showAlert('error', 'Verify Email OTP', 'Please verify your new Email Address with OTP before saving.');
            return;
        }

        if (isMobileChanged && !isEditMobileVerified) {
            showAlert('error', 'Verify Mobile OTP', 'Please verify your new Mobile Number with OTP before saving.');
            return;
        }

        if ((isEmailChanged || isMobileChanged) && !editPassword.trim()) {
            showAlert('error', 'Password Required 🔒', 'Please enter your current account password to change Email Address or Mobile Number.');
            return;
        }

        try {
            setIsSavingText(true);
            const response = await axios.put(`${serverUrl}/api/user/profile/update`, {
                full_name: editName.trim(),
                email: editEmail.trim(),
                mobile_number: editMobile.trim(),
                password: editPassword.trim()
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.status) {
                updateUser(response.data.user || {
                    ...user,
                    full_name: editName.trim(),
                    email: editEmail.trim(),
                    mobile_number: editMobile.trim()
                });
                setIsEditModalVisible(false);
                showAlert('success', 'Profile Updated! 🎉', 'Your profile details have been updated successfully.');
            }
        } catch (error) {
            console.error("DEBUG: Update details error:", error);
            const errMsg = error.response?.data?.message || "Could not update details.";
            showAlert('error', 'Update Failed', errMsg);
        } finally {
            setIsSavingText(false);
        }
    };

    // Formats Rank (e.g. DISTRIBUTOR_GOLD -> Distributor Gold)
    const formatRank = (rank) => {
        if (!rank) return 'CUSTOMER';
        return rank.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    };

    const handleShare = async (referralCode) => {
        try {
            await Share.share({
                message: `Sign Up Earn24 with my referral code: ${referralCode}`,
            });
        } catch (error) {
            showAlert('error', 'Share Failed', error.message);
        }
    };

    // --- UPDATED IMAGE PICKER LOGIC ---
    const handlePickImage = async () => {
        console.log("DEBUG: Camera icon clicked"); // Check your terminal for this log

        const options = {
            mediaType: 'photo',
            quality: 0.5,
        };

        try {
            const result = await launchImageLibrary(options);
            console.log("DEBUG: Image picker result:", result);

            if (result.didCancel) {
                console.log("User cancelled image picker");
                return;
            }

            if (!result.assets || result.assets.length === 0) return;

            const image = result.assets[0];
            const formData = new FormData();
            formData.append('profileImage', {
                uri: image.uri,
                type: image.type,
                name: image.fileName || `profile_${user.id}.jpg`,
            });

            setIsUpdating(true);
            const response = await axios.put(`${serverUrl}/api/user/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status) {
                updateUser(response.data.user);
                showAlert('success', 'Photo Updated! 📸', 'Your profile photo has been updated.');
            }
        } catch (error) {
            console.error("DEBUG: Upload Error:", error);
            showAlert('error', 'Upload Failed', 'Could not connect to server. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    const menuItems = [
        { icon: 'wallet-outline', text: 'My Wallet & Network', bgColor: '#E8F5E9', iconColor: '#2E7D32', action: () => navigation.navigate('MlmDashboard') },
        { icon: 'card-outline', text: 'Withdrawal Requests', bgColor: '#FCE7F3', iconColor: '#DB2777', action: () => navigation.navigate('Withdrawal') },
        { icon: 'shield-checkmark-outline', text: 'KYC Verification', bgColor: '#F3E8FF', iconColor: '#9333EA', action: () => navigation.navigate('KYCVerification') },
        { icon: 'briefcase-outline', text: 'Order History', bgColor: '#E3F2FD', iconColor: '#1565C0', action: () => navigation.navigate('OrderHistory') },
        { icon: 'location-outline', text: 'Delivery Address', bgColor: '#FFF3E0', iconColor: '#E65100', action: () => navigation.navigate('AddressList') },
        { icon: 'create-outline', text: 'Edit Personal Details', bgColor: '#E0F7FA', iconColor: '#00838F', action: openEditModal },
        { icon: 'information-circle-outline', text: 'About Earn24', action: () => navigation.navigate('Information', { pageKey: 'about_us', title: 'About Us' }) },
        { icon: 'shield-checkmark-outline', text: 'Privacy Policy', action: () => navigation.navigate('Information', { pageKey: 'privacy_policy', title: 'Privacy' }) },
        { icon: 'document-text-outline', text: 'Terms & Conditions', action: () => navigation.navigate('Information', { pageKey: 'terms_conditions', title: 'Terms' }) },
        { icon: 'headset-outline', text: 'Contact Support', action: () => navigation.navigate('Information', { pageKey: 'contact_us', title: 'Support' }) },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={!user ? { flexGrow: 1, justifyContent: 'center', backgroundColor: '#EBF7EF' } : null}
            >
                {user ? (
                    <View style={styles.content}>
                        <View style={styles.profileHeader}>
                            {/* FIXED WRAPPER TAGS */}
                            <TouchableOpacity onPress={handlePickImage} disabled={isUpdating} activeOpacity={0.7}>
                                <View style={styles.avatarWrapper}>
                                    <Image
                                        source={{ uri: user?.user_pic ? `${serverUrl}${user.user_pic}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=random` }}
                                        style={styles.profilePic}
                                    />
                                    <View style={styles.cameraBadge}>
                                        {isUpdating ? (
                                            <ActivityIndicator size="small" color="#FFF" />
                                        ) : (
                                            <Icon name="camera" size={18} color="#FFF" />
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <Text style={styles.profileName}>{user?.full_name || 'User'}</Text>

                            <View style={styles.rankBadge}>
                                <Icon name="ribbon" size={14} color="#FFF" />
                                <Text style={styles.rankText}>{formatRank(user?.rank)}</Text>
                            </View>

                            <Text style={styles.profileEmail}>{user?.email || ''}</Text>
                        </View>

                        <View style={styles.referralBox}>
                            <Text style={styles.referralTitle}>Your Referral Code</Text>
                            <Text style={styles.referralCode}>{user?.username || ''}</Text>
                            <TouchableOpacity style={styles.shareButtton} onPress={() => handleShare(user?.username || '')}>
                                <Icon name="share-social-outline" size={20} color="#FFFFFF" />
                                <Text style={styles.shareButtonText}>Share Code</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.menuList}>
                            {menuItems.map((item, index) => (
                                <MenuItem key={index} item={item} onPress={item.action} />
                            ))}
                        </View>

                        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                            <Icon name="log-out-outline" size={22} color="#D32F2F" />
                            <Text style={styles.logoutButtonText}>Log Out Account</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.loggedOutWrapper}>
                        {/* Brand Header Section */}
                        <View style={styles.loggedOutHeader}>
                            <View style={styles.logoContainer}>
                                <Image 
                                    source={require('../assets/images/earn24_logo.png')} 
                                    style={styles.logoImage} 
                                    resizeMode="contain" 
                                />
                                <Text allowFontScaling={false} style={styles.logoText}>Earn24</Text>
                            </View>
                            <Text allowFontScaling={false} style={styles.tagline}>Grow • Earn • Succeed</Text>

                            <Text allowFontScaling={false} style={styles.welcomeTitle}>Welcome to Earn24</Text>
                            <Text allowFontScaling={false} style={styles.welcomeSubtitle}>Please login or sign up to continue</Text>

                            {/* User Avatar Circle */}
                            <View style={styles.avatarCircle}>
                                <Icon name="person" size={24} color="#FFFFFF" />
                            </View>
                        </View>

                        {/* Guest Action Card */}
                        <View style={styles.guestCard}>
                            <TouchableOpacity 
                                style={styles.signUpBtn} 
                                onPress={() => navigation.navigate('SignUp')}
                                activeOpacity={0.8}
                            >
                                <View style={styles.btnContentRow}>
                                    <Icon name="person-add-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                                    <Text allowFontScaling={false} style={styles.signUpBtnText}>Sign Up</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.loginBtnOutlined} 
                                onPress={() => navigation.navigate('Login')}
                                activeOpacity={0.8}
                            >
                                <View style={styles.btnContentRow}>
                                    <Icon name="log-in-outline" size={18} color="#00A63E" style={{ marginRight: 8 }} />
                                    <Text allowFontScaling={false} style={styles.loginBtnOutlinedText}>Login</Text>
                                </View>
                            </TouchableOpacity>

                            {/* Feature Chips */}
                            <View style={styles.featureChipsRow}>
                                <View style={styles.chipItem}>
                                    <Icon name="shield-checkmark-outline" size={13} color="#00A63E" />
                                    <Text allowFontScaling={false} style={styles.chipText}>Secure</Text>
                                </View>
                                <View style={styles.chipItem}>
                                    <Icon name="flash-outline" size={13} color="#00A63E" />
                                    <Text allowFontScaling={false} style={styles.chipText}>Fast</Text>
                                </View>
                                <View style={styles.chipItem}>
                                    <Icon name="headset-outline" size={13} color="#00A63E" />
                                    <Text allowFontScaling={false} style={styles.chipText}>24/7 Support</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>

            <Modal
                visible={isEditModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Edit Profile Details</Text>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Full Name</Text>
                            <TextInput
                                style={styles.textInput}
                                value={editName}
                                onChangeText={setEditName}
                                placeholder="Enter Full Name"
                                placeholderTextColor="#999"
                            />
                        </View>

                        {/* Email Address with OTP */}
                        <View style={styles.inputGroup}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={styles.inputLabel}>Email Address</Text>
                                {editEmail.trim() !== (user?.email || '') && (
                                    isEditEmailVerified ? (
                                        <Text style={{ fontSize: 12, color: '#16A34A', fontWeight: '700' }}>✓ Verified</Text>
                                    ) : (
                                        <TouchableOpacity onPress={handleSendEditEmailOtp} disabled={isSendingEditEmailOtp}>
                                            <Text style={{ fontSize: 12, color: '#0CA201', fontWeight: '700', textDecorationLine: 'underline' }}>
                                                {isSendingEditEmailOtp ? 'Sending...' : (isEditEmailOtpSent ? 'Resend OTP' : 'Send Email OTP')}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                )}
                            </View>
                            <TextInput
                                style={styles.textInput}
                                value={editEmail}
                                onChangeText={(val) => {
                                    setEditEmail(val);
                                    setIsEditEmailVerified(false);
                                    setIsEditEmailOtpSent(false);
                                }}
                                placeholder="Enter Email Address"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor="#999"
                                editable={!isEditEmailVerified}
                            />
                            {editEmail.trim() !== (user?.email || '') && isEditEmailOtpSent && !isEditEmailVerified && (
                                <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
                                    <TextInput
                                        style={[styles.textInput, { flex: 1, height: 40, fontSize: 13 }]}
                                        placeholder="Enter Email OTP"
                                        keyboardType="number-pad"
                                        value={editEmailOtp}
                                        onChangeText={setEditEmailOtp}
                                        placeholderTextColor="#999"
                                    />
                                    <TouchableOpacity 
                                        style={{ backgroundColor: '#0CA201', paddingHorizontal: 12, borderRadius: 8, justifyContent: 'center' }}
                                        onPress={handleVerifyEditEmailOtp}
                                        disabled={isVerifyingEditEmailOtp}
                                    >
                                        <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 12 }}>Verify</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        {/* Mobile Number with OTP */}
                        <View style={styles.inputGroup}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={styles.inputLabel}>Mobile Number</Text>
                                {editMobile.trim() !== (user?.mobile_number || '') && (
                                    isEditMobileVerified ? (
                                        <Text style={{ fontSize: 12, color: '#16A34A', fontWeight: '700' }}>✓ Verified</Text>
                                    ) : (
                                        <TouchableOpacity onPress={handleSendEditMobileOtp} disabled={isSendingEditMobileOtp}>
                                            <Text style={{ fontSize: 12, color: '#0CA201', fontWeight: '700', textDecorationLine: 'underline' }}>
                                                {isSendingEditMobileOtp ? 'Sending...' : (isEditMobileOtpSent ? 'Resend OTP' : 'Send Mobile OTP')}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                )}
                            </View>
                            <TextInput
                                style={styles.textInput}
                                value={editMobile}
                                onChangeText={(val) => {
                                    setEditMobile(val);
                                    setIsEditMobileVerified(false);
                                    setIsEditMobileOtpSent(false);
                                }}
                                placeholder="Enter Mobile Number"
                                keyboardType="phone-pad"
                                maxLength={10}
                                placeholderTextColor="#999"
                                editable={!isEditMobileVerified}
                            />
                            {editMobile.trim() !== (user?.mobile_number || '') && isEditMobileOtpSent && !isEditMobileVerified && (
                                <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
                                    <TextInput
                                        style={[styles.textInput, { flex: 1, height: 40, fontSize: 13 }]}
                                        placeholder="Enter Mobile OTP"
                                        keyboardType="number-pad"
                                        maxLength={6}
                                        value={editMobileOtp}
                                        onChangeText={setEditMobileOtp}
                                        placeholderTextColor="#999"
                                    />
                                    <TouchableOpacity 
                                        style={{ backgroundColor: '#0CA201', paddingHorizontal: 12, borderRadius: 8, justifyContent: 'center' }}
                                        onPress={handleVerifyEditMobileOtp}
                                        disabled={isVerifyingEditMobileOtp}
                                    >
                                        <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 12 }}>Verify</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        {(editEmail.trim() !== (user?.email || '') || editMobile.trim() !== (user?.mobile_number || '')) && (
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: '#D97706', fontWeight: '700' }]}>
                                    🔒 Secret Password (Required for Email/Mobile update)
                                </Text>
                                <TextInput
                                    style={[styles.textInput, { borderColor: '#F59E0B' }]}
                                    value={editPassword}
                                    onChangeText={setEditPassword}
                                    placeholder="Enter current password to authorize change"
                                    secureTextEntry
                                    placeholderTextColor="#999"
                                />
                            </View>
                        )}

                        <View style={styles.modalActions}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]} 
                                onPress={() => setIsEditModalVisible(false)}
                                disabled={isSavingText}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.modalButton, styles.saveButton]} 
                                onPress={handleSaveDetails}
                                disabled={isSavingText}
                            >
                                {isSavingText ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text style={styles.saveButtonText}>Save</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <AlertModal />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    content: { paddingBottom: 40 },
    profileHeader: { alignItems: 'center', paddingVertical: 30 },
    avatarWrapper: { position: 'relative' }, // Ensure this exists
    profilePic: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: '#eee' },
    cameraBadge: { position: 'absolute', bottom: 2, right: 2, backgroundColor: '#0CA201', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#FFF' },
    profileName: { fontSize: 22, fontWeight: 'bold', color: '#181725', marginTop: 15 },
    rankBadge: { flexDirection: 'row', backgroundColor: '#0CA201', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 25, alignItems: 'center', marginVertical: 10, gap: 6 },
    rankText: { color: '#FFF', fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase' },
    profileEmail: { fontSize: 14, color: '#7C7C7C' },
    referralBox: { backgroundColor: '#F0FDF4', borderRadius: 20, padding: 25, alignItems: 'center', marginHorizontal: 25, marginBottom: 30, borderWidth: 1, borderColor: '#DCFCE7' },
    referralTitle: { fontSize: 14, color: '#166534', fontWeight: '700' },
    referralCode: { fontSize: 32, fontWeight: '900', color: '#14532D', marginVertical: 10, letterSpacing: 2 },
    shareButtton: { flexDirection: 'row', backgroundColor: '#166534', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25, alignItems: 'center' },
    shareButtonText: { color: '#FFFFFF', marginLeft: 10, fontWeight: '700', fontSize: 15 },
    menuList: { paddingHorizontal: 25 },
    menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F8F8F8' },
    menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
    iconContainer: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    menuItemText: { marginLeft: 15, fontSize: 16, color: '#181725', fontWeight: '600' },
    logoutButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 40, padding: 15 },
    logoutButtonText: { color: '#D32F2F', marginLeft: 10, fontSize: 16, fontWeight: 'bold' },
    loggedOutWrapper: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#EBF7EF',
        paddingVertical: 10,
    },
    loggedOutHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
        paddingBottom: 16,
        backgroundColor: '#EBF7EF',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        width: 36,
        height: 36,
        marginRight: 8,
    },
    logoText: {
        fontSize: 28,
        fontWeight: '800',
        color: '#00A63E',
        letterSpacing: -0.5,
    },
    tagline: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748B',
        marginTop: 2,
        letterSpacing: 0.5,
    },
    welcomeTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0F172A',
        marginTop: 14,
        textAlign: 'center',
    },
    welcomeSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748B',
        marginTop: 4,
        textAlign: 'center',
    },
    avatarCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#00A63E',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 14,
        marginBottom: -24,
        zIndex: 10,
        shadowColor: '#00A63E',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
    },
    guestCard: {
        paddingHorizontal: 22,
        paddingTop: 38,
        paddingBottom: 30,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 6
    },
    signUpBtn: {
        backgroundColor: '#00A63E',
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
        shadowColor: '#00A63E',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 3,
    },
    btnContentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    signUpBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    loginBtnOutlined: {
        backgroundColor: '#FFFFFF',
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#00A63E',
        marginBottom: 20,
    },
    loginBtnOutlinedText: {
        color: '#00A63E',
        fontSize: 15,
        fontWeight: '700',
    },
    featureChipsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#DCFCE7',
    },
    chipItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    chipText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#166534',
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#181725',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4F4F4F',
        marginBottom: 6,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 16,
        color: '#181725',
        backgroundColor: '#F8FAFC',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#F1F5F9',
    },
    cancelButtonText: {
        color: '#64748B',
        fontSize: 16,
        fontWeight: '700',
    },
    saveButton: {
        backgroundColor: '#0CA201',
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default ProfileScreen;