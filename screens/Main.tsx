import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal,
    SafeAreaView,
    Platform,
    Button,
    Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";

const Main = ({ navigation }: any) => {
    const { userName, clearAuthData } = React.useContext(AuthContext);

    const handleLogout = async () => {
        try {
            Alert.alert(
                "Déconnexion",
                "Êtes-vous sûr de vouloir vous déconnecter ?",
                [
                    {
                        text: "Annuler",
                        style: "cancel",
                    },
                    {
                        text: "Déconnexion",
                        onPress: async () => {
                            await clearAuthData();
                            navigation.reset({
                                index: 0,
                                routes: [{ name: "Login" }],
                            });
                        },
                    },
                ]
            );
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    };
    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>
                Bienvenue, {userName || "User"}!
            </Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        navigation.navigate("Camera");
                    }}
                >
                    <Text style={styles.buttonText}>Caméra</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        navigation.navigate("Messages");
                    }}
                >
                    <Text style={styles.buttonText}>Messages</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        navigation.navigate("Settings");
                    }}
                >
                    <Text style={styles.buttonText}>Paramètres</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.logoutButton]}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutButtonText}>Déconnexion</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 30,
    },
    cameraButton: {
        backgroundColor: "#04ff60",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginTop: 20,
    },
    cameraButtonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
    },
    cameraContainer: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    cameraControlsContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end",
        padding: 20,
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#fff",
        borderWidth: 5,
        borderColor: "rgba(0, 0, 0, 0.2)",
        marginBottom: 30,
    },
    closeButton: {
        position: "absolute",
        top: 20,
        left: 20,
        padding: 10,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 5,
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16,
    },
    imageContainer: {
        width: 300,
        height: 400,
        marginVertical: 20,
        borderRadius: 10,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "#04ff60",
    },
    capturedImage: {
        width: "100%",
        height: "100%",
    },
    buttonContainer: {
        width: "80%",
    },
    button: {
        backgroundColor: "#04ff60",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginBottom: 15,
        alignItems: "center",
    },
    buttonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
    },
    logoutButton: {
        backgroundColor: "#ff3b30",
        marginTop: 20,
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Main;
