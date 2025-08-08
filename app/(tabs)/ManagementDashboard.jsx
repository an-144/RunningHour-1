import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ManagementDashboard = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Management Dashboard</Text>

      <View style={styles.buttonContainer}>
        {/* Edit Session Timings Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('UpcomingSessions')}
          accessibilityLabel="Edit session timings"
          accessibilityHint="Allows you to edit the timings of existing sessions"
        >
          <Ionicons name="create-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>Edit Session Timings</Text>
        </TouchableOpacity>

        {/* Update Announcements Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('UpdateAnnouncements')}
          accessibilityLabel="Update announcements"
          accessibilityHint="Allows you to post new announcements for volunteers"
        >
          <Ionicons name="megaphone-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>Update Announcements</Text>
        </TouchableOpacity>

        {/* Data and Analytics Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('DataAndAnalytics')}
          accessibilityLabel="Data and analytics"
          accessibilityHint="Provides insights and visualizations of volunteer data"
        >
          <Ionicons name="stats-chart-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>Data and Analytics</Text>
        </TouchableOpacity>

        {/* Manage Event Locations Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('UpdateEventLocations')}
          accessibilityLabel="Manage event locations"
          accessibilityHint="Allows you to view and delete event locations"
        >
          <Ionicons name="location-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>Manage Event Locations</Text>
        </TouchableOpacity>

        {/* View Bookings Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ViewBookings')}
          accessibilityLabel="View bookings"
          accessibilityHint="Allows you to view all volunteer bookings"
        >
          <Ionicons name="book-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>View Bookings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDE4CB',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#19235E',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    backgroundColor: '#19235E',
    padding: 18,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ManagementDashboard;
