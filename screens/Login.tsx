import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
const LoginScreen = ({ navigation }: any) => {
    const { setAuthData } = React.useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setErrorMessage("");
        if (!email || !password) {
            setErrorMessage("Veuillez remplir tous les champs");
            return;
        }

        const userData = {
            email: email,
            password: password,
        };

        const header = {
            "Content-Type": "application/json",
            "x-api-key":
                "CLE_API_SUPPRIMEE",
        };
        setLoading(true);
        try {
            const response = await axios.put(
                "https://snapchat.epihub.eu/user",
                userData,
                { headers: header }
            );
            console.log("Login response:", response);

            const token = response.data.data.token;
            const username = response.data.data.username;
            const userId = response.data.data._id;
            const userEmail = response.data.data.email;
            const userPassword = userData.password;
            const userImage = response.data.data.image || null;

            await setAuthData(
                token,
                username,
                userId,
                userEmail,
                userPassword,
                userImage
            );
            navigation.navigate("Main");
        } catch (error) {
            console.error("Erreur de connexion:", error);
            if (axios.isAxiosError(error) && error.response) {
                const errorData = error.response.data;
                if (errorData && errorData.message) {
                    setErrorMessage(errorData.message);
                } else {
                    setErrorMessage("Erreur de connexion");
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <Text style={styles.title}>Connexion</Text>

                {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email ou nom d'utilisateur"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.loginButtonText}>Se connecter</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Vous n'avez pas de compte ?
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("Register");
                        }}
                    >
                        <Text style={styles.registerLink}>S'inscrire</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#04ff60",
    },
    keyboardView: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    logo: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: "white",
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: "#000000",
        borderRadius: 8,
        padding: 15,
        alignItems: "center",
        marginBottom: 20,
    },
    loginButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginBottom: 10,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    footerText: {
        fontSize: 14,
        marginRight: 5,
    },
    registerLink: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#000000",
    },
});

export default LoginScreen;
