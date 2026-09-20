import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { orderService } from '../services/orderService';
import OrderCard from '../components/OrderCard';

const OrderHistoryScreen = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchOrders = async (pageNum = 1, isRefresh = false) => {
        if (isRefresh) {
            setIsRefreshing(true);
        } else if (pageNum === 1) {
            setIsLoading(true);
        } else {
            setIsLoadingMore(true);
        }

        try {
            const response = await orderService.getOrderHistory(pageNum, 20);
            if (response.status) {
                const newOrders = response.data || [];
                const totalPages = response.pagination?.totalPages || 1;

                if (pageNum === 1 || isRefresh) {
                    setOrders(newOrders);
                } else {
                    setOrders(prev => {
                        const existingIds = new Set(prev.map(o => o.id));
                        const filteredNew = newOrders.filter(o => !existingIds.has(o.id));
                        return [...prev, ...filteredNew];
                    });
                }
                setPage(pageNum);
                setHasMore(pageNum < totalPages && newOrders.length > 0);
            }
        } catch (error) {
            console.error("Failed to fetch order history", error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
            setIsLoadingMore(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchOrders(1, false);
        }, [])
    );

    const handleLoadMore = () => {
        if (!isLoading && !isLoadingMore && hasMore) {
            fetchOrders(page + 1, false);
        }
    };

    const handleRefresh = () => {
        fetchOrders(1, true);
    };

    if (isLoading && orders.length === 0) {
        return <View style={styles.centered}><ActivityIndicator size="large" color="#0CA201" /></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={orders}
                keyExtractor={(item, index) => (item && item.id ? item.id.toString() : index.toString())}
                renderItem={({ item }) => (
                    <OrderCard
                        order={item}
                        onPress={() => item && item.id && navigation.navigate('OrderDetails', { orderId: item.id })}
                    />
                )}
                contentContainerStyle={styles.listContent}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.4}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                ListFooterComponent={() => {
                    if (!isLoadingMore) return null;
                    return (
                        <View style={{ paddingVertical: 18, alignItems: 'center' }}>
                            <ActivityIndicator size="small" color="#0CA201" />
                            <Text style={{ fontSize: 11, color: '#64748B', marginTop: 4, fontWeight: '600' }}>Loading older orders...</Text>
                        </View>
                    );
                }}
                ListEmptyComponent={() => (
                    <View style={styles.centered}>
                        <Text style={styles.emptyText}>You haven't placed any orders yet.</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

class OrderHistoryErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("OrderHistoryScreen Error Boundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#1E293B', marginTop: 16 }}>Unable to Load Order History</Text>
          <Text style={{ fontSize: 13, color: '#64748B', marginTop: 8, textAlign: 'center' }}>
            {this.state.error ? this.state.error.message : 'Please try again'}
          </Text>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

const OrderHistoryScreenWrapper = (props) => (
  <OrderHistoryErrorBoundary>
    <OrderHistoryScreen {...props} />
  </OrderHistoryErrorBoundary>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { padding: 15 },
    emptyText: { fontSize: 16, color: '#6c757d' },
});

export default OrderHistoryScreenWrapper;