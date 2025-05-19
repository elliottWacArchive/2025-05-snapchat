import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
} from "react-native";

const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = () => {
        if (!email || !password) {
            setErrorMessage("Veuillez remplir tous les champs");
            return;
        }

        console.log("Tentative de connexion avec:", email, password);

        navigation.navigate("Main");
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
                >
                    <Text style={styles.loginButtonText}>Se connecter</Text>
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
        backgroundColor: "#FFFC00",
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
