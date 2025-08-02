// src/components/ShowEnquiry.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { db } from '../../config/firebase'; // Adjust the import path according to your project structure
import { collection, getDocs, orderBy, query } from "firebase/firestore";

const ShowEnquiry = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    // Fetch enquiries from Firestore
    const fetchEnquiries = async () => {
        setIsLoading(true);
        try {
            const enquiriesRef = collection(db, 'enquiries');
            const q = query(enquiriesRef, orderBy('createdAt', 'desc')); // Order by timestamp
            const querySnapshot = await getDocs(q);
            
            const enquiriesList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setEnquiries(enquiriesList);
        } catch (error) {
            console.error("Error fetching enquiries: ", error);
            Alert.alert("Error", "Unable to fetch enquiries.");
        }
        setIsLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>All Enquiries</Text>

            {isLoading ? (
                <ActivityIndicator size="large" color="#19235E" />
            ) : (
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    {enquiries.map((enquiry) => (
                        <View key={enquiry.id} style={styles.enquiryContainer}>
                            <Text style={styles.enquiryText}>{enquiry.text}</Text>
                            <Text style={styles.enquiryDate}>
                                {enquiry.createdAt && enquiry.createdAt.seconds
                                    ? new Date(enquiry.createdAt.seconds * 1000).toLocaleString()
                                    : "Date not available"}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#DDE4CB',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#19235E',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 50,
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    enquiryContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        borderColor: '#19235E',
        borderWidth: 1,
    },
    enquiryText: {
        fontSize: 16,
        color: '#333',
    },
    enquiryDate: {
        fontSize: 12,
        color: '#666',
        marginTop: 8,
        textAlign: 'right',
    },
});

export default ShowEnquiry;
