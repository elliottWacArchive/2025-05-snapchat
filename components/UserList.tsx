import React, { useContext, useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from "react-native";
import axios from "axios";
import Slider from "@react-native-community/slider";
import { AuthContext } from "../context/AuthContext";
import RNFS from "react-native-fs";

interface User {
    _id: string;
    username: string;
    email?: string;
}

interface UserListProps {
    imagePath?: string | null;
    onSnapSent?: () => void;
}

const UserList = ({ imagePath, onSnapSent }: UserListProps) => {
    const { userToken } = useContext(AuthContext);
    const [snapDuration, setSnapDuration] = useState(5);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sendingTo, setSendingTo] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!userToken) {
                setError(
                    "Vous devez être connecté pour voir la liste des utilisateurs"
                );
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    "https://snapchat.epihub.eu/user",
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                            "Content-Type": "application/json",
                            "x-api-key":
                                "CLE_API_SUPPRIMEE",
                        },
                    }
                );

                setUsers(response.data.data || []);
            } catch (err) {
                console.error(
                    "Erreur lors de la récupération des utilisateurs:",
                    err
                );
                setError("Impossible de charger la liste des utilisateurs");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [userToken]);

    const convertImageToBase64 = async (path: string) => {
        try {
            const cleanPath = path.startsWith("file://")
                ? path.substring(7)
                : path;
            const base64Data = await RNFS.readFile(cleanPath, "base64");

            let format = "jpeg";
            if (path.toLowerCase().endsWith(".png")) {
                format = "png";
            } else if (
                path.toLowerCase().endsWith(".jpg") ||
                path.toLowerCase().endsWith(".jpeg")
            ) {
                format = "jpeg";
            }

            return `data:image/${format};base64,${base64Data}`;
        } catch (error) {
            console.error("Erreur lors de la conversion de l'image:", error);
            throw error;
        }
    };

    const sendSnap = async (userId: string, username: string) => {
        if (!imagePath || !userToken) return;

        try {
            setSendingTo(userId);

            const base64Image = await convertImageToBase64(imagePath);

            await axios.post(
                "https://snapchat.epihub.eu/snap",
                {
                    to: userId,
                    image: base64Image,
                    duration: snapDuration,
                },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-Type": "application/json",
                        "x-api-key":
                            "CLE_API_SUPPRIMEE",
                    },
                }
            );

            Alert.alert("Succès", `Snap envoyé à ${username} !`);

            if (onSnapSent) {
                onSnapSent();
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du snap:", error);
            Alert.alert(
                "Erreur",
                "Impossible d'envoyer le snap. Veuillez réessayer."
            );
        } finally {
            setSendingTo(null);
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#04ff60" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Choisir un destinataire</Text>
            <View style={styles.durationContainer}>
                <Text style={styles.durationLabel}>
                    Durée d'affichage : {snapDuration} secondes
                </Text>
                <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={10}
                    step={1}
                    value={snapDuration}
                    onValueChange={(value) => setSnapDuration(value)}
                    minimumTrackTintColor="#04ff60"
                    maximumTrackTintColor="#ccc"
                    thumbTintColor="#04ff60"
                />
            </View>
            <FlatList
                data={users}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.userItem}
                        onPress={() => sendSnap(item._id, item.username)}
                        disabled={!imagePath || sendingTo !== null}
                    >
                        <View style={styles.userItemContent}>
                            <Text style={styles.username}>{item.username}</Text>
                            {sendingTo === item._id && (
                                <ActivityIndicator
                                    size="small"
                                    color="#04ff60"
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        Aucun utilisateur trouvé
                    </Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    userItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    userItemContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    username: {
        fontSize: 16,
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginTop: 10,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 20,
        color: "#777",
    },
    durationContainer: {
        marginBottom: 20,
        paddingHorizontal: 10,
        paddingVertical: 15,
        backgroundColor: "#f7f7f7",
        borderRadius: 8,
    },
    durationLabel: {
        textAlign: "center",
        marginBottom: 10,
        fontSize: 15,
        fontWeight: "500",
    },
    slider: {
        width: "100%",
        height: 40,
    },
});

export default UserList;
