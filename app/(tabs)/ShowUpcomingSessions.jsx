import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/firebase';
import Legend from './Legend';

const SESSION_TYPES = [
  { label: 'ROUTINE VOLUNTEERING STILL AVAILABLE', value: 'ROUTINE_AVAILABLE' },
  { label: 'Change in schedule', value: 'CHANGE_SCHEDULE' },
  { label: 'New Competitions', value: 'NEW_COMPETITIONS' },
  { label: 'Other Volunteering', value: 'OTHER_VOLUNTEERING' },
  { label: 'ROUTINE VOLUNTEERING OVERBOOKED', value: 'ROUTINE_OVERBOOKED' },
];

const SESSION_COLORS = {
  ROUTINE_AVAILABLE: 'blue',
  CHANGE_SCHEDULE: 'red',
  NEW_COMPETITIONS: 'green',
  OTHER_VOLUNTEERING: 'yellow',
  ROUTINE_OVERBOOKED: 'orange',
};

const ShowUpcomingSessions = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [hasBooked, setHasBooked] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const sessionsCol = collection(db, 'sessions');
      const sessionsSnapshot = await getDocs(sessionsCol);
      let marks = {};

      sessionsSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const date = data.date;
        const type = data.sessionType;

        marks[date] = {
          selected: true,
          marked: true,
          selectedColor: SESSION_COLORS[type],
          dots: [
            {
              key: type,
              color: SESSION_COLORS[type],
            },
          ],
          sessionData: { ...data, id: docSnap.id },
        };
      });

      setMarkedDates(marks);
    } catch (error) {
      console.log('Error fetching sessions:', error);
      Alert.alert('Error', 'Unable to fetch sessions.');
    }
    setIsLoading(false);
  };

  const fetchBookingStatus = async (sessionId) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'bookings'),
      where('sessionId', '==', sessionId),
      where('userId', '==', user.uid)
    );

    const snapshot = await getDocs(q);
    setHasBooked(!snapshot.empty);
  };

  const onDayPress = async (day) => {
    const selectedDateData = markedDates[day.dateString];
    if (selectedDateData && selectedDateData.sessionData) {
      const session = selectedDateData.sessionData;
      setSelectedSession(session);
      await fetchBookingStatus(session.id);
      setModalVisible(true);
    } else {
      Alert.alert('No session', 'No sessions scheduled on this date.');
    }
  };

  const bookSession = async () => {
    if (!selectedSession) return;

    const auth = getAuth();
    const user = auth.currentUser;

    try {
      let userName = 'Unnamed Volunteer';
      let userEmail = user?.email || 'No Email';

      if (user?.uid) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          userName = userData.name || userName;
        }
      }

      const bookingData = {
        sessionId: selectedSession.id || 'unknown',
        sessionType: selectedSession.sessionType,
        date: selectedSession.date,
        description: selectedSession.description || '',
        bookedAt: new Date().toISOString(),
        userId: user?.uid || 'anonymous',
        userName,
        userEmail,
      };

      await addDoc(collection(db, 'bookings'), bookingData);

      Alert.alert('Success', 'You have successfully booked the session!');
      setHasBooked(true);
      setModalVisible(false);
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'Failed to book the session. Please try again.');
    }
  };

  const cancelBooking = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || !selectedSession) return;

    try {
      const q = query(
        collection(db, 'bookings'),
        where('sessionId', '==', selectedSession.id),
        where('userId', '==', user.uid)
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        Alert.alert('Error', 'No booking found to cancel.');
        return;
      }

      const bookingDoc = snapshot.docs[0];
      await deleteDoc(doc(db, 'bookings', bookingDoc.id));

      Alert.alert('Cancelled', 'Your booking has been cancelled.');
      setHasBooked(false);
      setModalVisible(false);
    } catch (error) {
      console.error('Cancellation error:', error);
      Alert.alert('Error', 'Failed to cancel booking. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.headerText}>Running Hour</Text>
      </View>

      <Text style={styles.title}>Upcoming Activities</Text>

      {isLoading && <ActivityIndicator size="large" color="#19235E" />}

      <Calendar
        onDayPress={onDayPress}
        markedDates={markedDates}
        markingType={'multi-dot'}
        theme={{
          selectedDayBackgroundColor: '#19235E',
          todayTextColor: '#19235E',
          arrowColor: '#19235E',
          dotColor: '#19235E',
          selectedDotColor: '#fff',
          selectedDayTextColor: '#fff',
          calendarBackground: '#DDE4CB',
          textSectionTitleColor: '#19235E',
          dayTextColor: '#000',
          monthTextColor: '#19235E',
          textDisabledColor: '#d9e1e8',
        }}
      />

      <Legend sessionTypes={SESSION_TYPES} sessionColors={SESSION_COLORS} />

      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Session Details</Text>

          {selectedSession ? (
            <>
              <Text style={styles.sessionType}>Type: {selectedSession.sessionType}</Text>
              <Text style={styles.sessionDescription}>
                Description: {selectedSession.description || 'No description provided'}
              </Text>
            </>
          ) : (
            <Text>No session data available</Text>
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            {hasBooked ? (
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: '#e74c3c', flex: 1, marginRight: 10 }]}
                onPress={cancelBooking}
              >
                <Text style={styles.closeButtonText}>Cancel Booking</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: '#19235E', flex: 1, marginRight: 10 }]}
                onPress={bookSession}
              >
                <Text style={styles.closeButtonText}>Book Now</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: '#aaa', flex: 1 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#DDE4CB',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19235E',
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 30,
    color: '#19235E',
    textAlign: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#19235E',
    textAlign: 'center',
  },
  sessionType: {
    fontSize: 16,
    color: '#19235E',
    marginBottom: 10,
  },
  sessionDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ShowUpcomingSessions;
