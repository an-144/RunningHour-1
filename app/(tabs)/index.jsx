import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, usersRef } from '../../config/firebase';

const RegistrationScreen = () => {
  const navigation = useNavigation();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    const navigateToDashboard = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(usersRef, user.uid));
          if (userDoc.exists()) {
            const userType = userDoc.data().userType;
            navigation.replace(`${userType}Dashboard`);
          }
        } catch (error) {
          console.error('Failed to fetch user type:', error);
        }
      }
    };

    navigateToDashboard();
  }, [user, navigation]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logged Out', 'You have been logged out successfully.');
      navigation.replace('index');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Logo and Text */}
      <View style={styles.headerContainer}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.headerText}>Running Hour</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Registration</Text>

      {/* Buttons */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('VolunteerRegistration')}>
        <Text style={styles.buttonText}>Guide</Text>
        <Icon name="account-heart" size={24} color="#19235E" style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AthleteRegistration')}>
        <Text style={styles.buttonText}>Buddy</Text>
        <View style={styles.iconGroup}>
          <Icon name="trophy-award" size={24} color="#19235E" style={styles.icon} />
          <Icon name="wheelchair-accessibility" size={24} color="#19235E" style={styles.icon} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ManagementRegistration')}>
        <Text style={styles.buttonText}>Management</Text>
        <Icon name="account-group" size={24} color="#19235E" style={styles.icon} />
      </TouchableOpacity>

      {/* Sign in as a different user */}
      <TouchableOpacity onPress={handleLogout} style={styles.differentUserContainer}>
        <Text style={styles.differentUserText}>Sign up as a different user</Text>
      </TouchableOpacity>

      {/* Already have an account text */}
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginContainer}>
        <Text style={styles.loginText}>ALREADY HAVE AN ACCOUNT? </Text>
        <Text style={[styles.loginText, styles.clickHereText]}>CLICK HERE</Text>
      </TouchableOpacity>

      {/* Images at the bottom */}
      {/* <View style={styles.imageContainer}>
        <Image source={require('../../assets/images/image1.png')} style={styles.image} />
        <Image source={require('../../assets/images/image2.png')} style={[styles.image, styles.middleImage]} />
        <Image source={require('../../assets/images/image3.png')} style={styles.image} />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDE4CB',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    left: 20,
    marginTop: 50,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19235E',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#19235E',
    marginBottom: 40,
    marginTop: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    marginBottom: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    fontSize: 22,
    color: '#19235E',
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 10,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  differentUserContainer: {
    marginTop: 20,
  },
  differentUserText: {
    color: '#19235E',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#19235E',
    fontWeight: '500',
  },
  clickHereText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 30,
    marginBottom: -60,
    marginRight: 50,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  middleImage: {
    marginTop: 30,
  },
});

export default RegistrationScreen;
