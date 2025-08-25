import axios from 'axios';
import Constants from 'expo-constants';

const API_URL =
  "http://10.125.122.5:4000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


// set or clear the Authorization header globally
export const setAuthToken = (token) => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  };
  
  // AUTH: login
  export const login = (email, password) =>
    api.post('/auth/login', { email, password });


export default api;
