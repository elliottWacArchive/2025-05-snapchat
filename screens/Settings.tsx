import React, { useState, useContext, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator,
    Platform,
    Image,
    SafeAreaView,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { launchImageLibrary } from "react-native-image-picker";
import RNFS from "react-native-fs";

const SettingsScreen = ({ navigation }: any) => {
    const {
        userToken,
        userName,
        userId,
        userEmail,
        userPassword,
        userImage,
        setAuthData,
    } = useContext(AuthContext);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [profileImagePath, setProfileImagePath] = useState<string | null>(
        null
    );
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (userName) setUsername(userName);
        if (userEmail) setEmail(userEmail);
        if (userImage) setProfilePicture(userImage);
    }, [userName, userEmail, userImage]);

    const pickImage = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: "photo",
                quality: 0.8,
            });

            if (
                result.assets &&
                result.assets.length > 0 &&
                result.assets[0].uri
            ) {
                setProfileImagePath(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Erreur lors de la sélection de l'image:", error);
        }
    };

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

    const validateInputs = () => {
        if (password !== confirmPassword) {
            setErrorMessage("Les mots de passe ne correspondent pas");
            return false;
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrorMessage("Veuillez entrer un email valide");
            return false;
        }

        return true;
    };

    const updateUserProfile = async () => {
        if (!validateInputs()) return;
        if (!userToken) {
            Alert.alert(
                "Erreur",
                "Vous devez être connecté pour modifier vos informations"
            );
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            let base64Image = "";
            if (profileImagePath) {
                base64Image = await convertImageToBase64(profileImagePath);
            }

            const userData: any = {};
            if (username) userData.username = username;
            if (email) userData.email = email;
            if (password) userData.password = password;
            if (profileImagePath || profilePicture) {
                userData.profilePicture = profileImagePath
                    ? base64Image
                    : profilePicture;
            }

            const response = await axios.patch(
                "https://snapchat.epihub.eu/user",
                userData,
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        "Content-Type": "application/json",
                        "x-api-key":
                            "CLE_API_SUPPRIMEE",
                    },
                }
            );

            const newUserImage = profileImagePath
                ? base64Image
                : profilePicture;
            const newPassword = password || userPassword || "";

            await setAuthData(
                userToken,
                username,
                userId || "",
                email,
                newPassword,
                newUserImage
            );

            Alert.alert(
                "Succès",
                "Vos informations ont été mises à jour avec succès"
            );

            setPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Erreur lors de la mise à jour du profil:", error);
            if (axios.isAxiosError(error) && error.response) {
                setErrorMessage(
                    error.response.data.message || "Une erreur est survenue"
                );
            } else {
                setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.title}>Paramètres du compte</Text>

                {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}

                <View style={styles.profileImageContainer}>
                    {profilePicture || profileImagePath ? (
                        <Image
                            source={{ uri: profileImagePath || profilePicture }}
                            style={styles.profileImage}
                        />
                    ) : (
                        <View
                            style={[styles.profileImage, styles.noProfileImage]}
                        >
                            <Text style={styles.profileInitial}>
                                {userName ? userName[0].toUpperCase() : "?"}
                            </Text>
                        </View>
                    )}
                    <TouchableOpacity
                        style={styles.changeImageButton}
                        onPress={pickImage}
                    >
                        <Text style={styles.changeImageText}>
                            Changer la photo
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nom d'utilisateur</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <Text style={styles.label}>
                        Nouveau mot de passe (laisser vide pour ne pas changer)
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nouveau mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <Text style={styles.label}>
                        Confirmer le nouveau mot de passe
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={updateUserProfile}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.saveButtonText}>
                            Enregistrer les modifications
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    scrollView: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        color: "#222",
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginBottom: 15,
    },
    profileImageContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
    },
    noProfileImage: {
        backgroundColor: "#E1E1E1",
        justifyContent: "center",
        alignItems: "center",
    },
    profileInitial: {
        fontSize: 40,
        color: "#666",
    },
    changeImageButton: {
        backgroundColor: "#04ff60",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    changeImageText: {
        color: "white",
        fontWeight: "bold",
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: "#555",
        fontWeight: "500",
    },
    input: {
        backgroundColor: "#F5F5F5",
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: "#04ff60",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 20,
    },
    saveButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default SettingsScreen;
