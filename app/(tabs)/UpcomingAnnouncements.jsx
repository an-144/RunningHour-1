import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the Icon component
import { db } from '../../config/firebase'; // Adjust the import path according to your project structure

const UpcomingAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const announcementsRef = collection(db, 'announcements');
                const querySnapshot = await getDocs(announcementsRef);
                
                const fetchedAnnouncements = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                
                setAnnouncements(fetchedAnnouncements);
            } catch (error) {
                console.error("Error fetching announcements: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#19235E" />
            </View>
        );
    }

    const handleThumbsUp = async (id, likes) => {
        const userId = 'currentUserId'; // Replace with actual user ID logic
        const newLikes = likes.includes(userId) ? likes.filter(uid => uid !== userId) : [...likes, userId];

        try {
            const announcementRef = doc(db, 'announcements', id);
            await updateDoc(announcementRef, { likes: newLikes });
            setAnnouncements(prevAnnouncements =>
                prevAnnouncements.map(announcement =>
                    announcement.id === id ? { ...announcement, likes: newLikes } : announcement
                )
            );
        } catch (error) {
            console.error("Error updating likes: ", error);
            Alert.alert("Error", "Unable to update likes. Please try again.");
        }
    };

    const handleBookmark = async (id, bookmarks) => {
        const userId = 'currentUserId'; // Replace with actual user ID logic
        const newBookmarks = bookmarks.includes(userId) ? bookmarks.filter(uid => uid !== userId) : [...bookmarks, userId];

        try {
            const announcementRef = doc(db, 'announcements', id);
            await updateDoc(announcementRef, { bookmarks: newBookmarks });
            setAnnouncements(prevAnnouncements =>
                prevAnnouncements.map(announcement =>
                    announcement.id === id ? { ...announcement, bookmarks: newBookmarks } : announcement
                )
            );
        } catch (error) {
            console.error("Error updating bookmarks: ", error);
            Alert.alert("Error", "Unable to update bookmarks. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text
                style={styles.title}
                accessibilityLabel="Weekly Activities"
                accessibilityRole="header"
            >
                Weekly Activities
            </Text>
            {announcements.length === 0 ? (
                <Text
                    style={styles.noAnnouncementsText}
                    accessibilityLabel="No announcements available."
                >
                    No announcements available.
                </Text>
            ) : (
                <FlatList
                    data={announcements}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View
                            style={styles.announcementContainer}
                            accessibilityLabel={`Announcement: ${item.text}. Date: ${item.createdAt.toDate().toLocaleString()}`}
                            accessibilityRole="text"
                        >
                            <Text
                                style={styles.announcementText}
                                accessibilityLabel={`Announcement text: ${item.text}`}
                            >
                                {item.text}
                            </Text>
                            <Text
                                style={styles.dateText}
                                accessibilityLabel={`Announcement date: ${item.createdAt.toDate().toLocaleString()}`}
                            >
                                {item.createdAt.toDate().toLocaleString()}
                            </Text>
                            <View style={styles.actionsContainer}>
                                <TouchableOpacity
                                    onPress={() => handleThumbsUp(item.id, item.likes || [])}
                                    accessibilityLabel={item.likes?.includes('currentUserId')
                                        ? "Remove thumbs up from this announcement"
                                        : "Give thumbs up to this announcement"}
                                    accessibilityRole="button"
                                >
                                    <Icon
                                        name={item.likes?.includes('currentUserId') ? "thumbs-up" : "thumbs-up-outline"}
                                        size={24}
                                        color="#19235E"
                                        accessibilityLabel="Thumbs up icon"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleBookmark(item.id, item.bookmarks || [])}
                                    accessibilityLabel={item.bookmarks?.includes('currentUserId')
                                        ? "Remove bookmark from this announcement"
                                        : "Bookmark this announcement"}
                                    accessibilityRole="button"
                                >
                                    <Icon
                                        name={item.bookmarks?.includes('currentUserId') ? "bookmark" : "bookmark-outline"}
                                        size={24}
                                        color="#19235E"
                                        accessibilityLabel="Bookmark icon"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DDE4CB',
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#DDE4CB',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
        color: '#19235E',
        textAlign: 'center',
        marginTop: 50,
    },
    noAnnouncementsText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#19235E',
    },
    announcementContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    announcementText: {
        fontSize: 16,
        color: '#19235E',
    },
    dateText: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
    },
    actionsContainer: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between',
        width: '30%', // Adjust width as needed
    },
});

export default UpcomingAnnouncements;