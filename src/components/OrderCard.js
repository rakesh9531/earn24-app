import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import moment from 'moment';

const getStatusStyle = (status) => {
    switch (status) {
        case 'DELIVERED': return { backgroundColor: '#e6f9f0', color: '#28a745' };
        case 'SHIPPED': return { backgroundColor: '#e6f2ff', color: '#007bff' };
        case 'CANCELLED': return { backgroundColor: '#ffeeee', color: '#D32F2F' };
        default: return { backgroundColor: '#fff3e0', color: '#f57c00' }; // PENDING, CONFIRMED
    }
}

const OrderCard = ({ order, onPress }) => {
    const statusStyle = getStatusStyle(order.order_status);
    const imageUrl = order.display_image_url 
        ? `http://192.168.0.171:3000${order.display_image_url}`
        : 'https://via.placeholder.com/150';

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <View style={styles.details}>
                <Text style={styles.orderNumber}>{order.order_number}</Text>
                <Text style={styles.date}>Placed on: {moment(order.created_at).format('D MMM, YYYY')}</Text>
                <Text style={styles.total}>Total: ₹{parseFloat(order.total_amount).toFixed(2)}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                <Text style={[styles.statusText, { color: statusStyle.color }]}>{order.order_status}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, },
    image: { width: 60, height: 60, borderRadius: 8, marginRight: 15, backgroundColor: '#f0f0f0' },
    details: { flex: 1 },
    orderNumber: { fontSize: 16, fontWeight: 'bold', color: '#343a40' },
    date: { fontSize: 13, color: '#6c757d', marginVertical: 4 },
    total: { fontSize: 14, fontWeight: '500' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
    statusText: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
});

export default OrderCard;