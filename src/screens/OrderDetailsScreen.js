import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Image, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../components/CustomAlert';
import { Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

// --- Flipkart-Style Vertical Timeline Tracker Component ---
const VerticalTimelineTracker = ({ order }) => {
    const rawStatus = (order.orderStatus || 'CONFIRMED').toUpperCase();
    const existingReturn = order.return_request || order.returnRequest || null;
    const createdAtStr = moment(order.createdAt).format('D MMM YYYY, h:mm a');
    const updatedDateStr = moment(order.updatedAt || order.createdAt).format('D MMM YYYY, h:mm a');
    const deliveredDateStr = order.deliveredAt ? moment(order.deliveredAt).format('D MMM YYYY, h:mm a') : updatedDateStr;

    // Timeline Steps Data
    const steps = [
        {
            key: 'CONFIRMED',
            title: 'Order Confirmed',
            time: createdAtStr,
            description: 'Your Order has been placed and processed by seller.',
            isCompleted: true,
        },
        {
            key: 'SHIPPED',
            title: 'Shipped',
            time: ['SHIPPED', 'DISPATCHED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(rawStatus) ? updatedDateStr : '',
            description: ['SHIPPED', 'DISPATCHED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(rawStatus) 
                ? 'Item has been picked up & shipped by delivery partner.' 
                : 'Seller is preparing your order for shipment.',
            isCompleted: ['SHIPPED', 'DISPATCHED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(rawStatus),
        },
        {
            key: 'OUT_FOR_DELIVERY',
            title: 'Out For Delivery',
            time: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(rawStatus) ? updatedDateStr : '',
            description: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(rawStatus)
                ? 'Your item is out for delivery with our delivery agent.'
                : 'Pending dispatch to delivery agent.',
            isCompleted: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(rawStatus),
        },
        {
            key: 'DELIVERED',
            title: 'Delivered',
            time: rawStatus === 'DELIVERED' ? deliveredDateStr : '',
            description: rawStatus === 'DELIVERED' 
                ? 'Your item has been delivered successfully.' 
                : 'Expected delivery soon.',
            isCompleted: rawStatus === 'DELIVERED',
        }
    ];

    if (rawStatus === 'CANCELLED') {
        return (
            <View style={styles.cancelledTimelineBox}>
                <Icon name="close-circle" size={32} color="#DC2626" />
                <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#DC2626' }}>Order Cancelled</Text>
                    <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                        {order.cancellationReason || 'This order was cancelled.'}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.verticalTimelineContainer}>
            <Text style={styles.timelineHeaderTitle}>Order & Delivery Tracking</Text>
            {steps.map((step, idx) => {
                const isLast = idx === steps.length - 1;
                const dotColor = step.isCompleted ? '#16A34A' : '#CBD5E1';
                const lineActive = step.isCompleted && !isLast;

                return (
                    <View key={step.key} style={styles.timelineRow}>
                        {/* Left vertical line and dot */}
                        <View style={styles.timelineLeftColumn}>
                            <View style={[styles.verticalDot, { backgroundColor: dotColor, borderColor: step.isCompleted ? '#DCFCE7' : '#F1F5F9' }]}>
                                {step.isCompleted ? (
                                    <Icon name="checkmark" size={10} color="#FFFFFF" />
                                ) : null}
                            </View>
                            {!isLast && <View style={[styles.verticalLine, { backgroundColor: lineActive ? '#16A34A' : '#E2E8F0' }]} />}
                        </View>

                        {/* Right Content */}
                        <View style={styles.timelineRightColumn}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={[styles.stepTitle, step.isCompleted && styles.stepTitleCompleted]}>
                                    {step.title}
                                </Text>
                                {step.time ? <Text style={styles.stepTime}>{step.time}</Text> : null}
                            </View>
                            <Text style={styles.stepDescription}>{step.description}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

// --- The Main Order Details Screen Component ---
const OrderDetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { orderId } = route.params;
    const { token } = useAuth();
    const { showAlert, AlertModal } = useAlert();

    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingProduct, setIsFetchingProduct] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [refundType, setRefundType] = useState('WALLET'); // 'WALLET' | 'BANK'

    // --- Return & Replacement States ---
    const [isReturnModalVisible, setIsReturnModalVisible] = useState(false);
    const [returnReason, setReturnReason] = useState('');
    const [requestType, setRequestType] = useState('RETURN'); // 'RETURN' | 'REPLACEMENT'
    const [returnRefundMethod, setReturnRefundMethod] = useState('WALLET'); // 'WALLET' | 'UPI'
    const [customerUpiId, setCustomerUpiId] = useState('');
    const [returnEvidenceFiles, setReturnEvidenceFiles] = useState([]);
    const [selectedOrderItemId, setSelectedOrderItemId] = useState(null);
    const [returnQuantity, setReturnQuantity] = useState(1);
    const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);
    const [isTrackingModalVisible, setIsTrackingModalVisible] = useState(false);
    const [selectedTrackingReturn, setSelectedTrackingReturn] = useState(null);

    const handleOpenTrackingModal = (retItem) => {
        setSelectedTrackingReturn(retItem);
        setIsTrackingModalVisible(true);
    };

    const handleCallAgent = (phoneNumber) => {
        if (!phoneNumber) return;
        Linking.openURL(`tel:${phoneNumber}`).catch(() => {
            showAlert('info', 'Phone Call', `Agent Contact: ${phoneNumber}`);
        });
    };

    const handlePickReturnEvidence = () => {
        try {
            const { launchImageLibrary } = require('react-native-image-picker');
            const currentCount = returnEvidenceFiles ? returnEvidenceFiles.length : 0;
            if (currentCount >= 3) {
                showAlert('warning', 'Limit Reached', 'You can attach a maximum of 3 defect proof photos.');
                return;
            }
            launchImageLibrary({
                mediaType: 'photo',
                selectionLimit: 3 - currentCount,
                quality: 0.7,
                includeBase64: true
            }, (response) => {
                if (response && response.assets && response.assets.length > 0) {
                    const validImages = response.assets.map(a => a.base64 ? `data:${a.type || 'image/jpeg'};base64,${a.base64}` : a.uri);
                    setReturnEvidenceFiles(prev => [...(prev || []), ...validImages].slice(0, 3));
                }
            });
        } catch(e) {
            console.error("Evidence picker error:", e);
        }
    };

    const handleRemoveReturnEvidence = (idxToRemove) => {
        setReturnEvidenceFiles(prev => (prev || []).filter((_, idx) => idx !== idxToRemove));
    };

    // --- Review Modal States ---
    const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
    const [selectedReviewItem, setSelectedReviewItem] = useState(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [selectedMediaFiles, setSelectedMediaFiles] = useState([]);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const handleOpenReviewModal = (item) => {
        setSelectedReviewItem(item);
        setReviewRating(5);
        setReviewTitle('');
        setReviewText('');
        setSelectedMediaFiles([]);
        setIsReviewModalVisible(true);
    };

    const handlePickMedia = () => {
        try {
            const { launchImageLibrary } = require('react-native-image-picker');
            const currentCount = selectedMediaFiles ? selectedMediaFiles.length : 0;
            if (currentCount >= 5) {
                showAlert('warning', 'Limit Exceeded', 'You can upload a maximum of 5 images/videos total.');
                return;
            }
            const remainingLimit = 5 - currentCount;
            launchImageLibrary({
                mediaType: 'mixed',
                selectionLimit: remainingLimit,
                quality: 0.8,
                videoQuality: 'low'
            }, (response) => {
                if (response && response.assets && response.assets.length > 0) {
                    const validAssets = [];
                    for (const asset of response.assets) {
                        const isVid = (asset.type && asset.type.includes('video')) || (asset.fileName && (asset.fileName.toLowerCase().endsWith('.mp4') || asset.fileName.toLowerCase().endsWith('.mov')));
                        const fileSizeMB = asset.fileSize ? asset.fileSize / (1024 * 1024) : 0;
                        const durationSec = asset.duration || 0;

                        if (isVid && fileSizeMB > 15) {
                            showAlert('warning', 'Video Too Large', `Video size (${fileSizeMB.toFixed(1)}MB) exceeds maximum limit of 15MB.`);
                            continue;
                        }
                        if (isVid && durationSec > 60) {
                            showAlert('warning', 'Video Too Long', `Video length (${Math.round(durationSec)}s) exceeds maximum limit of 60 seconds.`);
                            continue;
                        }
                        validAssets.push(asset);
                    }

                    if (validAssets.length > 0) {
                        setSelectedMediaFiles(prev => {
                            const existing = prev || [];
                            const combined = [...existing, ...validAssets];
                            return combined.slice(0, 5);
                        });
                    }
                }
            });
        } catch(e) {
            console.error("Image picker error:", e);
        }
    };

    const handleRemoveMediaItem = (indexToRemove) => {
        setSelectedMediaFiles(prev => (prev || []).filter((_, idx) => idx !== indexToRemove));
    };

    const handleReviewSubmit = async () => {
        if (!selectedReviewItem) return;
        setIsSubmittingReview(true);
        try {
            const formData = new FormData();
            formData.append('product_id', selectedReviewItem.productId || selectedReviewItem.product_id);
            formData.append('order_id', order.id);
            formData.append('order_item_id', selectedReviewItem.id);
            if (selectedReviewItem.sellerProductId || selectedReviewItem.seller_product_id) {
                formData.append('seller_product_id', selectedReviewItem.sellerProductId || selectedReviewItem.seller_product_id);
            }
            formData.append('rating', reviewRating.toString());
            formData.append('review_title', reviewTitle.trim());
            formData.append('review_text', reviewText.trim());

            if (selectedMediaFiles && selectedMediaFiles.length > 0) {
                selectedMediaFiles.forEach((file, index) => {
                    formData.append('media', {
                        uri: file.uri,
                        type: file.type || 'image/jpeg',
                        name: file.fileName || `review_media_${index}.jpg`,
                    });
                });
            }

            const { postReview } = require('../services/reviewService');
            const res = await postReview(formData);
            if (res && res.status) {
                showAlert('success', 'Review Submitted', res.message || 'Thank you for rating & reviewing this product!');
                setIsReviewModalVisible(false);
                fetchOrderDetails();
            } else {
                showAlert('error', 'Submission Failed', res?.message || 'Could not submit review.');
            }
        } catch (e) {
            console.error("Review submit error:", e);
            showAlert('error', 'Error', 'Failed to submit review. Please try again.');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const fetchOrderDetails = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await orderService.getOrderDetails(orderId);
            if (response.status) {
                setOrder(response.data);
                navigation.setOptions({ title: `Order #${response.data.orderNumber}` });
            }
        } catch (error) {
            console.error("Failed to fetch order details", error);
        } finally {
            setIsLoading(false);
        }
    }, [orderId, navigation]);

    const handleReturnSubmit = async () => {
        if (!returnReason.trim()) {
            showAlert('warning', 'Reason Required', 'Please enter a reason for your return or replacement request.');
            return;
        }

        const activeReturns = (order.return_requests || (order.return_request ? [order.return_request] : []));
        const eligibleItems = (order.items || []).filter(it => {
            if (it.itemStatus === 'CANCELLED') return false;
            const hasActive = activeReturns.some(r => r.order_item_id == it.id && !['REJECTED', 'CLOSED'].includes(r.status));
            return !hasActive;
        });
        const targetItemId = selectedOrderItemId || eligibleItems[0]?.id || order.items[0]?.id;

        setIsSubmittingReturn(true);
        try {
            const res = await orderService.requestReturn(
                order.id, 
                returnReason.trim(), 
                requestType, 
                targetItemId,
                'WALLET', // Always 100% Earn24 Wallet Refund
                '',
                returnEvidenceFiles,
                returnQuantity || 1
            );
            if (res && res.status) {
                showAlert('success', 'Request Submitted', res.message || "Your return/replacement request has been submitted successfully for approval.");
                setReturnReason('');
                setCustomerUpiId('');
                setReturnEvidenceFiles([]);
                setReturnQuantity(1);
                setSelectedOrderItemId(null);
                setIsReturnModalVisible(false);
                fetchOrderDetails();
            } else {
                showAlert('error', 'Submission Error', res?.message || "Failed to submit request.");
            }
        } catch (e) {
            const errObj = typeof e === 'object' ? e : {};
            if (errObj.code === 'OUT_OF_STOCK_FOR_REPLACEMENT' || (errObj.message && errObj.message.includes('out of stock'))) {
                showAlert('confirm', 'Item Out of Stock', 'This item is currently out of stock for replacement. Would you like to request a Refund Return instead?', {
                    confirmText: 'Yes, Request Refund',
                    cancelText: 'Cancel',
                    onConfirm: () => {
                        setRequestType('RETURN');
                    }
                });
            } else {
                const errMsg = typeof e === 'string' ? e : (e.message || e.error || "Failed to submit request. Please try again.");
                showAlert('error', 'Submission Error', errMsg);
            }
        } finally {
            setIsSubmittingReturn(false);
        }
    };

    const handleCancelOrderSubmit = async () => {
        if (!cancelReason.trim()) {
            showAlert('warning', 'Reason Required', 'Please enter a reason for cancelling this order.');
            return;
        }

        setIsCancelling(true);
        try {
            const response = await orderService.cancelOrder(order.id, cancelReason.trim(), refundType);
            if (response.status) {
                const msg = response.message || "Your order has been cancelled successfully.";
                showAlert('success', 'Order Cancelled', msg);
                setCancelReason('');
                setIsCancelModalVisible(false);
                fetchOrderDetails(); // Refresh details
            } else {
                showAlert('error', 'Error', response.message || "Failed to cancel order.");
            }
        } catch (error) {
            console.error("Order cancel failed:", error);
            const errMsg = error.message || "Failed to cancel order. Please try again.";
            showAlert('error', 'Error', errMsg);
        } finally {
            setIsCancelling(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchOrderDetails();
        }, [fetchOrderDetails])
    );

    const handleCancelItem = (item) => {
        showAlert('confirm', 'Cancel Item?', `Are you sure you want to cancel '${item.productName}' from this order?`, {
            confirmText: 'Yes, Cancel Item',
            cancelText: 'No',
            onConfirm: async () => {
                try {
                    setIsCancelling(true);
                    const response = await orderService.cancelOrderItem(order.id, item.id, 'Cancelled by customer');
                    if (response.status) {
                        showAlert('success', 'Success', 'Item cancelled successfully! Refund has been credited to your wallet.', {
                            onConfirm: () => fetchOrderDetails()
                        });
                    } else {
                        showAlert('error', 'Error', response.message || 'Failed to cancel item.');
                    }
                } catch (err) {
                    showAlert('error', 'Error', err.message || 'An error occurred while cancelling item.');
                } finally {
                    setIsCancelling(false);
                }
            }
        });
    };

    const handleDownloadInvoice = () => {
        if (!order || !token) return;
        const url = orderService.getInvoiceUrl(order.id, token);
        Linking.openURL(url).catch(err => {
            console.error("Failed to open invoice URL", err);
            Alert.alert("Error", "Could not open the invoice. Please try again later.");
        });
    };

    const handleItemPress = async (productId, isSellerProduct = false) => {
        if (isFetchingProduct) return;
        setIsFetchingProduct(true);
        try {
            const { productService } = require('../services/productService');
            const response = await productService.getProductById(productId, isSellerProduct);
            if (response.status) {
                navigation.navigate('ProductDetails', { product: response.data });
            } else {
                Alert.alert('Error', response.message || 'Product details could not be found.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while fetching product details.');
            console.error("Failed to fetch product for details page:", error);
        } finally {
            setIsFetchingProduct(false);
        }
    };

    if (isLoading) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#0CA201" /></View>;
    }

    if (!order) {
        return <View style={styles.centered}><Text>Order not found.</Text></View>;
    }

    let returnList = [];
    if (Array.isArray(order.return_requests) && order.return_requests.length > 0) {
        returnList = [...order.return_requests];
    } else if (Array.isArray(order.returnRequests) && order.returnRequests.length > 0) {
        returnList = [...order.returnRequests];
    } else if (order.returnRequest) {
        returnList = [order.returnRequest];
    } else if (order.return_request) {
        returnList = [order.return_request];
    }

    // Also collect item-level return requests if returnList is still empty
    if (returnList.length === 0 && Array.isArray(order.items)) {
        const itemReturns = order.items
            .map(i => i.return_request || i.returnRequest)
            .filter(Boolean);
        if (itemReturns.length > 0) {
            returnList = itemReturns;
        }
    }

    // Fallback if order has return status or return type
    const activeOrderReturnStatus = order.return_status || order.returnStatus || (order.order_status?.startsWith('RETURN') ? order.order_status : null) || (order.orderStatus?.startsWith('RETURN') ? order.orderStatus : null);
    if (returnList.length === 0 && activeOrderReturnStatus && !['CLOSED', 'REJECTED'].includes(String(activeOrderReturnStatus).toUpperCase())) {
        returnList = [{
            id: order.id,
            order_id: order.id,
            status: activeOrderReturnStatus,
            request_type: order.return_type || order.returnType || 'RETURN',
            refund_method: order.refund_method || 'WALLET',
            refund_amount: order.totalAmount || order.total_amount,
            created_at: order.updatedAt || order.createdAt
        }];
    }

    const isPaid = (order.paymentStatus || '').toUpperCase() === 'PAID' || (order.paymentStatus || '').toUpperCase() === 'SUCCESS' || (order.paymentMethod || '').toUpperCase() === 'WALLET';
    const unlockDateStr = moment(order.deliveredAt || order.updatedAt || order.createdAt).add(order.returnWindowDays || 7, 'days').format('D MMM YYYY');

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
                
                {/* --- BEAUTIFUL RETURN & REPLACEMENT DYNAMIC TRACKING CARDS --- */}
                {returnList && returnList.length > 0 && returnList.map((retItem, rIdx) => {
                    const isRep = (retItem.request_type || retItem.return_type) === 'REPLACEMENT';
                    const retStatus = (retItem.status || 'PENDING').toUpperCase();
                    const matchingItem = (order.items || []).find(i => i.id == retItem.order_item_id) || order.items?.[0] || {};
                    
                    let statusBg = '#FEF3C7';
                    let statusTextColor = '#B45309';
                    let statusLabel = 'Request Under Review';

                    if (['APPROVED', 'MERCHANT_ACCEPTED'].includes(retStatus)) {
                        statusBg = '#EFF6FF';
                        statusTextColor = '#1D4ED8';
                        statusLabel = 'Request Approved';
                    } else if (['PICKUP_ASSIGNED', 'OUT_FOR_PICKUP'].includes(retStatus)) {
                        statusBg = '#F3E8FF';
                        statusTextColor = '#7E22CE';
                        statusLabel = 'Pickup Assigned';
                    } else if (['PICKED_UP', 'IN_TRANSIT_TO_HUB'].includes(retStatus)) {
                        statusBg = '#CCFBF1';
                        statusTextColor = '#0F766E';
                        statusLabel = 'Item Picked Up';
                    } else if (retStatus === 'RECEIVED_AT_HUB') {
                        statusBg = '#E0E7FF';
                        statusTextColor = '#3730A3';
                        statusLabel = 'Received at Warehouse';
                    } else if (['REFUNDED', 'COMPLETED'].includes(retStatus) || (retStatus === 'PICKED_UP' && (retItem.refund_status || '').toUpperCase() === 'COMPLETED')) {
                        statusBg = '#DCFCE7';
                        statusTextColor = '#15803D';
                        statusLabel = isRep ? 'Replacement Done' : 'Refund Settled';
                    } else if (retStatus === 'REPLACEMENT_DISPATCHED') {
                        statusBg = '#ECFDF5';
                        statusTextColor = '#047857';
                        statusLabel = 'Replacement Sent';
                    } else if (retStatus === 'REJECTED') {
                        statusBg = '#FEE2E2';
                        statusTextColor = '#991B1B';
                        statusLabel = 'Request Rejected';
                    }

                    return (
                        <View key={retItem.id || rIdx} style={styles.premiumReturnCard}>
                            {/* Card Header */}
                            <View style={styles.premiumReturnHeader}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <View style={[styles.retTypeIconCircle, { backgroundColor: isRep ? '#EFF6FF' : '#F0FDF4' }]}>
                                        <Icon name={isRep ? "repeat-outline" : "return-down-back-outline"} size={18} color={isRep ? "#2563EB" : "#16A34A"} />
                                    </View>
                                    <View style={{ marginLeft: 10, flex: 1 }}>
                                        <Text style={styles.premiumReturnCardTitle}>
                                            {isRep ? 'Replacement in Progress' : 'Return & Refund in Progress'}
                                        </Text>
                                        <Text style={styles.premiumReturnSubtext}>
                                            Request #REQ-{retItem.id} • {retItem.created_at ? moment(retItem.created_at).format('D MMM YYYY') : ''}
                                        </Text>
                                    </View>
                                </View>

                                {/* Status Badge */}
                                <View style={[styles.premiumStatusBadge, { backgroundColor: statusBg }]}>
                                    <Text style={[styles.premiumStatusText, { color: statusTextColor }]}>
                                        {statusLabel}
                                    </Text>
                                </View>
                            </View>

                            {/* Product Snapshot Strip */}
                            <View style={styles.productSnapshotStrip}>
                                <Image 
                                    source={{ uri: matchingItem.imageUrl ? (matchingItem.imageUrl.startsWith('http') ? matchingItem.imageUrl : `https://newapi.earn24.in${matchingItem.imageUrl}`) : 'https://via.placeholder.com/150' }}
                                    style={styles.snapshotThumb}
                                />
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <Text style={styles.snapshotName} numberOfLines={1}>{matchingItem.productName || 'Product Item'}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                        <View style={styles.qtyBadgePill}>
                                            <Text style={styles.qtyBadgePillText}>Qty: {retItem.return_quantity || 1}</Text>
                                        </View>
                                        <Text style={styles.snapshotRefundAmt}>
                                            ₹{parseFloat(retItem.refund_amount || matchingItem.totalPrice || 0).toFixed(2)}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Doorstep Pickup Agent & Info Box */}
                            {['PICKUP_ASSIGNED', 'OUT_FOR_PICKUP'].includes(retStatus) && (
                                <View style={styles.handshakeBox}>
                                    <View style={styles.handshakeHeader}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                            <Icon name="bicycle" size={18} color="#7E22CE" />
                                            <Text style={styles.handshakeAgentName}>
                                                {retItem.agent_name || 'Assigned Delivery Partner'}
                                            </Text>
                                        </View>
                                        {retItem.agent_phone ? (
                                            <TouchableOpacity 
                                                style={styles.callAgentButton}
                                                onPress={() => handleCallAgent(retItem.agent_phone)}
                                            >
                                                <Icon name="call" size={12} color="#FFFFFF" />
                                                <Text style={styles.callAgentButtonText}>Call Partner</Text>
                                            </TouchableOpacity>
                                        ) : null}
                                    </View>

                                    {retItem.pickup_scheduled_date ? (
                                        <Text style={styles.handshakeDateText}>
                                            📅 Scheduled Pickup: {moment(retItem.pickup_scheduled_date).format('D MMM YYYY')}
                                        </Text>
                                    ) : null}
                                </View>
                            )}

                            {/* In-Transit to Hub / Store Callout */}
                            {['PICKED_UP', 'IN_TRANSIT_TO_HUB'].includes(retStatus) && (
                                <View style={styles.inTransitCallout}>
                                    <Icon name="cube-outline" size={20} color="#0F766E" />
                                    <View style={{ marginLeft: 8, flex: 1 }}>
                                        <Text style={styles.inTransitTitle}>Defective Item Collected</Text>
                                        <Text style={styles.inTransitSub}>Partner has verified & collected your item at doorstep. In transit to Store/Hub.</Text>
                                    </View>
                                </View>
                            )}

                            {/* Hub Received Callout */}
                            {retStatus === 'RECEIVED_AT_HUB' && (
                                <View style={[styles.inTransitCallout, { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }]}>
                                    <Icon name="checkmark-done-circle" size={20} color="#4338CA" />
                                    <View style={{ marginLeft: 8, flex: 1 }}>
                                        <Text style={[styles.inTransitTitle, { color: '#3730A3' }]}>Received at Warehouse / Store</Text>
                                        <Text style={[styles.inTransitSub, { color: '#4F46E5' }]}>Item safely reached seller. Payout / replacement resolution is finalizing.</Text>
                                    </View>
                                </View>
                            )}

                            {/* Refund Settlement Callout */}
                            {(['REFUNDED', 'COMPLETED'].includes(retStatus) || (retStatus === 'PICKED_UP' && (retItem.refund_status || '').toUpperCase() === 'COMPLETED')) && (
                                <View style={styles.refundSettledBox}>
                                    <Icon name="checkmark-circle" size={22} color="#16A34A" />
                                    <View style={{ marginLeft: 10, flex: 1 }}>
                                        <Text style={styles.refundSettledTitle}>
                                            {isRep ? 'Replacement Order Completed' : 'Refund Successfully Settled'}
                                        </Text>
                                        <Text style={styles.refundSettledSub}>
                                            {isRep 
                                                ? 'Fresh replacement product delivered to your doorstep.' 
                                                : ((retItem.refund_method || '').toUpperCase() === 'UPI'
                                                    ? `₹${parseFloat(retItem.refund_amount || 0).toFixed(2)} transferred to UPI ${retItem.customer_upi_id || ''}${retItem.refund_utr ? ' (UTR: ' + retItem.refund_utr + ')' : ''}`
                                                    : `₹${parseFloat(retItem.refund_amount || 0).toFixed(2)} instantly credited to your Earn24 Wallet`)}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* Replacement Dispatched Callout */}
                            {retStatus === 'REPLACEMENT_DISPATCHED' && (
                                <View style={[styles.refundSettledBox, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
                                    <Icon name="rocket-outline" size={22} color="#059669" />
                                    <View style={{ marginLeft: 10, flex: 1 }}>
                                        <Text style={[styles.refundSettledTitle, { color: '#065F46' }]}>Fresh Replacement Dispatched!</Text>
                                        <Text style={[styles.refundSettledSub, { color: '#047857' }]}>
                                            Child Order #{retItem.replacement_order_id || 'REPL'} on the way.
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* Rejection Details Callout */}
                            {retStatus === 'REJECTED' && (
                                <View style={[styles.refundSettledBox, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
                                    <Icon name="close-circle" size={24} color="#DC2626" />
                                    <View style={{ marginLeft: 10, flex: 1 }}>
                                        <Text style={[styles.refundSettledTitle, { color: '#991B1B' }]}>
                                            {isRep ? 'Replacement Request Rejected' : 'Return Request Rejected'}
                                        </Text>
                                        <Text style={[styles.refundSettledSub, { color: '#B91C1C', marginTop: 4, lineHeight: 18 }]}>
                                            <Text style={{ fontWeight: '700' }}>Reason: </Text>
                                            {retItem.reject_reason || retItem.admin_remarks || retItem.rejection_reason || retItem.merchant_notes || 'Request was not approved by seller/admin.'}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* Clickable "See All Status" Action Bar */}
                            <TouchableOpacity 
                                style={styles.seeStatusActionRow}
                                onPress={() => handleOpenTrackingModal(retItem)}
                                activeOpacity={0.7}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Icon name="time-outline" size={16} color="#0CA201" />
                                    <Text style={styles.seeStatusActionText}>See All Status & Full Timeline</Text>
                                </View>
                                <View style={styles.seeStatusChevronCircle}>
                                    <Icon name="chevron-forward" size={14} color="#0CA201" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    );
                })}

                {/* --- FLIPKART-STYLE VERTICAL TIMELINE TRACKER --- */}
                <View style={styles.section}>
                    <View style={styles.headerRow}>
                        <Text style={styles.orderIdText}>Order ID: {order.orderNumber}</Text>
                        <View style={[styles.paymentBadge, isPaid ? styles.paidBadge : styles.pendingBadge]}>
                            <Text style={[styles.paymentBadgeText, isPaid ? styles.paidText : styles.pendingText]}>
                                {isPaid ? 'PAID' : 'PENDING'}
                            </Text>
                        </View>
                    </View>
                    <VerticalTimelineTracker order={order} />
                </View>

                {/* --- 7-DAY BV & CASHBACK PROTECTION LOCK INDICATOR BANNER --- */}
                {order.orderStatus === 'DELIVERED' && (
                    <View style={styles.lockBannerCard}>
                        <Icon name="lock-closed" size={22} color="#0369A1" />
                        <View style={{ marginLeft: 10, flex: 1 }}>
                            <Text style={styles.lockBannerTitle}>Cashback & BV Protection Hold</Text>
                            <Text style={styles.lockBannerSubtitle}>
                                Cashback & BV earnings will unlock on <Text style={{ fontWeight: '700', color: '#0369A1' }}>{unlockDateStr}</Text> (after 7-day return policy window expires).
                            </Text>
                        </View>
                    </View>
                )}

                {/* --- ITEMS ORDERED --- */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Items Ordered ({Array.isArray(order.items) ? order.items.length : 0})</Text>
                    {(Array.isArray(order.items) ? order.items : []).map((item, index) => (
                        <View key={item.id || index} style={[styles.itemCardContainer, item.itemStatus === 'CANCELLED' && { opacity: 0.65 }]}>
                            <TouchableOpacity
                                style={styles.itemRow}
                                onPress={() => {
                                    const pid = item.productId || item.product_id;
                                    const spid = item.sellerProductId || item.seller_product_id;
                                    if (pid) {
                                        handleItemPress(pid, false);
                                    } else if (spid) {
                                        handleItemPress(spid, true);
                                    }
                                }}
                                activeOpacity={0.7}
                                disabled={isFetchingProduct}
                            >
                                <Image 
                                    source={{ uri: item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : `https://newapi.earn24.in${item.imageUrl}`) : 'https://via.placeholder.com/150' }} 
                                    style={styles.itemImage} 
                                />
                                <View style={styles.itemDetails}>
                                    <Text style={styles.itemName}>{item.productName || 'Product'}</Text>

                                    {/* Brand & Variant Pill Badges */}
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 4 }}>
                                        {item.brandName ? (
                                            <View style={styles.miniBadgeGray}>
                                                <Text style={styles.miniBadgeText}>🏷️ {item.brandName}</Text>
                                            </View>
                                        ) : null}
                                        {item.variantTitle || (item.attributesSnapshot && item.attributesSnapshot['Color']) ? (
                                            <View style={styles.miniBadgeBlue}>
                                                <Text style={styles.miniBadgeTextBlue}>🎨 {item.variantTitle || item.attributesSnapshot['Color']}</Text>
                                            </View>
                                        ) : null}
                                        {item.sku ? (
                                            <View style={styles.miniBadgeGray}>
                                                <Text style={styles.miniBadgeText}>SKU: {item.sku}</Text>
                                            </View>
                                        ) : null}
                                    </View>

                                    <Text style={styles.itemQuantity}>Quantity: {item.quantity || 1}</Text>
                                    {item.itemStatus === 'CANCELLED' && (
                                        <View style={styles.cancelledBadge}>
                                            <Text style={styles.cancelledBadgeText}>CANCELLED</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={[styles.itemPrice, item.itemStatus === 'CANCELLED' && { textDecorationLine: 'line-through', color: '#94A3B8' }]}>
                                    ₹{parseFloat(item.totalPrice || 0).toFixed(2)}
                                </Text>
                            </TouchableOpacity>

                            {item.itemStatus !== 'CANCELLED' && ['PENDING', 'PENDING_PAYMENT', 'CONFIRMED', 'PROCESSING'].includes(order.orderStatus) && (
                                <TouchableOpacity
                                    style={styles.cancelItemBtn}
                                    onPress={() => handleCancelItem(item)}
                                    disabled={isCancelling}
                                >
                                    <Icon name="close-circle-outline" size={16} color="#DC2626" />
                                    <Text style={styles.cancelItemBtnText}>Cancel Item</Text>
                                </TouchableOpacity>
                            )}

                            {order.orderStatus === 'DELIVERED' && item.itemStatus !== 'CANCELLED' && (
                                <TouchableOpacity
                                    style={styles.rateProductBtn}
                                    onPress={() => handleOpenReviewModal(item)}
                                >
                                    <Icon name="star" size={14} color="#F59E0B" />
                                    <Text style={styles.rateProductBtnText}>Rate & Review Product</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </View>

                {/* --- SHIPPING ADDRESS --- */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Shipping Address</Text>
                    {order.shippingAddress ? (
                        <View style={styles.addressCard}>
                            <Text style={styles.addressName}>{order.shippingAddress.fullName || 'Customer'}</Text>
                            <Text style={styles.addressText}>{`${order.shippingAddress.addressLine1 || ''}${order.shippingAddress.addressLine2 ? ', ' + order.shippingAddress.addressLine2 : ''}`}</Text>
                            <Text style={styles.addressText}>{`${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''} - ${order.shippingAddress.pincode || ''}`}</Text>
                        </View>
                    ) : (
                        <View style={styles.addressCard}>
                            <Text style={styles.addressText}>Address details not available</Text>
                        </View>
                    )}
                </View>

                {/* --- PAYMENT SUMMARY --- */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Summary</Text>
                    <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Payment Method</Text><Text style={[styles.summaryValue, { fontWeight: '700' }]}>{order.paymentMethod || 'ONLINE'}</Text></View>
                    <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>₹{parseFloat(order.subtotal || 0).toFixed(2)}</Text></View>
                    <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Delivery Fee</Text><Text style={styles.summaryValue}>₹{parseFloat(order.deliveryFee || 0).toFixed(2)}</Text></View>
                    <View style={styles.totalRow}><Text style={styles.totalLabel}>Grand Total</Text><Text style={styles.totalValue}>₹{parseFloat(order.totalAmount || 0).toFixed(2)}</Text></View>
                </View>

                {/* --- DOWNLOAD INVOICE & RETURN/REPLACEMENT BUTTONS --- */}
                {order.orderStatus === 'DELIVERED' && (() => {
                    const activeReturns = (order.return_requests || (order.return_request ? [order.return_request] : []));
                    const eligibleItems = (order.items || []).filter(it => {
                        if (it.itemStatus === 'CANCELLED') return false;
                        const hasActive = activeReturns.some(r => r.order_item_id == it.id && !['REJECTED', 'CLOSED'].includes(r.status));
                        if (hasActive) return false;
                        const canRet = it.has_return_policy === 1 || it.has_return_policy === '1' || it.has_return_policy === true;
                        const canRep = it.is_replacement_available === 1 || it.is_replacement_available === '1' || it.is_replacement_available === true;
                        return canRet || canRep;
                    });
                    const hasEligibleItems = eligibleItems.length > 0;
                    const returnWindowDays = order.returnWindowDays || 7;
                    const deliveryDate = order.deliveredAt || order.updatedAt || order.createdAt;
                    const daysSinceDelivery = moment().diff(moment(deliveryDate), 'days');
                    const isWithinWindow = daysSinceDelivery <= returnWindowDays;

                    return (
                        <View style={{ marginTop: 15 }}>
                            <TouchableOpacity 
                                style={styles.invoiceButton} 
                                onPress={handleDownloadInvoice}
                            >
                                <Icon name="download-outline" size={20} color="#fff" />
                                <Text style={styles.invoiceButtonText}>Download Invoice (PDF)</Text>
                            </TouchableOpacity>

                            {hasEligibleItems && isWithinWindow && (
                                <TouchableOpacity 
                                    style={[styles.invoiceButton, { backgroundColor: '#FF9800', marginTop: 10 }]} 
                                    onPress={() => {
                                        const firstItem = eligibleItems[0];
                                        const canRet = firstItem ? (firstItem.has_return_policy === 1 || firstItem.has_return_policy === '1' || firstItem.has_return_policy === true) : true;
                                        setSelectedOrderItemId(firstItem?.id || null);
                                        setReturnQuantity(1);
                                        setRequestType(canRet ? 'RETURN' : 'REPLACEMENT');
                                        setIsReturnModalVisible(true);
                                    }}
                                >
                                    <Icon name="refresh-outline" size={20} color="#fff" />
                                    <Text style={styles.invoiceButtonText}>Request Return / Replacement</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                })()}

                {/* --- CANCEL ORDER BUTTON --- */}
                {['PENDING', 'PENDING_PAYMENT', 'CONFIRMED'].includes(order.orderStatus) && (
                    <TouchableOpacity 
                        style={[styles.cancelOrderButton, isCancelling && styles.disabledButton]} 
                        onPress={() => setIsCancelModalVisible(true)}
                        disabled={isCancelling}
                    >
                        {isCancelling ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <Icon name="close-circle-outline" size={20} color="#fff" />
                                <Text style={styles.cancelOrderButtonText}>Cancel Order</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}

            </ScrollView>

            {/* --- RETURN / REPLACEMENT MODAL --- */}
            <Modal
                visible={isReturnModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsReturnModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>7-Day Return / Replacement</Text>
                        <Text style={styles.modalSubtitle}>Select request type and provide a reason:</Text>

                        {/* Select Item to Return if order has multiple items */}
                        {Array.isArray(order?.items) && order.items.filter(i => i.itemStatus !== 'CANCELLED').length > 1 && (() => {
                            const activeReturns = (order.return_requests || (order.return_request ? [order.return_request] : []));
                            const eligibleItems = order.items.filter(it => {
                                if (it.itemStatus === 'CANCELLED') return false;
                                return !activeReturns.some(r => r.order_item_id == it.id && !['REJECTED', 'CLOSED'].includes(r.status));
                            });
                            return (
                                <View style={{ width: '100%', marginVertical: 8 }}>
                                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', marginBottom: 6 }}>Select Item to Return/Replace:</Text>
                                    {order.items.filter(i => i.itemStatus !== 'CANCELLED').map((item) => {
                                        const hasActive = activeReturns.some(r => r.order_item_id == item.id && !['REJECTED', 'CLOSED'].includes(r.status));
                                        const itemCanRet = item.has_return_policy === 1 || item.has_return_policy === '1' || item.has_return_policy === true;
                                        const itemCanRep = item.is_replacement_available === 1 || item.is_replacement_available === '1' || item.is_replacement_available === true;
                                        const isNonReturnable = !itemCanRet && !itemCanRep;
                                        const isSelected = selectedOrderItemId === item.id || (!selectedOrderItemId && eligibleItems[0]?.id === item.id);
                                        return (
                                            <TouchableOpacity 
                                                key={item.id}
                                                disabled={hasActive || isNonReturnable}
                                                style={[{ flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 8, borderWidth: 1.5, borderColor: '#CBD5E1', marginBottom: 6 }, isSelected && { borderColor: '#0CA201', backgroundColor: '#F0FDF4' }, (hasActive || isNonReturnable) && { opacity: 0.55, backgroundColor: '#F1F5F9' }]}
                                                onPress={() => {
                                                    setSelectedOrderItemId(item.id);
                                                    setReturnQuantity(1);
                                                    if (!itemCanRet && itemCanRep) {
                                                        setRequestType('REPLACEMENT');
                                                    } else if (itemCanRet && !itemCanRep) {
                                                        setRequestType('RETURN');
                                                    }
                                                }}
                                            >
                                                <Icon name={hasActive ? "close-circle" : isNonReturnable ? "ban-outline" : (isSelected ? "checkmark-circle" : "ellipse-outline")} size={20} color={hasActive ? "#94A3B8" : isNonReturnable ? "#EF4444" : (isSelected ? "#0CA201" : "#64748B")} />
                                                <View style={{ marginLeft: 8, flex: 1 }}>
                                                    <Text style={{ fontSize: 13, color: '#1E293B' }} numberOfLines={1}>{item.productName}</Text>
                                                    {hasActive && <Text style={{ fontSize: 10, color: '#EA580C', fontWeight: '700' }}>Request in progress</Text>}
                                                    {isNonReturnable && <Text style={{ fontSize: 10, color: '#EF4444', fontWeight: '700' }}>Non-Returnable Item</Text>}
                                                    {!isNonReturnable && !itemCanRet && itemCanRep && <Text style={{ fontSize: 10, color: '#2563EB', fontWeight: '700' }}>Replacement Only</Text>}
                                                </View>
                                                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B' }}>₹{parseFloat(item.totalPrice || 0).toFixed(2)}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            );
                        })()}

                        {/* Quantity Selector if selected item ordered quantity > 1 */}
                        {(() => {
                            const activeReturns = (order?.return_requests || (order?.return_request ? [order.return_request] : []));
                            const eligibleItems = (order?.items || []).filter(it => {
                                if (it.itemStatus === 'CANCELLED') return false;
                                return !activeReturns.some(r => r.order_item_id == it.id && !['REJECTED', 'CLOSED'].includes(r.status));
                            });
                            const currentTargetItem = (order?.items || []).find(i => i.id === (selectedOrderItemId || eligibleItems[0]?.id)) || order?.items?.[0];
                            const maxQty = currentTargetItem ? (parseInt(currentTargetItem.quantity) || 1) : 1;

                            if (maxQty <= 1) return null;

                            return (
                                <View style={{ width: '100%', marginVertical: 6, padding: 10, backgroundColor: '#F8FAFC', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B' }}>Return / Replace Quantity</Text>
                                        <Text style={{ fontSize: 11, color: '#64748B' }}>Total ordered: {maxQty} units</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 6, borderWidth: 1, borderColor: '#CBD5E1' }}>
                                        <TouchableOpacity 
                                            style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                                            onPress={() => setReturnQuantity(prev => Math.max(1, prev - 1))}
                                            disabled={returnQuantity <= 1}
                                        >
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: returnQuantity <= 1 ? '#CBD5E1' : '#1E293B' }}>−</Text>
                                        </TouchableOpacity>
                                        <Text style={{ paddingHorizontal: 12, fontSize: 14, fontWeight: '700', color: '#1E293B' }}>{returnQuantity}</Text>
                                        <TouchableOpacity 
                                            style={{ paddingHorizontal: 12, paddingVertical: 6 }}
                                            onPress={() => setReturnQuantity(prev => Math.min(maxQty, prev + 1))}
                                            disabled={returnQuantity >= maxQty}
                                        >
                                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: returnQuantity >= maxQty ? '#CBD5E1' : '#1E293B' }}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        })()}

                        {/* Request Type Selector with Policy Enforcement */}
                        {(() => {
                            const activeReturns = (order?.return_requests || (order?.return_request ? [order.return_request] : []));
                            const eligibleItems = (order?.items || []).filter(it => {
                                if (it.itemStatus === 'CANCELLED') return false;
                                return !activeReturns.some(r => r.order_item_id == it.id && !['REJECTED', 'CLOSED'].includes(r.status));
                            });
                            const currentTargetItem = (order?.items || []).find(i => i.id === (selectedOrderItemId || eligibleItems[0]?.id)) || order?.items?.[0];
                            const canRet = currentTargetItem ? (currentTargetItem.has_return_policy === 1 || currentTargetItem.has_return_policy === '1' || currentTargetItem.has_return_policy === true) : true;
                            const canRep = currentTargetItem ? (currentTargetItem.is_replacement_available === 1 || currentTargetItem.is_replacement_available === '1' || currentTargetItem.is_replacement_available === true) : true;

                            return (
                                <View style={{ width: '100%', marginVertical: 10 }}>
                                    {!canRet && canRep && (
                                        <View style={{ backgroundColor: '#EFF6FF', padding: 10, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#BFDBFE', flexDirection: 'row', alignItems: 'center' }}>
                                            <Icon name="information-circle" size={18} color="#2563EB" style={{ marginRight: 6 }} />
                                            <Text style={{ fontSize: 12, color: '#1E40AF', fontWeight: '600', flex: 1 }}>
                                                This product is eligible for Replacement only (Non-Refundable).
                                            </Text>
                                        </View>
                                    )}
                                    {canRet && !canRep && (
                                        <View style={{ backgroundColor: '#F0FDF4', padding: 10, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#BBF7D0', flexDirection: 'row', alignItems: 'center' }}>
                                            <Icon name="information-circle" size={18} color="#16A34A" style={{ marginRight: 6 }} />
                                            <Text style={{ fontSize: 12, color: '#15803D', fontWeight: '600', flex: 1 }}>
                                                This product is eligible for Return & Refund only.
                                            </Text>
                                        </View>
                                    )}
                                    <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
                                        {canRet && (
                                            <TouchableOpacity 
                                                style={[{ flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1.5, borderColor: '#CBD5E1', alignItems: 'center' }, requestType === 'RETURN' && { borderColor: '#0CA201', backgroundColor: '#F0FDF4' }]}
                                                onPress={() => setRequestType('RETURN')}
                                            >
                                                <Text style={[{ fontWeight: '600', color: '#64748B' }, requestType === 'RETURN' && { color: '#0CA201', fontWeight: '700' }]}>↩️ Refund</Text>
                                            </TouchableOpacity>
                                        )}
                                        {canRep && (
                                            <TouchableOpacity 
                                                style={[{ flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1.5, borderColor: '#CBD5E1', alignItems: 'center' }, requestType === 'REPLACEMENT' && { borderColor: '#0CA201', backgroundColor: '#F0FDF4' }]}
                                                onPress={() => setRequestType('REPLACEMENT')}
                                            >
                                                <Text style={[{ fontWeight: '600', color: '#64748B' }, requestType === 'REPLACEMENT' && { color: '#0CA201', fontWeight: '700' }]}>🔄 Replace</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            );
                        })()}

                        {/* If RETURN: 100% Refund to Earn24 Wallet */}
                        {requestType === 'RETURN' && (
                            <View style={{ width: '100%', marginBottom: 14, backgroundColor: '#F0FDF4', padding: 12, borderRadius: 10, borderWidth: 1.5, borderColor: '#86EFAC', flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                                    <Icon name="wallet-outline" size={22} color="#16A34A" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#166534' }}>
                                            Refund to Earn24 Wallet
                                        </Text>
                                        <View style={{ backgroundColor: '#16A34A', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 6 }}>
                                            <Text style={{ fontSize: 9, fontWeight: '800', color: '#FFFFFF' }}>INSTANT</Text>
                                        </View>
                                    </View>
                                    <Text style={{ fontSize: 11, color: '#15803D', marginTop: 2, lineHeight: 15 }}>
                                        100% refund will be credited to your Earn24 Wallet instantly upon doorstep pickup verification.
                                    </Text>
                                </View>
                            </View>
                        )}

                        <TextInput
                            style={styles.textInput}
                            placeholder="Reason for return/replacement (e.g., Damaged item, Wrong size, Defective)"
                            placeholderTextColor="#999"
                            value={returnReason}
                            onChangeText={setReturnReason}
                            multiline={true}
                            numberOfLines={3}
                        />

                        {/* Defect Proof Photo / Media Picker */}
                        <View style={{ width: '100%', marginBottom: 12 }}>
                            <TouchableOpacity 
                                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9', paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1' }}
                                onPress={handlePickReturnEvidence}
                            >
                                <Icon name="camera-outline" size={18} color="#2563EB" />
                                <Text style={{ fontSize: 12, fontWeight: '700', color: '#2563EB', marginLeft: 6 }}>
                                    Attach Defect Photo/Proof ({returnEvidenceFiles.length}/3)
                                </Text>
                            </TouchableOpacity>

                            {returnEvidenceFiles.length > 0 && (
                                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                                    {returnEvidenceFiles.map((imgUri, idx) => (
                                        <View key={idx} style={{ position: 'relative' }}>
                                            <Image source={{ uri: imgUri }} style={{ width: 50, height: 50, borderRadius: 6, borderWidth: 1, borderColor: '#CBD5E1' }} />
                                            <TouchableOpacity 
                                                style={{ position: 'absolute', top: -5, right: -5, backgroundColor: '#EF4444', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' }}
                                                onPress={() => handleRemoveReturnEvidence(idx)}
                                            >
                                                <Icon name="close" size={12} color="#FFF" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.modalCancelBtn]} 
                                onPress={() => setIsReturnModalVisible(false)}
                                disabled={isSubmittingReturn}
                            >
                                <Text style={styles.modalCancelBtnText}>Dismiss</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.modalButton, styles.modalSubmitBtn, { backgroundColor: '#FF9800' }]} 
                                onPress={handleReturnSubmit}
                                disabled={isSubmittingReturn}
                            >
                                {isSubmittingReturn ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.modalSubmitBtnText}>Submit Request</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* --- RATE & REVIEW PRODUCT MODAL --- */}
            <Modal
                visible={isReviewModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsReviewModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Rate & Review Product</Text>
                        <Text style={styles.modalSubtitle} numberOfLines={1}>
                            {selectedReviewItem?.productName || 'Rate your purchase'}
                        </Text>

                        {/* Interactive 5-Star Selector */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginVertical: 14 }}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <TouchableOpacity key={s} onPress={() => setReviewRating(s)}>
                                    <Icon name={s <= reviewRating ? "star" : "star-outline"} size={36} color="#F59E0B" />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput
                            style={[styles.textInput, { marginBottom: 10 }]}
                            placeholder="Review Headline (e.g. Excellent Quality!)"
                            placeholderTextColor="#999"
                            value={reviewTitle}
                            onChangeText={setReviewTitle}
                        />

                        <TextInput
                            style={styles.textInput}
                            placeholder="Write your detailed review comment..."
                            placeholderTextColor="#999"
                            value={reviewText}
                            onChangeText={setReviewText}
                            multiline={true}
                            numberOfLines={3}
                        />

                        {/* Media Picker Button & Preview Grid */}
                        <View style={{ marginTop: 10 }}>
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 6,
                                    paddingVertical: 10,
                                    borderWidth: 1.5,
                                    borderColor: selectedMediaFiles.length >= 5 ? '#CBD5E1' : '#059669',
                                    borderRadius: 8,
                                    backgroundColor: selectedMediaFiles.length >= 5 ? '#F1F5F9' : '#ECFDF5',
                                    opacity: selectedMediaFiles.length >= 5 ? 0.7 : 1
                                }}
                                onPress={handlePickMedia}
                                disabled={selectedMediaFiles.length >= 5}
                            >
                                <Icon name="camera-outline" size={20} color={selectedMediaFiles.length >= 5 ? '#64748B' : '#059669'} />
                                <Text style={{ fontWeight: '700', color: selectedMediaFiles.length >= 5 ? '#64748B' : '#059669', fontSize: 13 }}>
                                    {selectedMediaFiles.length >= 5 ? 'Max 5 Media Files Reached' : `Attach Photos / Videos (${selectedMediaFiles.length}/5)`}
                                </Text>
                            </TouchableOpacity>

                            {/* Media Preview Thumbnails */}
                            {selectedMediaFiles && selectedMediaFiles.length > 0 && (
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 10 }}>
                                    {selectedMediaFiles.map((file, idx) => {
                                        const isVideo = file.type && file.type.includes('video');
                                        return (
                                            <View key={idx} style={{ position: 'relative', width: 56, height: 56, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: '#0F172A' }}>
                                                {isVideo ? (
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Icon name="play-circle" size={22} color="#F59E0B" />
                                                        <Text style={{ color: '#FFF', fontSize: 8, fontWeight: '700' }}>VIDEO</Text>
                                                    </View>
                                                ) : (
                                                    <Image source={{ uri: file.uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                                                )}
                                                {/* Remove [X] button */}
                                                <TouchableOpacity
                                                    style={{ position: 'absolute', top: 2, right: 2, backgroundColor: 'rgba(239, 68, 68, 0.95)', width: 18, height: 18, borderRadius: 9, justifyContent: 'center', alignItems: 'center', zIndex: 10 }}
                                                    onPress={() => handleRemoveMediaItem(idx)}
                                                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                                >
                                                    <Icon name="close" size={12} color="#FFFFFF" />
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    })}
                                </ScrollView>
                            )}
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.modalCancelBtn]} 
                                onPress={() => setIsReviewModalVisible(false)}
                                disabled={isSubmittingReview}
                            >
                                <Text style={styles.modalCancelBtnText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.modalButton, styles.modalSubmitBtn, { backgroundColor: '#059669' }]} 
                                onPress={handleReviewSubmit}
                                disabled={isSubmittingReview}
                            >
                                {isSubmittingReview ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.modalSubmitBtnText}>Submit Review</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* --- CANCELLATION MODAL --- */}
            <Modal
                visible={isCancelModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsCancelModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Cancel Order</Text>
                        <Text style={styles.modalSubtitle}>Please provide a reason for cancelling this order:</Text>
                        
                        <TextInput
                            style={styles.textInput}
                            placeholder="Reason for cancellation (e.g., Change of mind, Incorrect address)"
                            placeholderTextColor="#999"
                            value={cancelReason}
                            onChangeText={setCancelReason}
                            multiline={true}
                            numberOfLines={3}
                        />

                        {order && ((order.paymentStatus || '').toUpperCase() === 'PAID' || (order.paymentStatus || '').toUpperCase() === 'SUCCESS') && (order.paymentMethod || '').toUpperCase() !== 'COD' && (
                            <View style={{ marginBottom: 15 }}>
                                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', marginBottom: 8 }}>Select Refund Mode:</Text>
                                
                                <TouchableOpacity 
                                    style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: refundType === 'WALLET' ? '#F0FDF4' : '#F8FAFC', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: refundType === 'WALLET' ? '#16A34A' : '#E2E8F0', marginBottom: 8 }}
                                    onPress={() => setRefundType('WALLET')}
                                >
                                    <Icon name={refundType === 'WALLET' ? 'radio-button-on' : 'radio-button-off'} size={20} color={refundType === 'WALLET' ? '#16A34A' : '#64748B'} />
                                    <View style={{ marginLeft: 10, flex: 1 }}>
                                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#16A34A' }}>⚡ Instant Earn24 Wallet Refund</Text>
                                        <Text style={{ fontSize: 11, color: '#64748B' }}>0 Seconds Wait Time - Instant Money</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: refundType === 'BANK' ? '#EFF6FF' : '#F8FAFC', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: refundType === 'BANK' ? '#2563EB' : '#E2E8F0' }}
                                    onPress={() => setRefundType('BANK')}
                                >
                                    <Icon name={refundType === 'BANK' ? 'radio-button-on' : 'radio-button-off'} size={20} color={refundType === 'BANK' ? '#2563EB' : '#64748B'} />
                                    <View style={{ marginLeft: 10, flex: 1 }}>
                                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E293B' }}>🏦 Original Bank / UPI Account</Text>
                                        <Text style={{ fontSize: 11, color: '#64748B' }}>3-5 Business Days via PayU</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}

                        <View style={styles.modalActions}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.modalCancelBtn]} 
                                onPress={() => setIsCancelModalVisible(false)}
                                disabled={isCancelling}
                            >
                                <Text style={styles.modalCancelBtnText}>Dismiss</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.modalButton, styles.modalSubmitBtn]} 
                                onPress={handleCancelOrderSubmit}
                                disabled={isCancelling}
                            >
                                {isCancelling ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.modalSubmitBtnText}>Confirm Cancel</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* --- BEAUTIFUL RETURN / REPLACEMENT TRACKING TIMELINE MODAL --- */}
            <Modal
                visible={isTrackingModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsTrackingModalVisible(false)}
            >
                <View style={styles.trackingModalOverlay}>
                    <View style={styles.trackingModalContainer}>
                        {/* Modal Header */}
                        <View style={styles.trackingModalHeader}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={[styles.retTypeIconCircle, { 
                                        backgroundColor: (selectedTrackingReturn?.request_type || selectedTrackingReturn?.return_type) === 'REPLACEMENT' ? '#EFF6FF' : '#F0FDF4',
                                        width: 28, height: 28 
                                    }]}>
                                        <Icon 
                                            name={(selectedTrackingReturn?.request_type || selectedTrackingReturn?.return_type) === 'REPLACEMENT' ? "repeat-outline" : "return-down-back-outline"} 
                                            size={16} 
                                            color={(selectedTrackingReturn?.request_type || selectedTrackingReturn?.return_type) === 'REPLACEMENT' ? "#2563EB" : "#16A34A"} 
                                        />
                                    </View>
                                    <Text style={styles.trackingModalTitle}>
                                        {(selectedTrackingReturn?.request_type || selectedTrackingReturn?.return_type) === 'REPLACEMENT' ? 'Replacement Journey' : 'Return & Refund Audit'}
                                    </Text>
                                </View>
                                <Text style={styles.trackingModalSubtitle}>
                                    Request #REQ-{selectedTrackingReturn?.id} • {selectedTrackingReturn?.created_at ? moment(selectedTrackingReturn?.created_at).format('D MMM YYYY, h:mm a') : ''}
                                </Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.trackingModalCloseBtn}
                                onPress={() => setIsTrackingModalVisible(false)}
                            >
                                <Icon name="close" size={20} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView 
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        >
                            {/* Product Snapshot Inside Modal */}
                            {(() => {
                                const mItem = (order?.items || []).find(i => i.id == selectedTrackingReturn?.order_item_id) || order?.items?.[0] || {};
                                const isRep = (selectedTrackingReturn?.request_type || selectedTrackingReturn?.return_type) === 'REPLACEMENT';
                                return (
                                    <View style={styles.modalProductStrip}>
                                        <Image 
                                            source={{ uri: mItem.imageUrl ? (mItem.imageUrl.startsWith('http') ? mItem.imageUrl : `https://newapi.earn24.in${mItem.imageUrl}`) : 'https://via.placeholder.com/150' }}
                                            style={styles.modalProductThumb}
                                        />
                                        <View style={{ flex: 1, marginLeft: 12 }}>
                                            <Text style={styles.modalProductName} numberOfLines={2}>{mItem.productName || 'Product Item'}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, flexWrap: 'wrap' }}>
                                                <View style={styles.qtyBadgePill}>
                                                    <Text style={styles.qtyBadgePillText}>Returned Qty: {selectedTrackingReturn?.return_quantity || 1}</Text>
                                                </View>
                                                {!isRep && (
                                                    <View style={[styles.qtyBadgePill, { backgroundColor: '#DCFCE7' }]}>
                                                        <Text style={[styles.qtyBadgePillText, { color: '#15803D' }]}>
                                                            Refund: ₹{parseFloat(selectedTrackingReturn?.refund_amount || mItem.totalPrice || 0).toFixed(2)}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                );
                            })()}

                            {/* Rider Handshake Card inside Modal if assigned */}
                            {selectedTrackingReturn && ['PICKUP_ASSIGNED', 'OUT_FOR_PICKUP'].includes((selectedTrackingReturn.status || '').toUpperCase()) && (
                                <View style={styles.modalAgentCard}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                            <View style={styles.agentAvatarCircle}>
                                                <Icon name="person" size={20} color="#7E22CE" />
                                            </View>
                                            <View style={{ marginLeft: 10, flex: 1 }}>
                                                <Text style={styles.modalAgentName}>
                                                    {selectedTrackingReturn.agent_name || 'Delivery Partner'}
                                                </Text>
                                                <Text style={styles.modalAgentSub}>Assigned for doorstep verification & pickup</Text>
                                            </View>
                                        </View>
                                        {selectedTrackingReturn.agent_phone ? (
                                            <TouchableOpacity 
                                                style={styles.modalCallBtn}
                                                onPress={() => handleCallAgent(selectedTrackingReturn.agent_phone)}
                                            >
                                                <Icon name="call" size={14} color="#FFFFFF" />
                                                <Text style={styles.modalCallBtnText}>Call</Text>
                                            </TouchableOpacity>
                                        ) : null}
                                    </View>
                                </View>
                            )}

                            {/* 6-Milestone Audit Vertical Timeline */}
                            {(() => {
                                const ret = selectedTrackingReturn;
                                if (!ret) return null;
                                const isRep = (ret.request_type || ret.return_type) === 'REPLACEMENT';
                                const s = (ret.status || 'PENDING').toUpperCase();

                                const allSteps = [
                                    {
                                        stepNum: 1,
                                        title: isRep ? 'Replacement Requested' : 'Return Requested',
                                        subtitle: `Item return claim placed for ${ret.return_quantity || 1} unit(s)`,
                                        time: ret.created_at ? moment(ret.created_at).format('D MMM YYYY, h:mm a') : '',
                                        isDone: true,
                                        isActive: false,
                                        icon: 'document-text-outline',
                                    }
                                ];

                                if (s === 'REJECTED') {
                                    allSteps.push({
                                        stepNum: 2,
                                        title: 'Request Rejected',
                                        subtitle: ret.reject_reason || ret.admin_remarks || ret.admin_note || 'Request rejected based on return policy guidelines',
                                        time: ret.updated_at ? moment(ret.updated_at).format('D MMM YYYY, h:mm a') : '',
                                        isDone: true,
                                        isActive: false,
                                        isError: true,
                                        icon: 'close-circle-outline',
                                    });
                                } else {
                                    allSteps.push(
                                        {
                                            stepNum: 2,
                                            title: 'Request Approved',
                                            subtitle: s === 'PENDING' ? 'Waiting for review & approval by Earn24 team' : 'Your request has been verified & approved',
                                            time: (ret.merchant_decision_at || ret.admin_decision_at || ret.updated_at) ? moment(ret.merchant_decision_at || ret.admin_decision_at || ret.updated_at).format('D MMM YYYY, h:mm a') : '',
                                            isDone: s !== 'PENDING',
                                            isActive: s === 'PENDING',
                                            icon: 'shield-checkmark-outline',
                                        },
                                        {
                                            stepNum: 3,
                                            title: 'Pickup Partner Assigned',
                                            subtitle: ret.agent_name 
                                                ? `Assigned to ${ret.agent_name}${ret.pickup_scheduled_date ? ' • Scheduled ' + moment(ret.pickup_scheduled_date).format('D MMM') : ''}` 
                                                : 'Pickup partner will be assigned soon',
                                            time: ret.pickup_assigned_at ? moment(ret.pickup_assigned_at).format('D MMM YYYY, h:mm a') : '',
                                            isDone: ['OUT_FOR_PICKUP', 'PICKED_UP', 'IN_TRANSIT_TO_HUB', 'RECEIVED_AT_HUB', 'REFUNDED', 'REPLACEMENT_DISPATCHED', 'COMPLETED'].includes(s),
                                            isActive: s === 'PICKUP_ASSIGNED',
                                            icon: 'bicycle-outline',
                                        },
                                        {
                                            stepNum: 4,
                                            title: 'Doorstep Pickup & Handover',
                                            subtitle: ['PICKED_UP', 'IN_TRANSIT_TO_HUB', 'RECEIVED_AT_HUB', 'REFUNDED', 'REPLACEMENT_DISPATCHED', 'COMPLETED'].includes(s)
                                                ? 'Product successfully checked and collected by delivery partner'
                                                : (s === 'OUT_FOR_PICKUP' ? 'Delivery partner out for pickup. Keep item ready' : 'Partner will visit your doorstep for physical handover'),
                                            time: ret.picked_up_at ? moment(ret.picked_up_at).format('D MMM YYYY, h:mm a') : '',
                                            isDone: ['PICKED_UP', 'IN_TRANSIT_TO_HUB', 'RECEIVED_AT_HUB', 'REFUNDED', 'REPLACEMENT_DISPATCHED', 'COMPLETED'].includes(s),
                                            isActive: s === 'OUT_FOR_PICKUP',
                                            icon: 'checkmark-circle-outline',
                                        },
                                        {
                                            stepNum: 5,
                                            title: 'Received & Inspected at Warehouse',
                                            subtitle: ['RECEIVED_AT_HUB', 'REFUNDED', 'REPLACEMENT_DISPATCHED', 'COMPLETED'].includes(s)
                                                ? 'Package safely received and verified at warehouse'
                                                : (['PICKED_UP', 'IN_TRANSIT_TO_HUB'].includes(s) ? 'Package currently in transit to warehouse' : 'Pending doorstep pickup completion'),
                                            time: ret.received_at_hub_at ? moment(ret.received_at_hub_at).format('D MMM YYYY, h:mm a') : '',
                                            isDone: ['RECEIVED_AT_HUB', 'REFUNDED', 'REPLACEMENT_DISPATCHED', 'COMPLETED'].includes(s),
                                            isActive: ['PICKED_UP', 'IN_TRANSIT_TO_HUB'].includes(s),
                                            icon: 'storefront-outline',
                                        },
                                        {
                                            stepNum: 6,
                                            title: isRep ? 'Replacement Order Dispatched' : 'Refund Settlement',
                                            subtitle: isRep 
                                                ? (s === 'REPLACEMENT_DISPATCHED' 
                                                    ? `Fresh item dispatched! Child Order #${ret.replacement_order_id || 'REPL'}` 
                                                    : (s === 'COMPLETED' ? 'Replacement unit successfully delivered!' : 'Fresh product will be dispatched after warehouse check'))
                                                : (['REFUNDED', 'COMPLETED'].includes(s) || (s === 'PICKED_UP' && (ret.refund_status || '').toUpperCase() === 'COMPLETED')
                                                    ? `₹${parseFloat(ret.refund_amount || 0).toFixed(2)} refunded via ${(ret.refund_method || 'WALLET').toUpperCase()}${ret.refund_utr ? ' (UTR: ' + ret.refund_utr + ')' : ''}`
                                                    : `Refund of ₹${parseFloat(ret.refund_amount || 0).toFixed(2)} to ${(ret.refund_method || 'WALLET').toUpperCase()} upon receiving`),
                                            time: ret.refunded_at ? moment(ret.refunded_at).format('D MMM YYYY, h:mm a') : '',
                                            isDone: isRep ? ['REPLACEMENT_DISPATCHED', 'COMPLETED'].includes(s) : (['REFUNDED', 'COMPLETED'].includes(s) || (s === 'PICKED_UP' && (ret.refund_status || '').toUpperCase() === 'COMPLETED')),
                                            isActive: s === 'RECEIVED_AT_HUB',
                                            icon: isRep ? 'gift-outline' : 'cash-outline',
                                        }
                                    );
                                }

                                return (
                                    <View style={styles.modalTimelineCard}>
                                        <Text style={styles.modalTimelineCardTitle}>Step-by-Step Milestone Audit</Text>
                                        <View style={{ marginTop: 16 }}>
                                            {allSteps.map((step, idx) => {
                                                const isLast = idx === allSteps.length - 1;
                                                const circleBg = step.isError ? '#DC2626' : (step.isDone ? '#0CA201' : (step.isActive ? '#2563EB' : '#E2E8F0'));
                                                const iconColor = (step.isDone || step.isActive || step.isError) ? '#FFFFFF' : '#94A3B8';
                                                const lineDone = step.isDone && !step.isError;

                                                return (
                                                    <View key={step.stepNum} style={styles.auditTimelineRow}>
                                                        {/* Left indicator with connector */}
                                                        <View style={styles.auditTimelineLeftCol}>
                                                            <View style={[styles.auditTimelineNode, { backgroundColor: circleBg }]}>
                                                                <Icon 
                                                                    name={step.isDone ? "checkmark" : (step.isError ? "close" : (step.isActive ? step.icon : "ellipse"))} 
                                                                    size={12} 
                                                                    color={iconColor} 
                                                                />
                                                            </View>
                                                            {!isLast && (
                                                                <View style={[styles.auditTimelineConnector, { backgroundColor: lineDone ? '#0CA201' : '#E2E8F0' }]} />
                                                            )}
                                                        </View>

                                                        {/* Right content */}
                                                        <View style={[styles.auditTimelineRightCol, isLast && { paddingBottom: 0 }]}>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                                <Text style={[styles.auditStepTitle, step.isActive && { color: '#2563EB' }, step.isError && { color: '#DC2626' }]}>
                                                                    {step.title}
                                                                </Text>
                                                                {step.time ? (
                                                                    <Text style={styles.auditStepTime}>{step.time}</Text>
                                                                ) : null}
                                                            </View>
                                                            <Text style={styles.auditStepSub}>{step.subtitle}</Text>
                                                        </View>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    </View>
                                );
                            })()}
                        </ScrollView>

                        {/* Bottom Close Button */}
                        <TouchableOpacity 
                            style={styles.trackingModalCloseBar}
                            onPress={() => setIsTrackingModalVisible(false)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.trackingModalCloseBarText}>Close Tracking</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <AlertModal />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    section: { backgroundColor: '#fff', padding: 15, marginBottom: 10 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    orderIdText: { fontSize: 15, fontWeight: 'bold', color: '#212529' },
    orderDate: { fontSize: 13, color: '#6c757d' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#212529', marginBottom: 12 },
    itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
    itemImage: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#e9ecef' },
    itemDetails: { flex: 1, marginLeft: 12 },
    itemName: { fontSize: 14, fontWeight: '600', color: '#212529' },
    itemQuantity: { fontSize: 12, color: '#6c757d', marginTop: 2 },
    itemPrice: { fontSize: 14, fontWeight: 'bold', color: '#212529' },
    addressCard: { backgroundColor: '#f8f9fa', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e9ecef' },
    addressName: { fontSize: 14, fontWeight: 'bold', color: '#212529', marginBottom: 4 },
    addressText: { fontSize: 13, color: '#495057', lineHeight: 18 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    summaryLabel: { fontSize: 14, color: '#6c757d' },
    summaryValue: { fontSize: 14, fontWeight: '500', color: '#343a40' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e9ecef', marginTop: 5 },
    totalLabel: { fontSize: 16, fontWeight: 'bold' },
    totalValue: { fontSize: 16, fontWeight: 'bold', color: '#0CA201' },
    invoiceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0CA201',
        marginHorizontal: 15,
        marginVertical: 6,
        padding: 14,
        borderRadius: 10,
    },
    invoiceButtonText: { marginLeft: 8, fontSize: 15, color: '#fff', fontWeight: '600' },
    cancelOrderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DC2626',
        marginHorizontal: 15,
        marginTop: 10,
        padding: 14,
        borderRadius: 10,
    },
    disabledButton: { opacity: 0.7 },
    cancelOrderButtonText: { marginLeft: 8, fontSize: 15, color: '#fff', fontWeight: '600' },
    
    // Top Flipkart Summary Card Styles
    topFlipkartCard: {
        backgroundColor: '#FFFFFF',
        margin: 15,
        marginBottom: 8,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    topCardTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
    topCardAmount: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginTop: 2 },
    topCardNote: { fontSize: 12, color: '#64748B', marginTop: 6 },
    topCardStatusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    badgeSuccess: { backgroundColor: '#DCFCE7' },
    badgeWarning: { backgroundColor: '#FEF3C7' },
    badgeDanger: { backgroundColor: '#FEE2E2' },
    topCardStatusText: { fontSize: 12, fontWeight: '700' },
    textSuccess: { color: '#166534' },
    textWarning: { color: '#92400E' },
    textDanger: { color: '#991B1B' },
    remarkAlertBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', padding: 8, borderRadius: 6, marginTop: 8 },
    remarkAlertText: { fontSize: 12, color: '#991B1B', fontWeight: '600', marginLeft: 6, flex: 1 },

    // Vertical Timeline Tracker Styles
    verticalTimelineContainer: { marginTop: 10, paddingVertical: 6 },
    timelineHeaderTitle: { fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 12 },
    cancelledTimelineBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', padding: 12, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#DC2626' },
    timelineRow: { flexDirection: 'row', marginBottom: 16 },
    timelineLeftColumn: { width: 24, alignItems: 'center' },
    verticalDot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
    verticalLine: { width: 2, flex: 1, marginTop: 2 },
    timelineRightColumn: { flex: 1, marginLeft: 10 },
    stepTitle: { fontSize: 13, fontWeight: '600', color: '#64748B' },
    stepTitleCompleted: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
    stepTime: { fontSize: 11, color: '#94A3B8' },
    stepDescription: { fontSize: 12, color: '#64748B', marginTop: 2, lineHeight: 16 },

    // Payment Badges
    paymentBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
    paidBadge: { backgroundColor: '#DCFCE7' },
    pendingBadge: { backgroundColor: '#FEF3C7' },
    paymentBadgeText: { fontSize: 11, fontWeight: '700' },
    paidText: { color: '#166534' },
    pendingText: { color: '#92400E' },

    // Lock Banner
    lockBannerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F9FF', padding: 12, marginHorizontal: 15, marginBottom: 10, borderRadius: 10, borderWidth: 1, borderColor: '#BAE6FD' },
    lockBannerTitle: { fontSize: 13, fontWeight: '700', color: '#0369A1' },
    lockBannerSubtitle: { fontSize: 11, color: '#0369A1', marginTop: 2 },

    // Mini Badges
    miniBadgeGray: { backgroundColor: '#F1F5F9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    miniBadgeText: { fontSize: 10, color: '#475569', fontWeight: '600' },
    miniBadgeBlue: { backgroundColor: '#EFF6FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    miniBadgeTextBlue: { fontSize: 10, color: '#2563EB', fontWeight: '600' },

    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContainer: { width: '100%', backgroundColor: '#FFF', borderRadius: 15, padding: 20 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#181725', marginBottom: 10, textAlign: 'center' },
    modalSubtitle: { fontSize: 14, color: '#6c757d', marginBottom: 15, textAlign: 'center' },
    textInput: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 10, fontSize: 14, color: '#333', backgroundColor: '#f8f9fa', minHeight: 80, textAlignVertical: 'top', marginBottom: 15 },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
    modalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    modalCancelBtn: { backgroundColor: '#e9ecef' },
    modalCancelBtnText: { color: '#495057', fontSize: 15, fontWeight: '600' },
    modalSubmitBtn: { backgroundColor: '#D32F2F' },
    modalSubmitBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
    itemCardContainer: { backgroundColor: '#FFFFFF', borderRadius: 10, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
    cancelledBadge: { backgroundColor: '#FEE2E2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginTop: 4 },
    cancelledBadgeText: { color: '#DC2626', fontSize: 10, fontWeight: 'bold' },
    cancelItemBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, borderWidth: 1, borderColor: '#FCA5A5', marginTop: 8 },
    cancelItemBtnText: { color: '#DC2626', fontSize: 12, fontWeight: '600', marginLeft: 4 },
    rateProductBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF3C7', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, borderWidth: 1, borderColor: '#FCD34D', marginTop: 8 },
    rateProductBtnText: { color: '#B45309', fontSize: 12, fontWeight: '700', marginLeft: 4 },

    // --- Premium Return & Replacement Tracking Card Styles ---
    premiumReturnCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 15,
        marginTop: 12,
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    premiumReturnHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    retTypeIconCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
    },
    premiumReturnCardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0F172A',
    },
    premiumReturnSubtext: {
        fontSize: 11,
        color: '#64748B',
        marginTop: 2,
    },
    premiumStatusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    premiumStatusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    productSnapshotStrip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#EDF2F7',
        marginBottom: 12,
    },
    snapshotThumb: {
        width: 44,
        height: 44,
        borderRadius: 6,
        backgroundColor: '#E2E8F0',
    },
    snapshotName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1E293B',
    },
    qtyBadgePill: {
        backgroundColor: '#E0F2FE',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginRight: 8,
    },
    qtyBadgePillText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#0369A1',
    },
    snapshotRefundAmt: {
        fontSize: 12,
        fontWeight: '700',
        color: '#0F172A',
    },
    handshakeBox: {
        backgroundColor: '#FAF5FF',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E9D5FF',
        marginBottom: 12,
    },
    handshakeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    handshakeAgentName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#581C87',
        marginLeft: 6,
    },
    callAgentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7E22CE',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
    },
    callAgentButtonText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FFFFFF',
        marginLeft: 4,
    },
    handshakeDateText: {
        fontSize: 12,
        color: '#6B21A8',
        marginTop: 6,
        fontWeight: '500',
    },
    securityOtpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#D8B4FE',
    },
    otpLabelText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#581C87',
    },
    otpSubText: {
        fontSize: 10,
        color: '#7E22CE',
        marginTop: 1,
    },
    otpPillBox: {
        backgroundColor: '#F3E8FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#9333EA',
    },
    otpDigits: {
        fontSize: 16,
        fontWeight: '900',
        color: '#6B21A8',
        letterSpacing: 2,
    },
    inTransitCallout: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDFA',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#99F6E4',
        marginBottom: 12,
    },
    inTransitTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#0F766E',
    },
    inTransitSub: {
        fontSize: 11,
        color: '#115E59',
        marginTop: 1,
    },
    refundSettledBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#BBF7D0',
        marginBottom: 12,
    },
    refundSettledTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#166534',
    },
    refundSettledSub: {
        fontSize: 11,
        color: '#15803D',
        marginTop: 2,
    },
    seeStatusActionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F0FDF4',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DCFCE7',
    },
    seeStatusActionText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#0CA201',
        marginLeft: 6,
    },
    seeStatusChevronCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#DCFCE7',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // --- Return Tracking Modal Styles ---
    trackingModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    trackingModalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        paddingTop: 16,
        paddingHorizontal: 18,
        paddingBottom: 20,
    },
    trackingModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    trackingModalTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginLeft: 8,
    },
    trackingModalSubtitle: {
        fontSize: 11,
        color: '#64748B',
        marginTop: 4,
    },
    trackingModalCloseBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalProductStrip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderRadius: 12,
        marginTop: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    modalProductThumb: {
        width: 52,
        height: 52,
        borderRadius: 8,
        backgroundColor: '#E2E8F0',
    },
    modalProductName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1E293B',
    },
    modalAgentCard: {
        backgroundColor: '#FAF5FF',
        padding: 14,
        borderRadius: 12,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#E9D5FF',
    },
    agentAvatarCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3E8FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalAgentName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#581C87',
    },
    modalAgentSub: {
        fontSize: 11,
        color: '#7E22CE',
    },
    modalCallBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7E22CE',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    modalCallBtnText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
        marginLeft: 4,
    },
    modalOtpHighlight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#D8B4FE',
    },
    modalOtpLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#581C87',
        letterSpacing: 0.5,
    },
    modalOtpSub: {
        fontSize: 10,
        color: '#7E22CE',
        marginTop: 2,
    },
    modalOtpBadge: {
        backgroundColor: '#F3E8FF',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#9333EA',
    },
    modalOtpCode: {
        fontSize: 16,
        fontWeight: '900',
        color: '#6B21A8',
        letterSpacing: 2,
    },
    modalTimelineCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        marginTop: 14,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    modalTimelineCardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
    },
    auditTimelineRow: {
        flexDirection: 'row',
    },
    auditTimelineLeftCol: {
        alignItems: 'center',
        width: 24,
    },
    auditTimelineNode: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    auditTimelineConnector: {
        width: 2,
        flex: 1,
        marginVertical: -1,
        minHeight: 36,
    },
    auditTimelineRightCol: {
        flex: 1,
        paddingLeft: 12,
        paddingBottom: 20,
    },
    auditStepTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1E293B',
    },
    auditStepTime: {
        fontSize: 10,
        color: '#94A3B8',
        marginLeft: 8,
    },
    auditStepSub: {
        fontSize: 11,
        color: '#64748B',
        marginTop: 3,
        lineHeight: 15,
    },
    trackingModalCloseBar: {
        backgroundColor: '#0CA201',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    trackingModalCloseBarText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
});

class OrderDetailsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("OrderDetailsScreen Error Boundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Icon name="alert-circle-outline" size={56} color="#DC2626" />
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E293B', marginTop: 16 }}>Unable to Load Order Details</Text>
          <View style={{ backgroundColor: '#FEE2E2', padding: 10, borderRadius: 8, marginTop: 12, width: '100%', alignItems: 'center' }}>
            <Text style={{ fontSize: 11, color: '#991B1B', fontFamily: 'monospace' }}>
              {this.state.error ? this.state.error.message : 'Unknown Error'}
            </Text>
          </View>
          <TouchableOpacity
            style={{ marginTop: 24, backgroundColor: '#0CA201', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
            onPress={() => this.props.navigation?.goBack()}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 14 }}>Go Back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

const OrderDetailsScreenWrapper = (props) => (
  <OrderDetailsErrorBoundary navigation={props.navigation}>
    <OrderDetailsScreen {...props} />
  </OrderDetailsErrorBoundary>
);

export default OrderDetailsScreenWrapper;