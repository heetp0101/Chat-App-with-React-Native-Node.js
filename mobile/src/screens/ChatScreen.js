// mobile/src/screens/ChatScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import socket from "../utils/socket";

const ChatScreen = ({ route, navigation }) => {
  // receiver info can be passed via route.params
  const { receiverName, receiverId } = route.params;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  
  
  useEffect(() => {
    // Connect socket if not connected
    if (!socket.connected) {
      socket.connect();
    }

    // Listen for new messages
    socket.on("message:new", (message) => {
      // Append new message to messages state
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("message:new");
    };
    }, []);

    //  useeffect completed 



  const sendMessage = () => {
    if (!inputText || inputText.trim() === "") return; 

    const message = {
      receiver: receiverId,
      text: inputText,
      tempId: `t-${Date.now()}` // temporary id for UI
    };


    // Emit message via socket
    socket.emit("message:send", message, (ack) => {
      console.log("Send ack:", ack); // optional confirmation from backend
    });

    // Add message to local state for instant UI update
    setMessages((prev) => [...prev, message]);
    setInputText("");
  };

  const renderItem = ({ item }) => (
    <View style={styles.messageItem}>
      <Text style={styles.sender}>{item.sender}:</Text>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{receiverName}</Text>

      <FlatList
        data={messages}
        keyExtractor={(item) => item._id || item.tempId}
        renderItem={({ item }) => (
          <Text style={item.sender === "yourUserIdHere" ? styles.myMessage : styles.otherMessage}>
            {item.text}
          </Text>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   header: { fontSize: 22, fontWeight: "bold", padding: 15, backgroundColor: "#007BFF", color: "#fff" },
//   messageList: { flex: 1, paddingHorizontal: 10, marginVertical: 10 },
//   messageItem: { flexDirection: "row", marginBottom: 10 },
//   sender: { fontWeight: "bold", marginRight: 5 },
//   text: { fontSize: 16 },
//   inputContainer: {
//     flexDirection: "row",
//     padding: 10,
//     borderTopWidth: 1,
//     borderColor: "#ccc",
//     backgroundColor: "#f9f9f9",
//   },
//   input: { flex: 1, height: 40, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 10 },
//   sendButton: { justifyContent: "center", alignItems: "center", marginLeft: 10, paddingHorizontal: 15, backgroundColor: "#007BFF", borderRadius: 8 },
//   sendButtonText: { color: "#fff", fontWeight: "bold" },
// });

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  myMessage: { alignSelf: "flex-end", backgroundColor: "#DCF8C6", padding: 8, borderRadius: 5, marginVertical: 2 },
  otherMessage: { alignSelf: "flex-start", backgroundColor: "#ECECEC", padding: 8, borderRadius: 5, marginVertical: 2 },
  inputContainer: { flexDirection: "row", alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 20, paddingHorizontal: 10, height: 40 },
  sendButton: { marginLeft: 10, padding: 10, backgroundColor: "#007BFF", borderRadius: 20 },
});