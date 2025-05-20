import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext";
const Main = ({ navigation }: any) => {
    const { userToken, userName, userId } = React.useContext(AuthContext);
    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>
                Bienvenue, {userName || "User"}!
            </Text>
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
    },
});

export default Main;
