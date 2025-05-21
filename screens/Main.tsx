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
    Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import {
    Camera,
    useCameraDevices,
    CameraPermissionStatus,
} from "react-native-vision-camera";

const Main = ({ navigation }: any) => {
    const { userName } = React.useContext(AuthContext);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const camera = useRef<Camera>(null);
    const devices = useCameraDevices();
    // @ts-ignore
    const device = devices.back;
    const [cameraPermission, setCameraPermission] =
        useState<CameraPermissionStatus>();

    useEffect(() => {
        (async () => {
            const status = await Camera.getCameraPermissionStatus();
            setCameraPermission(status);

            if (status !== "granted") {
                const newStatus = await Camera.requestCameraPermission();
                setCameraPermission(newStatus);

                if (newStatus !== "granted") {
                    Alert.alert(
                        "Permission refusée",
                        "Accès à la caméra nécessaire pour cette fonctionnalité"
                    );
                }
            }
        })();
    }, []);

    const handleOpenCamera = () => {
        setIsCameraOpen(true);
    };

    const handleCloseCamera = () => {
        setIsCameraOpen(false);
    };

    const handleCapture = async () => {
        if (camera.current) {
            try {
                const photo = await camera.current.takePhoto();
                const uri = `file://${photo.path}`;
                setCapturedImage(uri);
                setIsCameraOpen(false);
                console.log("Photo capturée:", uri);
            } catch (error) {
                console.error("Erreur lors de la capture:", error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>
                Bienvenue, {userName || "User"}!
            </Text>

            {capturedImage && (
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: capturedImage }}
                        style={styles.capturedImage}
                    />
                </View>
            )}

            <TouchableOpacity
                style={styles.cameraButton}
                onPress={handleOpenCamera}
            >
                <Text style={styles.cameraButtonText}>Prendre une photo</Text>
            </TouchableOpacity>

            <Modal
                visible={isCameraOpen}
                animationType="slide"
                onRequestClose={handleCloseCamera}
            >
                <SafeAreaView style={styles.cameraContainer}>
                    {device && (
                        <Camera
                            ref={camera}
                            style={styles.camera}
                            device={device}
                            isActive={isCameraOpen}
                            photo={true}
                        />
                    )}

                    <View style={styles.cameraControlsContainer}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleCloseCamera}
                        >
                            <Text style={styles.closeButtonText}>Fermer</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.captureButton}
                            onPress={handleCapture}
                        />
                    </View>
                </SafeAreaView>
            </Modal>
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
        backgroundColor: "#FFFC00",
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
        borderColor: "#FFFC00",
    },
    capturedImage: {
        width: "100%",
        height: "100%",
    },
});

export default Main;
