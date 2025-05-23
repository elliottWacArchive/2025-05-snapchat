import React, { useState, useEffect, useContext } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
    Modal,
    Image,
    SafeAreaView,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

interface Snap {
    _id: string;
    date: string;
    from: string;
    username?: string;
}

const Messages = ({ navigation }: any) => {
    const { userToken, userName } = useContext(AuthContext);
    const [snaps, setSnaps] = useState<Snap[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentSnapImage, setCurrentSnapImage] = useState<string | null>(
        null
    );
    const [snapLoading, setSnapLoading] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const [currentSnapId, setCurrentSnapId] = useState<string | null>(null);

    useEffect(() => {
        fetchSnaps();
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (modalVisible && remainingTime > 0) {
            timer = setInterval(() => {
                setRemainingTime((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setModalVisible(false);
                        if (currentSnapId) {
                            markSnapAsSeen(currentSnapId);
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [modalVisible, remainingTime, currentSnapId]);

    const fetchSnaps = async () => {
        if (!userToken) {
            setError("Vous devez être connecté pour voir vos messages");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(
                "https://snapchat.epihub.eu/snap",
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-Type": "application/json",
                        "x-api-key":
                            "CLE_API_SUPPRIMEE",
                    },
                }
            );

            if (response.data && response.data.data) {
                const snapsWithUsernames = await Promise.all(
                    response.data.data.map(async (snap: Snap) => {
                        try {
                            const userResponse = await axios.get(
                                `https://snapchat.epihub.eu/user/${snap.from}`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${userToken}`,
                                        "Content-Type": "application/json",
                                        "x-api-key":
                                            "CLE_API_SUPPRIMEE",
                                    },
                                }
                            );
                            return {
                                ...snap,
                                username:
                                    userResponse.data?.data?.username ||
                                    "Utilisateur inconnu",
                            };
                        } catch (err) {
                            console.error(
                                "Erreur lors de la récupération de l'utilisateur:",
                                err
                            );
                            return { ...snap, username: "Utilisateur inconnu" };
                        }
                    })
                );
                setSnaps(snapsWithUsernames);
            } else {
                setSnaps([]);
            }
        } catch (err) {
            console.error("Erreur lors de la récupération des snaps:", err);
            setError("Impossible de charger vos snaps");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const markSnapAsSeen = async (snapId: string) => {
        if (!snapId || !userToken) return;

        try {
            await axios.put(
                `https://snapchat.epihub.eu/snap/seen/${snapId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-Type": "application/json",
                        "x-api-key":
                            "CLE_API_SUPPRIMEE",
                    },
                }
            );
            console.log("Snap marqué comme vu:", snapId);
        } catch (error) {
            console.error("snapId", snapId, "userToken", userToken);
            console.error("Erreur lors du marquage du snap comme vu:", error);
        }
    };

    const handleOpenSnap = async (snapId: string, username: string) => {
        try {
            setSnapLoading(true);

            const response = await axios.get(
                `https://snapchat.epihub.eu/snap/${snapId}`,
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-Type": "application/json",
                        "x-api-key":
                            "CLE_API_SUPPRIMEE",
                    },
                }
            );

            if (response.data && response.data.data) {
                const snapData = response.data.data;
                setCurrentSnapImage(snapData.image);
                setCurrentSnapId(snapId);
                setRemainingTime(snapData.duration || 5);
                setModalVisible(true);

                setTimeout(() => {
                    fetchSnaps();
                }, (snapData.duration || 5) * 1000 + 500);
            }
        } catch (error) {
            console.error("Erreur lors de l'ouverture du snap:", error);
            Alert.alert("Erreur", "Impossible d'ouvrir ce snap");
        } finally {
            setSnapLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Mes Snaps</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={fetchSnaps}
                        disabled={loading}
                    >
                        <Text style={styles.buttonIcon}>🔄</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cameraButton}
                        onPress={() => navigation.navigate("Camera")}
                    >
                        <Text style={styles.cameraButtonText}>📷</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    if (currentSnapId) {
                        markSnapAsSeen(currentSnapId);
                    }
                    setModalVisible(false);
                }}
            >
                <View style={styles.modalContainer}>
                    {currentSnapImage ? (
                        <>
                            <Image
                                source={{ uri: currentSnapImage }}
                                style={styles.snapImage}
                            />
                            <View style={styles.timerContainer}>
                                <Text style={styles.timerText}>
                                    {remainingTime}s
                                </Text>
                            </View>
                        </>
                    ) : (
                        <ActivityIndicator size="large" color="#04ff60" />
                    )}
                </View>
            </Modal>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#04ff60" />
                </View>
            ) : error ? (
                <View style={styles.centered}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={snaps}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.snapItem}
                            onPress={() =>
                                handleOpenSnap(item._id, item.username || "")
                            }
                            disabled={snapLoading}
                        >
                            <View style={styles.snapItemContent}>
                                <View style={styles.snapInfo}>
                                    <Text style={styles.usernameText}>
                                        {item.username}
                                    </Text>
                                    <Text style={styles.dateText}>
                                        {formatDate(item.date)}
                                    </Text>
                                </View>
                                <View style={styles.snapStatus}>
                                    {snapLoading ? (
                                        <ActivityIndicator
                                            size="small"
                                            color="#04ff60"
                                        />
                                    ) : (
                                        <View style={styles.unreadIndicator} />
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                Aucun snap reçu
                            </Text>
                        </View>
                    }
                    refreshing={loading}
                    onRefresh={fetchSnaps}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#04ff60",
    },
    headerButtons: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#000",
    },
    cameraButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    cameraButtonText: {
        fontSize: 20,
    },
    snapItem: {
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 8,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    snapItemContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    snapInfo: {
        flex: 1,
    },
    usernameText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    dateText: {
        fontSize: 12,
        color: "#666",
        marginTop: 4,
    },
    snapStatus: {
        marginLeft: 10,
    },
    unreadIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#ff0000",
    },
    errorText: {
        color: "red",
        textAlign: "center",
        margin: 20,
    },
    emptyContainer: {
        padding: 20,
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 30,
    },
    refreshButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    buttonIcon: {
        fontSize: 20,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
    },
    snapImage: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
        transform: [{ rotate: "-90deg" }],
    },
    timerContainer: {
        position: "absolute",
        top: 40,
        right: 20,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
    },
    timerText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Messages;
