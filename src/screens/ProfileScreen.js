import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Share, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';

const MenuItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuItemLeft}>
            <Icon name={item.icon} size={22} color="#4F4F4F" />
            <Text style={styles.menuItemText}>{item.text}</Text>
        </View>
        <Icon name="chevron-forward-outline" size={22} color="#757575" />
    </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
    const { user, logout } = useContext(AuthContext);

    const handleShare = async (referralCode) => {
        try {
            await Share.share({
                message: `Join Earn 24 with my referral code and start earning! My code is: ${referralCode}`,
            });
        } catch (error) {
            Alert.alert(error.message);
        }
    };
    
    // Define menu items with navigation actions
    const menuItems = [
        { icon: 'wallet-outline', text: 'My Wallet & Network', action: () => navigation.navigate('MlmDashboard') },
        { icon: 'briefcase-outline', text: 'Orders', action: () => navigation.navigate('OrderHistory') },
        { icon: 'person-outline', text: 'My Details', action: () => {} },
        { icon: 'location-outline', text: 'Delivery Address', action: () => navigation.navigate('AddressList') },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {user ? (
                    <View style={styles.content}>
                        <View style={styles.profileHeader}>
                            <Image
                                source={{ uri: `https://i.pravatar.cc/150?u=${user.email}` }}
                                style={styles.profilePic}
                            />
                            <Text style={styles.profileName}>{user.full_name}</Text>
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
                            <Text style={styles.logoutButtonText}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
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
    loggedOutContent: { paddingTop: 150, alignItems: 'center', paddingHorizontal: 25 },
    loggedOutTitle: { fontSize: 24, fontWeight: 'bold', color: '#181725', marginBottom: 10 },
    loggedOutSubtitle: { fontSize: 16, color: '#7C7C7C', marginBottom: 40, textAlign: 'center' },
    profileHeader: { alignItems: 'center', paddingVertical: 30, paddingHorizontal: 25 },
    profilePic: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
    profileName: { fontSize: 22, fontWeight: 'bold', color: '#181725' },
    profileEmail: { fontSize: 16, color: '#7C7C7C' },
    referralBox: { backgroundColor: '#E8F5E9', borderRadius: 15, padding: 20, alignItems: 'center', marginHorizontal: 25, marginBottom: 30 },
    referralTitle: { fontSize: 16, color: '#388E3C' },
    referralCode: { fontSize: 24, fontWeight: 'bold', color: '#1B5E20', marginVertical: 10 },
    shareButtton: { flexDirection: 'row', backgroundColor: '#4CAF50', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, alignItems: 'center' },
    shareButtonText: { color: '#FFFFFF', marginLeft: 10, fontWeight: '600' },
    button: { backgroundColor: '#0CA201', paddingVertical: 18, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 15, width: '100%' },
    buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
    menuList: { paddingHorizontal: 25 },
    menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F2F2F2' },
    menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
    menuItemText: { marginLeft: 20, fontSize: 16, color: '#181725', fontWeight: '500' },
    logoutButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30, padding: 15 },
    logoutButtonText: { color: '#D32F2F', marginLeft: 10, fontSize: 16, fontWeight: 'bold' },
});

export default ProfileScreen;