import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import moment from 'moment';

const getStatusStyle = (status) => {
    const s = (status || '').toUpperCase();
    if (s.includes('DELIVERED') || s.includes('COMPLETED')) return { backgroundColor: '#e6f9f0', color: '#28a745' };
    if (s.includes('CANCEL') || s.includes('REJECT')) return { backgroundColor: '#ffeeee', color: '#D32F2F' };
    if (s.includes('SHIPPED') || s.includes('DISPATCH')) return { backgroundColor: '#e6f2ff', color: '#007bff' };
    if (s.includes('PICKUP_ASSIGNED') || s.includes('ASSIGNED')) return { backgroundColor: '#eff6ff', color: '#2563eb' };
    if (s.includes('PICKED_UP')) return { backgroundColor: '#fef3c7', color: '#d97706' };
    if (s.includes('REFUND')) return { backgroundColor: '#ecfdf5', color: '#059669' };
    if (s.includes('REPLACE')) return { backgroundColor: '#eef2ff', color: '#4f46e5' };
    if (s.includes('OUT_FOR_DELIVERY')) return { backgroundColor: '#fff3e0', color: '#f57c00' };
    return { backgroundColor: '#f3f4f6', color: '#4b5563' };
};

const OrderCard = ({ order, onPress }) => {
    if (!order) return null;

    // Check if order has an active return or replacement request
    const retStatus = (order.return_status || '').toUpperCase();
    const isReturnActive = retStatus && !['CLOSED', 'REJECTED'].includes(retStatus);
    
    let displayStatus = (order?.order_status || 'PENDING').replace(/_/g, ' ');
    if (isReturnActive) {
        if (retStatus === 'PICKUP_ASSIGNED') {
            displayStatus = 'PICKUP ASSIGNED';
        } else if (retStatus === 'PICKED_UP') {
            displayStatus = 'ITEM PICKED UP';
        } else if (['APPROVED', 'COMPLETED'].includes(retStatus)) {
            displayStatus = (order.return_type || '').toUpperCase() === 'REPLACEMENT' ? 'REPLACEMENT DONE' : 'REFUNDED';
        } else {
            const reqType = (order.return_type || 'RETURN').toUpperCase();
            let cleanRet = retStatus.replace(/_/g, ' ');
            // Prevent duplicate prefixes like "REPLACEMENT REPLACEMENT_INITIATED"
            if (cleanRet.startsWith(reqType)) {
                displayStatus = cleanRet;
            } else {
                displayStatus = `${reqType} ${cleanRet}`;
            }
        }
    }

    const statusStyle = getStatusStyle(retStatus && isReturnActive ? retStatus : order?.order_status);
    const rawImg = order.display_image_url;
    const imageUrl = rawImg 
        ? (rawImg.startsWith('http') ? rawImg : `https://newapi.earn24.in${rawImg}`)
        : 'https://via.placeholder.com/150';

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
            <View style={styles.details}>
                <View style={styles.headerRow}>
                    <Text style={styles.orderNumber} numberOfLines={1}>
                        {order.first_item_name || order.order_number || 'Order'}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                        <Text style={[styles.statusText, { color: statusStyle.color }]} numberOfLines={1}>
                            {displayStatus}
                        </Text>
                    </View>
                </View>
                <Text style={styles.date} numberOfLines={1}>
                    Order: {order.order_number || ''} • {moment(order.created_at).format('D MMM, YYYY')}
                </Text>
                <Text style={styles.total}>Total: ₹{parseFloat(order.total_amount || 0).toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: '#fff', 
        padding: 14, 
        borderRadius: 12, 
        marginBottom: 12, 
        elevation: 2, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08, 
        shadowRadius: 4,
    },
    image: { 
        width: 60, 
        height: 60, 
        borderRadius: 8, 
        marginRight: 12, 
        backgroundColor: '#f8f9fa',
        flexShrink: 0,
    },
    details: { 
        flex: 1, 
        minWidth: 0, // CRITICAL: Allows child texts and flex items to respect parent width without squishing
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    orderNumber: { 
        flex: 1,
        minWidth: 0,
        fontSize: 15, 
        fontWeight: 'bold', 
        color: '#1e293b',
        marginRight: 8,
    },
    date: { 
        fontSize: 12, 
        color: '#64748b', 
        marginBottom: 4,
    },
    total: { 
        fontSize: 14, 
        fontWeight: '700',
        color: '#0f172a',
    },
    statusBadge: { 
        paddingHorizontal: 8, 
        paddingVertical: 3, 
        borderRadius: 6,
        flexShrink: 0,
        maxWidth: '48%',
    },
    statusText: { 
        fontSize: 10, 
        fontWeight: '700', 
        textTransform: 'uppercase',
    },
});

export default OrderCard;