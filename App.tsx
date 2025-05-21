import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import LoginScreen from "./screens/Login";
import RegisterScreen from "./screens/Register";
import MainScreen from "./screens/Main";
import { ActivityIndicator, View } from "react-native";
// import { CameraProvider } from "react-native-camera-hooks";

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function Navigation() {
    const { userToken, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" color="#FFFC00" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={userToken ? "Main" : "Login"}>
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Main"
                    component={MainScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

function App(): React.JSX.Element {
    return (
        // <CameraProvider>
        <AuthProvider>
            <Navigation />
        </AuthProvider>
        // </CameraProvider>
    );
}

export default App;
