import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
} from "react-native-vision-camera";
import { launchImageLibrary } from "react-native-image-picker";
import { Image as ImageIcon } from "react-native-feather";
import UserList from "../components/UserList";

const CameraScreen: React.FC = () => {
    const [cameraPosition, setCameraPosition] = useState<"front" | "back">(
        "back"
    );
    const cameraRef = useRef<Camera>(null);
    const device = useCameraDevice(cameraPosition);
    const { hasPermission, requestPermission } = useCameraPermission();
    const [isCameraInitialized, setIsCameraInitialized] = useState(false);
    const [capturedPhotoPath, setCapturedPhotoPath] = useState<string | null>(
        null
    );
    const [showUserList, setShowUserList] = useState(false);

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission, requestPermission]);

    const onInitialized = () => {
        setIsCameraInitialized(true);
    };

    const takePhoto = async () => {
        if (cameraRef.current && isCameraInitialized) {
            const photo = await cameraRef.current.takePhoto();
            console.log("Photo capturée :", photo.path);
            setCapturedPhotoPath(photo.path);
        }
    };

    const handleSend = () => {
        console.log("Envoi de la photo:", capturedPhotoPath);
        setShowUserList(true);
    };

    const toggleCameraPosition = () => {
        setCameraPosition((prevPosition) =>
            prevPosition === "back" ? "front" : "back"
        );
    };

    const openGallery = () => {
        launchImageLibrary(
            {
                mediaType: "photo",
                includeBase64: false,
                selectionLimit: 1,
            },
            (response) => {
                if (response.didCancel) {
                    console.log("Sélection d'image annulée");
                    return;
                }
                if (response.errorCode) {
                    console.log(
                        "Erreur lors de la sélection d'image:",
                        response.errorMessage
                    );
                    return;
                }

                if (response.assets && response.assets.length > 0) {
                    const selectedImage = response.assets[0];
                    if (selectedImage.uri) {
                        console.log("Image sélectionnée:", selectedImage.uri);
                        setCapturedPhotoPath(selectedImage.uri);
                    }
                }
            }
        );
    };

    const resetCamera = () => {
        setCapturedPhotoPath(null);
    };

    if (!device || !hasPermission) {
        return <View style={styles.container} />;
    }
    if (showUserList && capturedPhotoPath) {
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => setShowUserList(false)}
                    >
                        <Text style={styles.backButtonText}>Retour</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerText}>
                        Choisir un destinataire
                    </Text>
                </View>

                <View style={styles.imagePreviewContainer}>
                    <Image
                        source={{
                            uri: capturedPhotoPath.startsWith("file:/")
                                ? capturedPhotoPath
                                : `file://${capturedPhotoPath}`,
                        }}
                        style={styles.thumbnailPreview}
                    />
                </View>

                <UserList
                    imagePath={capturedPhotoPath}
                    onSnapSent={() => {
                        setCapturedPhotoPath(null);
                        setShowUserList(false);
                    }}
                />
            </View>
        );
    }

    if (capturedPhotoPath) {
        return (
            <View style={styles.container}>
                <Image
                    source={{
                        uri: capturedPhotoPath.startsWith("file:/")
                            ? capturedPhotoPath
                            : `file://${capturedPhotoPath}`,
                    }}
                    style={styles.previewImage}
                    resizeMode="cover"
                />
                <View style={styles.previewControlsContainer}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={resetCamera}
                    >
                        <Text style={styles.backButtonText}>Retour</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleSend}
                    >
                        <Text style={styles.sendButtonText}>Envoyer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
                onInitialized={onInitialized}
            />
            <View style={styles.controlsContainer}>
                <TouchableOpacity
                    style={styles.galleryButton}
                    onPress={openGallery}
                >
                    <Text style={styles.galleryButtonIcon}>🖼️</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.captureButton}
                    onPress={takePhoto}
                >
                    <View style={styles.captureButtonInner} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.flipButton}
                    onPress={toggleCameraPosition}
                >
                    <Text style={styles.flipButtonIcon}>🔄</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    controlsContainer: {
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 40,
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "white",
    },
    captureButtonInner: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "white",
    },
    galleryButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "white",
    },
    galleryButtonIcon: {
        fontSize: 24,
    },
    flipButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "white",
    },
    flipButtonIcon: {
        fontSize: 24,
    },
    previewImage: {
        flex: 1,
        width: "100%",
    },
    previewControlsContainer: {
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 30,
    },
    backButton: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        minWidth: 100,
        alignItems: "center",
    },
    backButtonText: {
        color: "white",
        fontSize: 16,
    },
    sendButton: {
        backgroundColor: "rgba(0, 132, 255, 0.8)",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        minWidth: 100,
        alignItems: "center",
    },

    sendButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    headerContainer: {
        paddingTop: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#04ff60",
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
        marginRight: 50,
    },
    imagePreviewContainer: {
        padding: 10,
        alignItems: "center",
        backgroundColor: "#f8f8f8",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    thumbnailPreview: {
        width: 100,
        height: 150,
        borderRadius: 8,
    },
});

export default CameraScreen;
