import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const USERS_KEY = 'users';
const SESSION_KEY = 'session';

const AuthContext = createContext(null);

const hash = (password) =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);

const readUsers = async () => {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the session when the app starts
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        if (raw) setUser(JSON.parse(raw));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signUp = async ({ name, email, password }) => {
    const users = await readUsers();
    const cleanEmail = email.trim().toLowerCase();

    if (users.some((u) => u.email === cleanEmail)) {
      throw new Error('This email is already registered.');
    }

    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: cleanEmail,
      passwordHash: await hash(password),
    };

    await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));

    const session = { id: newUser.id, name: newUser.name, email: newUser.email };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
  };

  const signIn = async ({ email, password }) => {
    const users = await readUsers();
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find((u) => u.email === cleanEmail);

    if (!found || found.passwordHash !== (await hash(password))) {
      throw new Error('Incorrect email or password.');
    }

    const session = { id: found.id, name: found.name, email: found.email };
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);