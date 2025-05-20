import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
    userToken: string | null;
    userName: string | null;
    userId: string | null;
    setAuthData: (token: string, name: string, id: string) => Promise<void>;
    clearAuthData: () => Promise<void>;
    isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
    userToken: null,
    userName: null,
    userId: null,
    setAuthData: async () => {},
    clearAuthData: async () => {},
    isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStoredData = async () => {
            try {
                const token = await AsyncStorage.getItem("userToken");
                const name = await AsyncStorage.getItem("userName");
                const id = await AsyncStorage.getItem("userId");

                if (token) setUserToken(token);
                if (name) setUserName(name);
                if (id) setUserId(id);
            } catch (e) {
                console.error("Erreur lors du chargement des données:", e);
            } finally {
                setIsLoading(false);
            }
        };

        loadStoredData();
    }, []);

    const setAuthData = async (token: string, name: string, id: string) => {
        try {
            await AsyncStorage.setItem("userToken", token);
            await AsyncStorage.setItem("userName", name);
            await AsyncStorage.setItem("userId", id);

            setUserToken(token);
            setUserName(name);
            setUserId(id);
        } catch (e) {
            console.error("Erreur lors de la sauvegarde des données:", e);
        }
    };

    const clearAuthData = async () => {
        try {
            await AsyncStorage.removeItem("userToken");
            await AsyncStorage.removeItem("userName");
            await AsyncStorage.removeItem("userId");

            setUserToken(null);
            setUserName(null);
            setUserId(null);
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
                setAuthData,
                clearAuthData,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
