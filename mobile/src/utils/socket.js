import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const socket = io("http://10.125.122.5:4000", {
  autoConnect: false,
});

export const connectSocket = async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    socket.auth = { token };
    socket.connect();
  }
};

export default socket;
