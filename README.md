# Chat-App-with-React-Native-Node.js


# setup

- Create Expo-Go React Native app
- ```
  npx create-expo-app mobile
  cd mobile
  npm install axios socket.io-client @react-navigation/native @react-navigation/stack
  ```

- Run the node server
- If node.js is not installed then first install node.js
  ```
  mkdir server && cd server
  npm init -y
  npm install express socket.io cors dotenv bcrypt jsonwebtoken mongoose
  ```

# env vars 

 ```
 PORT=4000
 MONGO_URI=<MONGO DB CONNECTION STRING>
 JWT_SECRET=<JWT SECRET KEY>
 ```

# sample users

- I created 4 sample Users :
 ```
 Alice
 Bob
 Heet
 Vrutik
 ```
CORS_ORIGIN=*
