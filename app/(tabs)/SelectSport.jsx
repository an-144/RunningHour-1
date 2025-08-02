import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SelectSport = () => {
  const [selectedSport, setSelectedSport] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleNavigation = (type) => {
    if (selectedSport) {
      navigation.navigate('SportVideos', { sport: selectedSport, type });
    } else {
      alert('Please select a sport!');
    }
  };

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const sports = ['Stadium Run', 'Yoga', 'Marathon', '10km'];

  return (
    <View style={styles.container}>
      {/* Logo and Heading */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/logo.png')} // Local image
          style={styles.logo}
        />
        <Text style={styles.title}>Guide Learning System</Text>
      </View>

      {/* Button to Open Modal */}
      <Text style={styles.label}>Select the Sport</Text>
      <TouchableOpacity style={styles.button} onPress={openModal}>
        <Text style={styles.buttonText}>
          {selectedSport ? selectedSport : 'Choose Sport'}
        </Text>
      </TouchableOpacity>

      {/* Modal with Buttons */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select a Sport</Text>
            {sports.map((sport) => (
              <TouchableOpacity
                key={sport}
                style={styles.modalButton}
                onPress={() => {
                  setSelectedSport(sport);
                  closeModal();
                }}
              >
                <Text style={styles.modalButtonText}>{sport}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Navigation Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleNavigation('howToPlay')}
      >
        <Text style={styles.buttonText}>How to Play + Rules</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleNavigation('howToAssist')}
      >
        <Text style={styles.buttonText}>How to Assist</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#DDE4CB',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 50,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#19235E',
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    color: '#19235E',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#19235E',
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    backgroundColor: '#19235E',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SelectSport;
