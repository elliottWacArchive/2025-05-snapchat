import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
    userToken: string | null;
    userName: string | null;
    userId: string | null;
    userEmail: string | null;
    userPassword: string | null;
    userImage: string | null;
    setAuthData: (
        token: string,
        name: string,
        id: string,
        email: string,
        password: string,
        image: string | null
    ) => Promise<void>;
    clearAuthData: () => Promise<void>;
    isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
    userToken: null,
    userName: null,
    userId: null,
    userEmail: null,
    userPassword: null,
    userImage: null,
    setAuthData: async () => {},
    clearAuthData: async () => {},
    isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userPassword, setUserPassword] = useState<string | null>(null);
    const [userImage, setUserImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStoredData = async () => {
            try {
                const token = await AsyncStorage.getItem("userToken");
                const name = await AsyncStorage.getItem("userName");
                const id = await AsyncStorage.getItem("userId");
                const email = await AsyncStorage.getItem("userEmail");
                const password = await AsyncStorage.getItem("userPassword");
                const image = await AsyncStorage.getItem("userImage");

                if (token) setUserToken(token);
                if (name) setUserName(name);
                if (id) setUserId(id);
                if (email) setUserEmail(email);
                if (password) setUserPassword(password);
                if (image) setUserImage(image);
            } catch (e) {
                console.error("Erreur lors du chargement des données:", e);
            } finally {
                setIsLoading(false);
            }
        };

        loadStoredData();
    }, []);

    const setAuthData = async (
        token: string,
        name: string,
        id: string,
        email: string,
        password: string,
        image: string | null
    ) => {
        try {
            await AsyncStorage.setItem("userToken", token);
            await AsyncStorage.setItem("userName", name);
            await AsyncStorage.setItem("userId", id);
            await AsyncStorage.setItem("userEmail", email);
            await AsyncStorage.setItem("userPassword", password);
            if (image) {
                await AsyncStorage.setItem("userImage", image);
            } else {
                await AsyncStorage.setItem("userImage", "");
            }
            setUserToken(token);
            setUserName(name);
            setUserId(id);
            setUserEmail(email);
            setUserPassword(password);
            setUserImage(image);
        } catch (e) {
            console.error("Erreur lors de la sauvegarde des données:", e);
        }
    };

    const clearAuthData = async () => {
        try {
            await AsyncStorage.removeItem("userToken");
            await AsyncStorage.removeItem("userName");
            await AsyncStorage.removeItem("userId");
            await AsyncStorage.removeItem("userEmail");
            await AsyncStorage.removeItem("userPassword");
            await AsyncStorage.removeItem("userImage");

            setUserToken(null);
            setUserName(null);
            setUserId(null);
            setUserEmail(null);
            setUserPassword(null);
            setUserImage(null);
        } catch (e) {
            console.error("Erreur lors de la suppression des données:", e);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                userToken,
                userName,
                userId,
                userEmail,
                userPassword,
                userImage,
                setAuthData,
                clearAuthData,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
