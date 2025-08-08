import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { db, storage } from '../../config/firebase';

const ManageLocations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLocations = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'event_locations'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleDelete = async (id, imageUrl) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete Firestore doc
              await deleteDoc(doc(db, 'event_locations', id));

              // Delete image from storage
              const imageRef = ref(storage, imageUrl);
              await deleteObject(imageRef);

              // Update local state
              setLocations(prev => prev.filter(loc => loc.id !== id));

              Alert.alert('Deleted', 'Location deleted successfully');
            } catch (error) {
              console.error('Error deleting location:', error);
              Alert.alert('Error', 'Failed to delete location');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#19235E" />
      </View>
    );
  }

  if (locations.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.noDataText}>No event locations found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text
        style={styles.title}
        accessibilityLabel="Manage Event Locations"
        accessibilityRole="header"
      >
        Manage Event Locations
      </Text>
      <FlatList
        data={locations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View
            style={styles.card}
            accessibilityLabel={`Event location card for ${item.locationName}. Description: ${item.description}`}
            accessibilityRole="summary"
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
              accessibilityLabel={`Image of ${item.locationName}`}
            />
            <View style={styles.info}>
              <Text
                style={styles.locationName}
                accessibilityLabel={`Location name: ${item.locationName}`}
              >
                {item.locationName}
              </Text>
              <Text
                style={styles.description}
                accessibilityLabel={`Description: ${item.description}`}
              >
                {item.description}
              </Text>
              {/* Uncomment to enable delete button with accessibility features
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id, item.imageUrl)}
                accessibilityLabel={`Delete ${item.locationName} location`}
                accessibilityRole="button"
              >
                <Icon name="trash-bin" size={20} color="#fff" accessibilityLabel="Trash bin icon" />
                <Text style={styles.deleteText} accessibilityLabel="Delete">
                  Delete
                </Text>
              </TouchableOpacity>
              */}
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DDE4CB',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDE4CB',
  },
  noDataText: {
    fontSize: 16,
    color: '#19235E',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#19235E',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: 'row',
  },
  image: {
    width: 120,
    height: 120,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#19235E',
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginTop: 5,
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#d9534f',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  deleteText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
  },
});

export default ManageLocations;
