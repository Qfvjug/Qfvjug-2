import { ref, get, set, push, remove, onValue, off } from 'firebase/database';
import { database } from './firebase.js';

/**
 * News Service
 */
export const newsService = {
  // Alle News abrufen
  getAll: async () => {
    try {
      const newsRef = ref(database, 'news');
      const snapshot = await get(newsRef);
      
      if (snapshot.exists()) {
        const newsData = snapshot.val();
        return Object.keys(newsData).map(key => ({
          id: key,
          ...newsData[key]
        })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  },

  // News hinzufügen
  add: async (newsItem) => {
    try {
      const newsRef = ref(database, 'news');
      const newNewsRef = push(newsRef);
      
      const newsData = {
        ...newsItem,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await set(newNewsRef, newsData);
      return { id: newNewsRef.key, ...newsData };
    } catch (error) {
      console.error('Error adding news:', error);
      throw error;
    }
  },

  // News aktualisieren
  update: async (id, updates) => {
    try {
      const newsRef = ref(database, `news/${id}`);
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      await set(newsRef, updatedData);
      return { id, ...updatedData };
    } catch (error) {
      console.error('Error updating news:', error);
      throw error;
    }
  },

  // News löschen
  delete: async (id) => {
    try {
      const newsRef = ref(database, `news/${id}`);
      await remove(newsRef);
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  },

  // Live-Updates für News
  subscribe: (callback) => {
    const newsRef = ref(database, 'news');
    onValue(newsRef, (snapshot) => {
      if (snapshot.exists()) {
        const newsData = snapshot.val();
        const newsList = Object.keys(newsData).map(key => ({
          id: key,
          ...newsData[key]
        })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        callback(newsList);
      } else {
        callback([]);
      }
    });
    
    return () => off(newsRef);
  }
};

/**
 * Downloads Service
 */
export const downloadsService = {
  // Alle Downloads abrufen
  getAll: async () => {
    try {
      const downloadsRef = ref(database, 'downloads');
      const snapshot = await get(downloadsRef);
      
      if (snapshot.exists()) {
        const downloadsData = snapshot.val();
        return Object.keys(downloadsData).map(key => ({
          id: key,
          ...downloadsData[key]
        })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching downloads:', error);
      return [];
    }
  },

  // Download hinzufügen
  add: async (downloadItem) => {
    try {
      const downloadsRef = ref(database, 'downloads');
      const newDownloadRef = push(downloadsRef);
      
      const downloadData = {
        ...downloadItem,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        downloadCount: 0
      };
      
      await set(newDownloadRef, downloadData);
      return { id: newDownloadRef.key, ...downloadData };
    } catch (error) {
      console.error('Error adding download:', error);
      throw error;
    }
  },

  // Download aktualisieren
  update: async (id, updates) => {
    try {
      const downloadRef = ref(database, `downloads/${id}`);
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      await set(downloadRef, updatedData);
      return { id, ...updatedData };
    } catch (error) {
      console.error('Error updating download:', error);
      throw error;
    }
  },

  // Download löschen
  delete: async (id) => {
    try {
      const downloadRef = ref(database, `downloads/${id}`);
      await remove(downloadRef);
    } catch (error) {
      console.error('Error deleting download:', error);
      throw error;
    }
  },

  // Download-Counter erhöhen
  incrementDownloadCount: async (id) => {
    try {
      const downloadRef = ref(database, `downloads/${id}`);
      const snapshot = await get(downloadRef);
      
      if (snapshot.exists()) {
        const downloadData = snapshot.val();
        const newCount = (downloadData.downloadCount || 0) + 1;
        
        await set(ref(database, `downloads/${id}/downloadCount`), newCount);
        return newCount;
      }
    } catch (error) {
      console.error('Error incrementing download count:', error);
    }
  }
};

/**
 * VIP Service
 */
export const vipService = {
  // VIP-Benutzer authentifizieren
  authenticate: async (username, password) => {
    try {
      const vipRef = ref(database, 'vip-users');
      const snapshot = await get(vipRef);
      
      if (snapshot.exists()) {
        const vipUsers = snapshot.val();
        const user = Object.values(vipUsers).find(u => 
          u.username === username && u.password === password
        );
        
        if (user) {
          // Letzten Login aktualisieren
          const userId = Object.keys(vipUsers).find(key => 
            vipUsers[key].username === username
          );
          
          await set(ref(database, `vip-users/${userId}/lastLogin`), new Date().toISOString());
          
          return { 
            id: userId, 
            username: user.username, 
            createdAt: user.createdAt,
            lastLogin: new Date().toISOString()
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error authenticating VIP user:', error);
      return null;
    }
  },

  // Alle VIP-Benutzer abrufen (nur für Admin)
  getAll: async () => {
    try {
      const vipRef = ref(database, 'vip-users');
      const snapshot = await get(vipRef);
      
      if (snapshot.exists()) {
        const vipData = snapshot.val();
        return Object.keys(vipData).map(key => ({
          id: key,
          ...vipData[key],
          password: '***' // Passwort nicht zurückgeben
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching VIP users:', error);
      return [];
    }
  },

  // VIP-Benutzer hinzufügen
  add: async (username, password) => {
    try {
      const vipRef = ref(database, 'vip-users');
      const newVipRef = push(vipRef);
      
      const vipData = {
        username,
        password, // In Produktion sollte das Passwort gehashed werden
        createdAt: new Date().toISOString(),
        lastLogin: null
      };
      
      await set(newVipRef, vipData);
      return { id: newVipRef.key, ...vipData, password: '***' };
    } catch (error) {
      console.error('Error adding VIP user:', error);
      throw error;
    }
  },

  // VIP-Benutzer löschen
  delete: async (id) => {
    try {
      const vipRef = ref(database, `vip-users/${id}`);
      await remove(vipRef);
    } catch (error) {
      console.error('Error deleting VIP user:', error);
      throw error;
    }
  },

  // VIP-Inhalte abrufen
  getVipContent: async () => {
    try {
      const vipContentRef = ref(database, 'vip-content');
      const snapshot = await get(vipContentRef);
      
      if (snapshot.exists()) {
        const vipData = snapshot.val();
        return Object.keys(vipData).map(key => ({
          id: key,
          ...vipData[key]
        })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching VIP content:', error);
      return [];
    }
  },

  // VIP-Inhalt hinzufügen
  addVipContent: async (content) => {
    try {
      const vipContentRef = ref(database, 'vip-content');
      const newContentRef = push(vipContentRef);
      
      const contentData = {
        ...content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await set(newContentRef, contentData);
      return { id: newContentRef.key, ...contentData };
    } catch (error) {
      console.error('Error adding VIP content:', error);
      throw error;
    }
  }
};

