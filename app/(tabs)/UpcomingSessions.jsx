import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';
import { db } from '../../config/firebase';
import Legend from './Legend'; // Import the Legend component

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

const UpcomingSessions = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedSessionType, setSelectedSessionType] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  // Fetch sessions from Firestore
  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const sessionsCol = collection(db, 'sessions');
      const sessionsSnapshot = await getDocs(sessionsCol);
      let marks = {};

      sessionsSnapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.date; // Expected format: 'YYYY-MM-DD'
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
        };
      });

      setMarkedDates(marks);
    } catch (error) {
      console.log('Error fetching sessions:', error);
      Alert.alert('Error', 'Unable to fetch sessions.');
    }
    setIsLoading(false);
  };

  // Handle day press
  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    setSelectedSessionType('');
    setDescription('');
    setModalVisible(true);
  };

  // Handle session type selection
  const handleSessionTypeSelect = (type) => {
    setSelectedSessionType(type);
  };

  // Handle saving session
  const handleSaveSession = async () => {
    if (!selectedSessionType) {
      Alert.alert('Validation Error', 'Please select a session type.');
      return;
    }

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'sessions'), {
        date: selectedDate,
        sessionType: selectedSessionType,
        description: description.trim(),
        createdAt: serverTimestamp(),
      });

      // Update markedDates
      setMarkedDates((prev) => ({
        ...prev,
        [selectedDate]: {
          selected: true,
          marked: true,
          selectedColor: SESSION_COLORS[selectedSessionType],
          dots: [
            {
              key: selectedSessionType,
              color: SESSION_COLORS[selectedSessionType],
            },
          ],
        },
      }));

      Alert.alert('Success', 'Session added successfully!');
      setModalVisible(false);
    } catch (error) {
      console.log('Error saving session:', error);
      Alert.alert('Error', 'Unable to save the session. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          accessibilityLabel="Running Hour logo"
        />
        <Text
          style={styles.headerText}
          accessibilityLabel="SCDC SMART header"
          accessibilityRole="header"
        >
          SCDC SMART
        </Text>
      </View>

      {/* Title */}
      <Text
        style={styles.title}
        accessibilityLabel="Upcoming Sessions"
        accessibilityRole="header"
      >
        Upcoming Sessions
      </Text>

      {/* Loading Indicator */}
      {isLoading && <ActivityIndicator size="large" color="#19235E" />}

      {/* Calendar */}
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
        accessibilityLabel="Calendar showing upcoming sessions. Select a date to add or view a session."
        accessibilityRole="adjustable"
      />

      {/* Legend */}
      <Legend
        sessionTypes={SESSION_TYPES}
        sessionColors={SESSION_COLORS}
        accessibilityLabel="Legend for session types and colors."
        accessibilityRole="summary"
      />

      {/* Modal for session type selection */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent} accessibilityLabel="Session type selection modal">
          <Text
            style={styles.modalTitle}
            accessibilityLabel="Select Session Type"
            accessibilityRole="header"
          >
            Select Session Type
          </Text>

          {/* Session Type Buttons */}
          {SESSION_TYPES.map((session) => (
            <TouchableOpacity
              key={session.value}
              style={[
                styles.sessionTypeButton,
                selectedSessionType === session.value && styles.sessionTypeButtonSelected,
                { backgroundColor: SESSION_COLORS[session.value] },
              ]}
              onPress={() => handleSessionTypeSelect(session.value)}
              accessibilityLabel={`Session type: ${session.label}`}
              accessibilityRole="button"
            >
              <Text
                style={styles.sessionTypeButtonText}
                accessibilityLabel={`Session type option: ${session.label}`}
              >
                {session.label}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Description Input */}
          {selectedSessionType && (
            <View style={styles.descriptionContainer}>
              <Text
                style={styles.descriptionLabel}
                accessibilityLabel="Description"
              >
                Description:
              </Text>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Add a description..."
                placeholderTextColor="#888"
                value={description}
                onChangeText={setDescription}
                multiline
                accessibilityLabel="Enter session description"
              />
            </View>
          )}

          {/* Buttons */}
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveSession}
              disabled={isLoading}
              accessibilityLabel="Save session"
              accessibilityRole="button"
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" accessibilityLabel="Saving session, please wait." />
              ) : (
                <Text style={styles.saveButtonText} accessibilityLabel="Save">
                  Save
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
              disabled={isLoading}
              accessibilityLabel="Cancel session creation"
              accessibilityRole="button"
            >
              <Text style={styles.cancelButtonText} accessibilityLabel="Cancel">
                Cancel
              </Text>
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
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#19235E',
    textAlign: 'center',
  },
  sessionTypeButton: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  sessionTypeButtonSelected: {
    borderWidth: 2,
    borderColor: '#19235E',
  },
  sessionTypeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#19235E',
    marginBottom: 5,
  },
  descriptionInput: {
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: '#000',
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#19235E',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UpcomingSessions;
