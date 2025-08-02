import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, usersRef } from '../../config/firebase';

const AthleteRegistration = () => {
  const navigation = useNavigation();

  // State for form inputs
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sport, setSport] = useState('');
  const [additionalSports, setAdditionalSports] = useState('');
  const [userType, setUserType] = useState('Athlete'); // Default user type
  const [phone, setPhone] = useState(''); // Add phone state

  useEffect(() => {
    if (user) {
      navigation.replace('AthleteDashboard');
    }
  }, [user]);
  const handleSubmit = async () => {
    if (!name || !email || !password || !sport || !phone) { // Add phone to validation
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(usersRef, userCredential.user.uid), {
        name,
        email,
        phone, // Add phone to Firestore document
        sport,
        additionalSports,
        userType,
      });
      Alert.alert('Success', 'Registration successful!');
      navigation.replace('AthleteDashboard');
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.headerText}>Running Hour</Text>
      </View>

      <Text style={styles.title}>User Registration</Text>

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
        secureTextEntry // Secure password input
      />

      <TextInput
        style={styles.input}
        placeholder="Primary Sport"
        placeholderTextColor="#888"
        value={sport}
        onChangeText={setSport}
      />

      <TextInput
        style={styles.input}
        placeholder="If more than one sport, list them here"
        placeholderTextColor="#888"
        value={additionalSports}
        onChangeText={setAdditionalSports}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#888"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
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
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#19235E',
  },
  userTypeText: {
    color: '#19235E',
    fontWeight: '600',
  },
  activeTextColor: {
    color: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#19235E',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#19235E',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AthleteRegistration;
