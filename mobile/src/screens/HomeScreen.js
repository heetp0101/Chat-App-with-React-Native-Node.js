import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import api from "../api/axios";

const HomeScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users"); // backend returns array of users
        setUsers(response.data);
      } catch (err) {
        console.log("Failed to fetch users:", err.message);
      }
    };

    fetchUsers();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userButton}
      onPress={() => navigation.navigate("Chat", { user: item })}
    >
      <Text style={styles.userText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  userButton: {
    padding: 15,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    marginBottom: 10,
  },
  userText: { color: "#fff", fontSize: 18 },
});

export default HomeScreen;