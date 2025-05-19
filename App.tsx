import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./screens/Login";
import RegisterScreen from "./screens/Register";

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
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
                {/* 
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
        */}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
