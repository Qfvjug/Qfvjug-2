import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../services/firebase.js';
import { vipService } from '../services/database.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [vipUser, setVipUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Admin-Auth-State überwachen
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
      setLoading(false);
    });

    // VIP-User aus localStorage laden
    const savedVipUser = localStorage.getItem('qfvjug-vip-user');
    if (savedVipUser) {
      try {
        setVipUser(JSON.parse(savedVipUser));
      } catch (error) {
        console.error('Error parsing saved VIP user:', error);
        localStorage.removeItem('qfvjug-vip-user');
      }
    }

    return unsubscribe;
  }, []);

  // Admin-Login
  const loginAdmin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  };

  // Admin-Logout
  const logoutAdmin = async () => {
    try {
      await signOut(auth);
      setAdminUser(null);
    } catch (error) {
      console.error('Admin logout error:', error);
      throw error;
    }
  };

  // VIP-Login
  const loginVip = async (username, password) => {
    try {
      const user = await vipService.authenticate(username, password);
      if (user) {
        setVipUser(user);
        localStorage.setItem('qfvjug-vip-user', JSON.stringify(user));
        return user;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('VIP login error:', error);
      throw error;
    }
  };

  // VIP-Logout
  const logoutVip = () => {
    setVipUser(null);
    localStorage.removeItem('qfvjug-vip-user');
  };

  const value = {
    // Admin Auth
    adminUser,
    isAdmin: !!adminUser,
    loginAdmin,
    logoutAdmin,
    
    // VIP Auth
    vipUser,
    isVip: !!vipUser,
    loginVip,
    logoutVip,
    
    // General
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

