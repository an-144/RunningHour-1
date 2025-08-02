import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header with Logo and Text */}
      <View style={styles.headerContainer}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.headerText}>Running Hour</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Login</Text>

      {/* Buttons */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('VolunteerLogin')}>
        <Text style={styles.buttonText}>Guide</Text>
        <Icon name="account-heart" size={24} color="#19235E" style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AthleteLogin')}>
        <Text style={styles.buttonText}>Buddy</Text>
        <View style={styles.iconGroup}>
          <Icon name="trophy-award" size={24} color="#19235E" style={styles.icon} />
          <Icon name="wheelchair-accessibility" size={24} color="#19235E" style={styles.icon} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ManagementLogin')}>
        <Text style={styles.buttonText}>Management</Text>
        <Icon name="account-group" size={24} color="#19235E" style={styles.icon} />
      </TouchableOpacity>

      {/* Already have an account text */}
      {/* <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginContainer}>
        <Text style={styles.loginText}>ALREADY HAVE AN ACCOUNT? </Text>
        <Text style={[styles.loginText, styles.clickHereText]}>CLICK HERE</Text>
      </TouchableOpacity> */}

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
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Vertically center items
    position: 'absolute',
    top: 20,
    left: 20,
    marginTop: 50,
  },
  logo: {
    width: 40, // Adjust size according to your logo
    height: 40,
    marginRight: 10, // Adds space between logo and text
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
    marginRight: 50
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

export default Login;
