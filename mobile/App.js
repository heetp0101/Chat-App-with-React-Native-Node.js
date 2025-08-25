import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import api from './src/api/axios';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import RegisterScreen from './src/screens/RegisterScreen';


const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

console.log('API URL:', Constants?.expoConfig?.extra?.apiUrl || Constants?.manifest?.extra?.apiUrl);





// mobile/App.js
// import React from "react";
// import { AuthProvider } from "./src/context/AuthContext";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import LoginScreen from "./src/screens/LoginScreen";
// import HomeScreen from "./src/screens/HomeScreen";
// import ChatScreen from "./src/screens/ChatScreen";

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <AuthProvider>
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="Login">
//           <Stack.Screen name="Login" component={LoginScreen} />
//           <Stack.Screen name="Home" component={HomeScreen} />
//           <Stack.Screen name="Chat" component={ChatScreen} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </AuthProvider>
//   );
// }