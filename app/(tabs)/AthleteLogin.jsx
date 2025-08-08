import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
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
import { auth } from '../../config/firebase';

const AthleteLogin = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // New states for registration questions
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [membershipNumber, setMembershipNumber] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [race, setRace] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [role, setRole] = useState('');
  const [trainingPreference, setTrainingPreference] = useState('');
  const [remarks, setRemarks] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Logged in successfully!');
      navigation.replace('AthleteDashboard');
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.headerText}>Running Hour</Text>
      </View>

      <Text style={styles.title}>Buddy Login</Text>

      {/* Full Name */}
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        placeholderTextColor="#888"
        value={fullName}
        onChangeText={setFullName}
      />

      {/* Gender */}
      <Text style={styles.label}>Select your gender</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={setGender}
          style={styles.picker}
        >
          <Picker.Item label="Select gender..." value="" />
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
        </Picker>
      </View>

      {/* Membership Number */}
      <Text style={styles.label}>Membership Number - New Guides/Buddies, please indicate 0.</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter membership number"
        placeholderTextColor="#888"
        value={membershipNumber}
        onChangeText={setMembershipNumber}
        keyboardType="numeric"
      />

      {/* Age Group */}
      <Text style={styles.label}>Age Group</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={ageGroup}
          onValueChange={setAgeGroup}
          style={styles.picker}
        >
          <Picker.Item label="Select age group..." value="" />
          <Picker.Item label="Below 13" value="Below 13" />
          <Picker.Item label="13 - 25" value="13 - 25" />
          <Picker.Item label="26 - 49" value="26 - 49" />
          <Picker.Item label="50 and above" value="50 and above" />
        </Picker>
      </View>

      {/* Race */}
      <Text style={styles.label}>Race</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={race}
          onValueChange={setRace}
          style={styles.picker}
        >
          <Picker.Item label="Select race..." value="" />
          <Picker.Item label="Chinese" value="Chinese" />
          <Picker.Item label="Indian" value="Indian" />
          <Picker.Item label="Malay" value="Malay" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      {/* Contact Number */}
      <Text style={styles.label}>Contact Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter contact number"
        placeholderTextColor="#888"
        value={contactNumber}
        onChangeText={setContactNumber}
        keyboardType="phone-pad"
      />

      {/* Role */}
      <Text style={styles.label}>I am a ... (Indicate under "Remarks" if you are new to Runninghour)</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          onValueChange={setRole}
          style={styles.picker}
        >
          <Picker.Item label="Select role..." value="" />
          <Picker.Item label="Buddy with autism and/or an intellectual disability" value="Buddy with autism and/or an intellectual disability" />
          <Picker.Item label="Buddy with a visual impairment" value="Buddy with a visual impairment" />
          <Picker.Item label="Buddy with a hearing impairment" value="Buddy with a hearing impairment" />
          <Picker.Item label="Buddy with other physical impairments" value="Buddy with other physical impairments" />
          <Picker.Item label="Guide (Inducted)" value="Guide (Inducted)" />
          <Picker.Item label="Guide (Not Inducted)" value="Guide (Not Inducted)" />
          <Picker.Item label="Caregiver (attending but not guiding)" value="Caregiver (attending but not guiding)" />
        </Picker>
      </View>

      {/* Training Preference */}
      <Text style={styles.label}>Training preference (State under "Remarks" if there is any training goals set for the year i.e. complete 10km, half marathon, etc. with targeted timing)</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={trainingPreference}
          onValueChange={setTrainingPreference}
          style={styles.picker}
        >
          <Picker.Item label="Select training preference..." value="" />
          <Picker.Item label="Team A : Long Run (7KM - 8KM)" value="Team A : Long Run (7KM - 8KM)" />
          <Picker.Item label="Team B : Medium Run (5KM - 7KM)" value="Team B : Medium Run (5KM - 7KM)" />
          <Picker.Item label="Team C : Short Run (3KM - 5 KM)" value="Team C : Short Run (3KM - 5 KM)" />
          <Picker.Item label="Team D : Walking" value="Team D : Walking" />
        </Picker>
      </View>

      {/* Remarks */}
      <Text style={styles.label}>Remarks</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter any remarks"
        placeholderTextColor="#888"
        value={remarks}
        onChangeText={setRemarks}
      />

      {/* Login Section */}
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

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('AthleteRegistration')}
      >
        <Text style={styles.registerButtonText}>Don't have an account? Register</Text>
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
    color: '#19235E',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: '#000',
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderColor: '#19235E',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  loginButton: {
    backgroundColor: '#19235E',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#19235E',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AthleteLogin;
