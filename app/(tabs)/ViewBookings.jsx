import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { db } from '../../config/firebase';

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'bookings'));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(data);
    } catch (error) {
      console.log('Error fetching bookings:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Volunteer Bookings</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#19235E" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {bookings.length === 0 ? (
            <Text style={styles.noData}>No bookings available.</Text>
          ) : (
            bookings.map((booking) => (
              <View key={booking.id} style={styles.card}>
                <Text style={styles.label}>Guide Name:</Text>
                <Text style={styles.value}>{booking.userName}</Text>

                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{booking.userEmail}</Text>

                <Text style={styles.label}>Phone Number:</Text>
                <Text style={styles.value}>{booking.userPhone || 'No phone number'}</Text>

                <Text style={styles.label}>Session Type:</Text>
                <Text style={styles.value}>{booking.sessionType}</Text>

                <Text style={styles.label}>Date:</Text>
                <Text style={styles.value}>{booking.date}</Text>

                <Text style={styles.label}>Description:</Text>
                <Text style={styles.value}>
                  {booking.description || 'No description'}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDE4CB',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#19235E',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  label: {
    fontWeight: '600',
    color: '#19235E',
  },
  value: {
    marginBottom: 8,
    color: '#333',
  },
  noData: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
});

export default ViewBookings;
