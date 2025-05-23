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
    const { userName } = React.useContext(AuthContext);

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>
                Bienvenue, {userName || "User"}!
            </Text>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("Camera");
                }}
            >
                <Text>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("Messages");
                }}
            >
                <Text>Messages</Text>
            </TouchableOpacity>
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
});

export default Main;
