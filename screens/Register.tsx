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
    ScrollView,
} from "react-native";

const RegisterScreen = ({ navigation }: any) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleRegister = () => {
        if (!username || !email || !password || !confirmPassword) {
            setErrorMessage("Veuillez remplir tous les champs");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Les mots de passe ne correspondent pas");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage("Veuillez entrer un email valide");
            return;
        }

        console.log("Inscription avec:", username, email, password);

        navigation.navigate("Login");
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <Text style={styles.title}>Inscription</Text>

                    {errorMessage ? (
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : null}

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nom d'utilisateur"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Email"
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

                        <TextInput
                            style={styles.input}
                            placeholder="Confirmer le mot de passe"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={handleRegister}
                    >
                        <Text style={styles.registerButtonText}>
                            S'inscrire
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Vous avez déjà un compte ?
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("Login");
                            }}
                        >
                            <Text style={styles.loginLink}>Se connecter</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
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
    registerButton: {
        backgroundColor: "#000000",
        borderRadius: 8,
        padding: 15,
        alignItems: "center",
        marginBottom: 20,
    },
    registerButtonText: {
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
    loginLink: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#000000",
    },
});

export default RegisterScreen;
