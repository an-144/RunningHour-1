// src/components/AthleteDashboard.js

import { useNavigation } from '@react-navigation/native';
import { useState } from 'react'; // Import useState
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // For icons

const AthleteDashboard = () => {
  const navigation = useNavigation();
  const [phone, setPhone] = useState(''); // Add this if you fetch phone from backend
  const userEmail = ''; // Replace with actual user email state or prop

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.headerText}>RunningHour</Text>
      </View>

      {/* Optionally, display phone number below the header: */}
      <Text style={styles.infoText}>Email: {userEmail || 'Not available'}</Text>
      <Text style={styles.infoText}>Phone: {phone || 'Not available'}</Text>

      {/* Title */}
      <Text style={styles.title}>Guide Dashboard</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {/* Upcoming Sessions/Tournaments Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ShowUpcomingSessions')}
          accessibilityLabel="Upcoming Sessions and Tournaments Button"
          accessibilityHint="Navigate to view upcoming sessions and tournaments"
        >
          <Ionicons name="calendar-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>Upcoming Sessions/Tournaments</Text>
        </TouchableOpacity>

        {/* Transportation Enquiries Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('UpdateEnquiry')}
          accessibilityLabel="Transportation Enquiries Button"
          accessibilityHint="Navigate to submit transportation enquiries"
        >
          <Ionicons name="bus-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>Transportation Enquiries</Text>
        </TouchableOpacity>

        {/* Upcoming Announcements Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('UpcomingAnnouncements')}
          accessibilityLabel="Upcoming Announcements Button"
          accessibilityHint="Navigate to view upcoming announcements"
        >
          <Ionicons name="megaphone-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>Upcoming Announcements</Text>
        </TouchableOpacity>

        {/* Videos on Sports Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SelectSport')}
          accessibilityLabel="Videos on Sports Button"
          accessibilityHint="Navigate to view sports-related videos"
        >
          <Ionicons name="videocam-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>Videos on Sports</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#DDE4CB', // Background color
  },
  headerContainer: {
    flexDirection: 'row', // Align header elements in a row
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  logo: {
    width: 40, // Adjusted logo size
    height: 40,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19235E',
    marginLeft: 10, // Space between logo and text
  },
  infoText: {
    fontSize: 16,
    color: '#19235E',
    textAlign: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 30,
    color: '#19235E',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#19235E',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    marginBottom: 20,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    // Elevation for Android
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 15,
  },
});

export default AthleteDashboard;
