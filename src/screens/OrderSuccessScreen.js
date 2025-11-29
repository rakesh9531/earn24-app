import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const OrderSuccessScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    
    // Get the order details passed from the OrderSummaryScreen
    const orderDetails = route.params?.order || {};

    const goToHome = () => {
        // Reset the navigation stack to the Home screen
        navigation.reset({
            index: 0,
            routes: [{ name: 'AppTabs' }],
        });
    };

    const goToOrders = () => {
        // Reset and navigate to Profile, then to Orders (example flow)
        navigation.reset({
            index: 0,
            routes: [{ name: 'AppTabs', params: { screen: 'Profile' } }],
        });
        // You might need a more direct navigation to a specific 'My Orders' screen later
        // For now, this takes them to the profile tab.
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Icon name="checkmark-circle" size={100} color="#28a745" />
                </View>
                <Text style={styles.title}>Order Placed Successfully!</Text>
                <Text style={styles.subtitle}>
                    Your order with ID <Text style={styles.orderNumber}>{orderDetails.orderNumber}</Text> has been confirmed.
                </Text>
                <Text style={styles.infoText}>
                    You will receive an order confirmation email with details of your order.
                </Text>

                <TouchableOpacity style={styles.primaryButton} onPress={goToOrders}>
                    <Text style={styles.primaryButtonText}>View My Orders</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={goToHome}>
                    <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#e6f9f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#343a40',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 5,
    },
    orderNumber: {
        fontWeight: 'bold',
        color: '#343a40',
    },
    infoText: {
        fontSize: 14,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 20,
    },
    primaryButton: {
        backgroundColor: '#0CA201',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#0CA201',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default OrderSuccessScreen;