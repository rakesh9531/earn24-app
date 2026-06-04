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
    Alert,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

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
    const { user, logout, token, setUser } = useContext(AuthContext);
    const [isUpdating, setIsUpdating] = useState(false);

    const serverUrl = 'https://newapi.earn24.in';

    // Formats Rank (e.g. DISTRIBUTOR_GOLD -> Distributor Gold)
    const formatRank = (rank) => {
        if (!rank) return 'CUSTOMER';
        return rank.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    };

    const handleShare = async (referralCode) => {
        try {
            await Share.share({
                message: `Join Earn 24 with my referral code: ${referralCode}`,
            });
        } catch (error) {
            Alert.alert(error.message);
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
                setUser(response.data.user);
                Alert.alert("Success", "Profile photo updated!");
            }
        } catch (error) {
            console.error("DEBUG: Upload Error:", error);
            Alert.alert("Upload Failed", "Could not connect to server.");
        } finally {
            setIsUpdating(false);
        }
    };

    const menuItems = [
        { icon: 'wallet-outline', text: 'My Wallet & Network', bgColor: '#E8F5E9', iconColor: '#2E7D32', action: () => navigation.navigate('MlmDashboard') },
        { icon: 'briefcase-outline', text: 'Order History', bgColor: '#E3F2FD', iconColor: '#1565C0', action: () => navigation.navigate('OrderHistory') },
        { icon: 'location-outline', text: 'Delivery Address', bgColor: '#FFF3E0', iconColor: '#E65100', action: () => navigation.navigate('AddressList') },
        { icon: 'information-circle-outline', text: 'About Earn24', action: () => navigation.navigate('Information', { pageKey: 'about_us', title: 'About Us' }) },
        { icon: 'shield-checkmark-outline', text: 'Privacy Policy', action: () => navigation.navigate('Information', { pageKey: 'privacy_policy', title: 'Privacy' }) },
        { icon: 'document-text-outline', text: 'Terms & Conditions', action: () => navigation.navigate('Information', { pageKey: 'terms_conditions', title: 'Terms' }) },
        { icon: 'headset-outline', text: 'Contact Support', action: () => navigation.navigate('Information', { pageKey: 'contact_us', title: 'Support' }) },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {user ? (
                    <View style={styles.content}>
                        <View style={styles.profileHeader}>
                            {/* FIXED WRAPPER TAGS */}
                            <TouchableOpacity onPress={handlePickImage} disabled={isUpdating} activeOpacity={0.7}>
                                <View style={styles.avatarWrapper}>
                                    <Image
                                        source={{ uri: user.user_pic ? `${serverUrl}${user.user_pic}` : `https://ui-avatars.com/api/?name=${user.full_name}&background=random` }}
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

                            <Text style={styles.profileName}>{user.full_name}</Text>

                            <View style={styles.rankBadge}>
                                <Icon name="ribbon" size={14} color="#FFF" />
                                <Text style={styles.rankText}>{formatRank(user.rank)}</Text>
                            </View>

                            <Text style={styles.profileEmail}>{user.email}</Text>
                        </View>

                        <View style={styles.referralBox}>
                            <Text style={styles.referralTitle}>Your Referral Code</Text>
                            <Text style={styles.referralCode}>{user.username}</Text>
                            <TouchableOpacity style={styles.shareButtton} onPress={() => handleShare(user.username)}>
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
                    // <View style={styles.loggedOutContent}>
                    //     <Text style={styles.loggedOutTitle}>Welcome to Earn 24</Text>
                    //     <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}><Text style={styles.buttonText}>Sign Up</Text></TouchableOpacity>
                    //     <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}><Text style={styles.buttonText}>Log In</Text></TouchableOpacity>
                    // </View>

                    <View style={[styles.content, styles.loggedOutContent]}>
                        <Text style={styles.loggedOutTitle}>Welcome to Earn 24</Text>
                        <Text style={styles.loggedOutSubtitle}>Please log in or sign up to continue</Text>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}><Text style={styles.buttonText}>Sign Up</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}><Text style={styles.buttonText}>Log In</Text></TouchableOpacity>
                    </View>


                )}
            </ScrollView>
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
    loggedOutContent: { paddingTop: 150, alignItems: 'center', paddingHorizontal: 25 },
    loggedOutTitle: { fontSize: 24, fontWeight: 'bold', color: '#181725', marginBottom: 30 },
    button: { backgroundColor: '#0CA201', paddingVertical: 18, borderRadius: 15, alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 15 },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

    content: { paddingBottom: 40 },
    loggedOutContent: { paddingTop: 150, alignItems: 'center', paddingHorizontal: 25 },
    loggedOutTitle: { fontSize: 24, fontWeight: 'bold', color: '#181725', marginBottom: 10 },
    loggedOutSubtitle: { fontSize: 16, color: '#7C7C7C', marginBottom: 40, textAlign: 'center' },


});

export default ProfileScreen;