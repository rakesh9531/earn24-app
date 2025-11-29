// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { usePincode } from '../context/PincodeContext';

// const LocationHeader = ({ onPress }) => {
//     const { pincode } = usePincode();

//     return (
//         <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
//             <Icon name="location-outline" size={20} color="#333" />
//             <View style={styles.textContainer}>
//                 <Text style={styles.label}>DELIVER TO</Text>
//                 <Text style={styles.pincodeText}>{pincode || 'Select'}</Text>
//             </View>
//             <Icon name="chevron-down" size={20} color="#333" />
//         </TouchableOpacity>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flexDirection: 'row', alignItems: 'center', padding: 5 },
//     textContainer: { marginHorizontal: 8 },
//     label: { fontSize: 10, color: '#777', textTransform: 'uppercase' },
//     pincodeText: { fontSize: 16, fontWeight: 'bold', color: '#333' }
// });

// export default LocationHeader;








import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { usePincode } from '../context/PincodeContext';

// --- DESIGN SYSTEM CONSTANTS (for a professional & consistent look) ---
const COLORS = {
  text: '#1F2937',
  textLight: '#6B7280',
};

const SIZES = {
  base: 8,
};

const FONTS = {
  h4: { fontSize: 16, fontWeight: '600' },
  label: { fontSize: 11, fontWeight: '700' },
};


// --- THE POLISHED LOCATION HEADER COMPONENT ---
const LocationHeader = ({ onPress }) => {
    // Get the current pincode from your global context
    const { pincode } = usePincode();

    return (
        // The entire component is a button that triggers the onPress function
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            {/* Location Icon */}
            <Icon name="location-outline" size={22} color={COLORS.text} />

            {/* Container for the two lines of text */}
            <View style={styles.textContainer}>
                <Text style={styles.label}>DELIVER TO</Text>
                
                {/* A row for the pincode and the chevron, to keep them together */}
                <View style={styles.pincodeRow}>
                    <Text style={styles.pincodeText}>{pincode || 'Select Pincode'}</Text>
                    <Icon name="chevron-down" size={16} color={COLORS.text} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

// --- STYLES (Refactored for Professional Quality) ---
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SIZES.base / 2, // A little vertical padding
    },
    textContainer: {
        marginLeft: SIZES.base, // Space between icon and text
    },
    label: {
        ...FONTS.label,
        color: COLORS.textLight,
        textTransform: 'uppercase', // Professional look
        letterSpacing: 0.5,         // Adds a bit of breathing room
        marginBottom: 2,
    },
    pincodeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4, // Clean spacing between pincode and chevron
    },
    pincodeText: {
        ...FONTS.h4,
        color: COLORS.text,
    }
});

export default LocationHeader;