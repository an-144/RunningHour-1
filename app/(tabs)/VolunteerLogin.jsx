import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth, usersRef } from '../../config/firebase';

const VolunteerRegistration = () => {
  const navigation = useNavigation();

  // State for form inputs
  const [user] = useAuthState(auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userType, setUserType] = useState('Volunteer');
  const [phone, setPhone] = useState(''); // Add phone state

  useEffect(() => {
    if (user) {
      navigation.replace(`${userType}Dashboard`);
    }
  }, [user]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const fetchLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
      }

      let locationResult = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = locationResult.coords;
      let [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (address) {
        const formattedAddress = `${address.name || ''}, ${address.street || ''}, ${address.city || ''}, ${address.region || ''}, ${address.country || ''}`.trim();
        setLocation(formattedAddress);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch location. Please try again.');
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!name.trim() || !email.trim() || !password.trim() || !phone.trim()) { // Add phone to validation
        Alert.alert('Validation Error', 'Please fill in all fields.');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        name,
        email,
        phone, // Add phone to Firestore document
        location,
        startDate: startDate.toISOString(),
        userType,
      };

      await setDoc(doc(usersRef, user.uid), userData);

      Alert.alert('Success', 'Registration submitted successfully!');
      navigation.navigate(`${userType}Dashboard`);
    } catch (error) {
      Alert.alert('Error', error.message);
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.headerText}>Running Hour</Text>
      </View>

      <Text style={styles.title}>Guide Registration</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#888"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <View style={styles.inputWithIcon}>
        <TextInput
          style={styles.inputField}
          placeholder="Location of Volunteering"
          placeholderTextColor="#888"
          value={location}
          onChangeText={setLocation}
        />
        <TouchableOpacity onPress={fetchLocation} style={styles.iconContainer}>
          <Ionicons name="location-outline" size={24} color="#19235E" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputWithIcon}>
        <TextInput
          style={styles.inputField}
          placeholder="When did you start volunteering?"
          placeholderTextColor="#888"
          value={startDate.toLocaleDateString()}
          editable={false}
        />
        <TouchableOpacity onPress={showDatepicker} style={styles.iconContainer}>
          <Icon name="calendar" size={24} color="#19235E" />
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
          maximumDate={new Date()}
        />
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
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
    marginBottom: 15,
    color: '#19235E',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#19235E',
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  userTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#19235E',
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#19235E',
  },
  userTypeText: {
    color: '#19235E',
  },
  activeText: {
    color: '#FFF',
  },
  input: {
    height: 40,
    borderColor: '#19235E',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputField: {
    flex: 1,
    height: 40,
    borderColor: '#19235E',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },
  iconContainer: {
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#19235E',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#19235E',
    fontSize: 16,
  },
});

export default VolunteerRegistration;