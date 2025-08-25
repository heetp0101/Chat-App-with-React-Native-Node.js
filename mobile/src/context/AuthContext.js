// mobile/src/context/AuthContext.js
import React, { createContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { login as apiLogin, setAuthToken } from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [initializing, setInitializing] = useState(true);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userToken, setUserToken] = useState(null);
  // Load saved session on startup
  useEffect(() => {
    (async () => {
      try {
        const savedToken = await AsyncStorage.getItem('token');
        const savedUser = await AsyncStorage.getItem('user');
        if (savedToken) {
          setToken(savedToken);
          setAuthToken(savedToken);
        }
        if (savedUser) setUser(JSON.parse(savedUser));
      } catch (e) {
        console.warn('Auth load error:', e.message || e);
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  // Save token + user and set Authorization header
  const saveSession = async (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser || null);
    setAuthToken(nextToken);
    try {
      await AsyncStorage.setItem('token', nextToken);
      if (nextUser) await AsyncStorage.setItem('user', JSON.stringify(nextUser));
    } catch (e) {
      console.warn('Failed to persist session:', e.message || e);
    }
  };

  // Clear session
  const clearSession = async () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
    } catch (e) {
      console.warn('Failed to clear session:', e.message || e);
    }
  };

  // Login using API (returns the user on success)
  const login = async (email, password) => {
    try {
      const { data } = await apiLogin(email, password); // expects { token, user }
      await saveSession(data.token, data.user);
      return data.user;
    } catch (err) {
      // rethrow with message for UI to show
      const message = err?.response?.data?.error || err.message || 'Login failed';
      throw new Error(message);
    }
  };

  // Register (calls POST /auth/register)
  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      await saveSession(data.token, data.user);
      return data.user;
    } catch (err) {
      const message = err?.response?.data?.error || err.message || 'Registration failed';
      throw new Error(message);
    }
  };

  const logout = async () => {
    await clearSession();
  };

  const value = useMemo(
    () => ({
      initializing,
      token,
      user,
      login,
      register,
      logout,
      setUser,
    }),
    [initializing, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);
export default AuthContext;
