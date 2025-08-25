import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AuthContext from "../context/AuthContext";
// import axios from "../api/axios";
import api from "../api/axios";
import socket from "../utils/socket";
import { setAuthToken } from "../api/axios";

// // After successful login
// const token = response.data.token; // Your JWT token from /auth/login


// // Connect socket with token
// socket.auth = { token };
// socket.connect();

const LoginScreen = ({ navigation }) => {
    const { setUserToken } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
  
    const handleLogin = async () => {
      if (!email || !password) {
        setError("Please fill in both fields");
        return;
      }
      try {

        console.log("Login request payload:", { email, password });
        const response = await api.post("/auth/login", {email, password });
        const token = response.data.token;
        // console.log(" token : ", token);
        
        // Save token in context
        // console.log(" Full Response : ",response.data);
        // console.log(" token : ", token);
        // setAuthToken(token);
        // console.log(api.defaults.headers.common.Authorization);

        // Connect socket with token
        setAuthToken(token);
        socket.auth = { token };
        socket.connect();
  
        // Navigate to HomeScreen after login
        navigation.navigate("Home");
      } catch (err) {
        console.log("Full login error:", err);
        console.log("Error response data:", err.response?.data)
        setError(err.response?.data?.message || "Login failed");
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
  
        {error ? <Text style={styles.error}>{error}</Text> : null}
  
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
  
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
  
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    );
  };
  

  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#fff",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 20,
    },
    input: {
      width: "100%",
      height: 50,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 15,
      fontSize: 16,
    },
    button: {
      width: "100%",
      height: 50,
      backgroundColor: "#007BFF",
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
    },
    buttonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
    link: {
      fontSize: 16,
      color: "#007BFF",
    },
    error: {
      color: "red",
      marginBottom: 10,
    },
  });

  export default LoginScreen;