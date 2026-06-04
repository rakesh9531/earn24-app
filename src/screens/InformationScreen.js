import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import axios from 'axios';

const InformationScreen = ({ route, navigation }) => {
    const { pageKey, title } = route.params;
    const { width } = useWindowDimensions();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Set Header Title dynamically
        navigation.setOptions({ headerTitle: title });

        const fetchContent = async () => {
            try {

                console.log("pageKey-->",pageKey)

                // Point to your public backend API with 'USER_APP' flag
                const response = await axios.get(`https://newapi.earn24.in/api/admin/public/page`, {
                    params: { key: pageKey, app: 'USER_APP' }
                });

                console.log("response page-->",response)

                if (response.data.status) {
                    setData(response.data.data);
                }
            } catch (error) {
                console.error("Content Fetch Error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, [pageKey]);

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0CA201" />
                <Text style={styles.loaderText}>Loading {title}...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.pageTitle}>{data?.title}</Text>
            <View style={styles.divider} />
            
            {data ? (
                <RenderHtml
                    contentWidth={width - 40}
                    source={{ html: data.content }}
                    tagsStyles={{
                        h1: { color: '#181725', marginBottom: 10, fontSize: 22 },
                        p: { color: '#4F4F4F', lineHeight: 22, fontSize: 15, marginBottom: 15 },
                        strong: { color: '#0CA201' }
                    }}
                />
            ) : (
                <Text style={styles.errorText}>Content currently unavailable.</Text>
            )}
            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    content: { padding: 20 },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loaderText: { marginTop: 10, color: '#7C7C7C' },
    pageTitle: { fontSize: 26, fontWeight: 'bold', color: '#181725', marginBottom: 5 },
    divider: { height: 2, backgroundColor: '#0CA201', width: 40, marginBottom: 20, borderRadius: 1 },
    errorText: { textAlign: 'center', marginTop: 50, color: '#D32F2F' }
});

export default InformationScreen;