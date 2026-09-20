import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, useWindowDimensions, TouchableOpacity } from 'react-native';
import RenderHtml from 'react-native-render-html';
import axios from 'axios';

const InformationScreen = ({ route, navigation }) => {
    const { pageKey, title } = route.params;
    const { width } = useWindowDimensions();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchContent = async () => {
        setIsLoading(true);
        setError(false);
        try {
            const response = await axios.get(`https://newapi.earn24.in/api/admin/public/page`, {
                params: { key: pageKey, app: 'USER_APP' }
            });

            if (response.data?.status) {
                setData(response.data.data);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error("Content Fetch Error:", err);
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Set Header Title dynamically
        navigation.setOptions({ headerTitle: title });
        fetchContent();
    }, [pageKey]);

    const sanitizeHtml = (rawHtml) => {
        if (!rawHtml) return '';
        let cleaned = rawHtml;
        // Fix double-encoded UTF-8 garbled characters (e.g. Â, Ã)
        cleaned = cleaned.replace(/Â/g, '');
        // Replace HTML entity codes with clean equivalents
        cleaned = cleaned.replace(/&nbsp;/g, ' ');
        cleaned = cleaned.replace(/&rsquo;/g, "'");
        cleaned = cleaned.replace(/&lsquo;/g, "'");
        cleaned = cleaned.replace(/&rdquo;/g, '"');
        cleaned = cleaned.replace(/&ldquo;/g, '"');
        cleaned = cleaned.replace(/&ndash;/g, '-');
        cleaned = cleaned.replace(/&mdash;/g, '-');
        cleaned = cleaned.replace(/&amp;/g, '&');
        // Clean problematic inline styles (background-color, line-height, fixed height) that clip text
        cleaned = cleaned.replace(/style="[^"]*"/gi, (match) => {
            return match
                .replace(/background-color:[^;"]*;?/gi, '')
                .replace(/line-height:[^;"]*;?/gi, '')
                .replace(/font-family:[^;"]*;?/gi, '')
                .replace(/height:[^;"]*;?/gi, '');
        });
        // Strip empty Quill paragraphs and consecutive breaks
        cleaned = cleaned.replace(/<p><br><\/p>/gi, '');
        cleaned = cleaned.replace(/<p>&nbsp;<\/p>/gi, '');
        cleaned = cleaned.replace(/<p>\s*<\/p>/gi, '');
        cleaned = cleaned.replace(/(<br\s*\/?>\s*){2,}/gi, '<br/>');
        return cleaned;
    };

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0CA201" />
                <Text style={styles.loaderText}>Loading {title}...</Text>
            </View>
        );
    }

    if (error || !data) {
        return (
            <View style={styles.loaderContainer}>
                <Text style={styles.errorText}>Unable to load content.</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={fetchContent}>
                    <Text style={styles.retryBtnText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const cleanHtml = sanitizeHtml(data?.content);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {cleanHtml ? (
                <RenderHtml
                    contentWidth={width - 32}
                    source={{ html: cleanHtml }}
                    baseStyle={{ color: '#1E293B', fontSize: 14 }}
                    ignoredStyles={['font-family', 'letter-spacing', 'line-height', 'background-color', 'height', 'width', 'display']}
                    enableExperimentalBRCollapsing={true}
                    enableExperimentalGhostLinesPrevention={true}
                    tagsStyles={{
                        body: { color: '#1E293B', fontSize: 14 },
                        h1: { color: '#0F172A', marginTop: 14, marginBottom: 10, fontSize: 20, fontWeight: '700' },
                        h2: { color: '#0F172A', marginTop: 12, marginBottom: 8, fontSize: 18, fontWeight: '700' },
                        h3: { color: '#0F172A', marginTop: 10, marginBottom: 6, fontSize: 16, fontWeight: '600' },
                        p: { color: '#1E293B', fontSize: 14, marginBottom: 10, fontWeight: '400' },
                        span: { color: '#1E293B', fontSize: 14, fontWeight: '400' },
                        div: { color: '#1E293B', fontSize: 14, fontWeight: '400' },
                        ul: { marginTop: 4, marginBottom: 10, paddingLeft: 12 },
                        ol: { marginTop: 4, marginBottom: 10, paddingLeft: 12 },
                        li: { color: '#1E293B', fontSize: 14, marginBottom: 4, fontWeight: '400' },
                        strong: { color: '#059669', fontWeight: '700' },
                        b: { color: '#0F172A', fontWeight: '700' },
                        a: { color: '#059669', textDecorationLine: 'underline', fontWeight: '500' }
                    }}
                />
            ) : (
                <Text style={styles.emptyText}>No content available for this section.</Text>
            )}
            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    content: { paddingHorizontal: 16, paddingVertical: 12 },
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 20 },
    loaderText: { marginTop: 10, color: '#64748B', fontSize: 14 },
    errorText: { textAlign: 'center', color: '#EF4444', fontSize: 15, fontWeight: '500' },
    emptyText: { textAlign: 'center', marginTop: 40, color: '#64748B', fontSize: 14 },
    retryBtn: { marginTop: 16, backgroundColor: '#0CA201', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
    retryBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 }
});

export default InformationScreen;