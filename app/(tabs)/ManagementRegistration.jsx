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

const ManagementRegistration = () => {
  const navigation = useNavigation();

  // State for form inputs
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sdscteam, setSdscteam] = useState('');
  const [userType, setUserType] = useState('Management'); // Default user type

  useEffect(() => {
    if (user) {
      navigation.replace('ManagementDashboard');
    }
  }, [user]);

  // Form submission handler
  const handleSubmit = async () => {
    try {
      if (!name.trim() || !email.trim() || !password.trim() || !sdscteam.trim()) {
        Alert.alert('Validation Error', 'Please fill in all fields.');
        return;
      }

      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // User data to store in Firestore
      const userData = {
        uid: user.uid,
        name,
        email,
        sdscteam,
        userType, // Save user type in Firestore
      };

      // Add user data to Firestore
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

      <Text style={styles.title}>Management Registration</Text>

      <Text style={styles.label}>Select User Type:</Text>
      <View style={styles.userTypeContainer}>
        <TouchableOpacity
          style={[styles.userTypeButton, userType === 'Volunteer' && styles.activeButton]}
          onPress={() => setUserType('Volunteer')}
        >
          <Text style={[styles.userTypeText, userType === 'Volunteer' && styles.activeText]}>
            Volunteer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.userTypeButton, userType === 'Management' && styles.activeButton]}
          onPress={() => setUserType('Management')}
        >
          <Text style={[styles.userTypeText, userType === 'Management' && styles.activeText]}>
            Management
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.userTypeButton, userType === 'Athlete' && styles.activeButton]}
          onPress={() => setUserType('Athlete')}
        >
          <Text style={[styles.userTypeText, userType === 'Athlete' && styles.activeText]}>
            Athlete
          </Text>
        </TouchableOpacity>
      </View>

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
        placeholder="SDSC Team"
        placeholderTextColor="#888"
        value={sdscteam}
        onChangeText={setSdscteam}
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
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#19235E',
  },
  userTypeText: {
    color: '#19235E',
    fontWeight: '600',
  },
  activeText: {
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

export default ManagementRegistration;
