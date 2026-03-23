import { createContext, useContext, useEffect, useState } from 'react';
import { db, auth } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface SettingsState {
  soundQuality: 'High' | 'Standard' | 'Low';
  videoQuality: '4K' | '1080p' | '720p' | 'Auto';
  noiseCancellation: boolean;
  pushNotifications: boolean;
  emailAlerts: boolean;
  theme: 'dark' | 'light';
  fontSize: 'small' | 'medium' | 'large';
  autoDownloadImages: boolean;
  userName: string;
  userBio: string;
  userAvatar: string;
}

const defaultSettings: SettingsState = {
  soundQuality: 'High',
  videoQuality: '1080p',
  noiseCancellation: true,
  pushNotifications: true,
  emailAlerts: false,
  theme: 'dark',
  fontSize: 'medium',
  autoDownloadImages: true,
  userName: 'Alice Smith',
  userBio: 'Product Designer & Coffee Enthusiast',
  userAvatar: ''
};

interface SettingsContextType {
  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'nexchat-settings';

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // Firestore Sync Effect
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Listen to Firestore document for this user
        const userDocRef = doc(db, 'users', user.uid);
        
        const unsubscribeDoc = onSnapshot(userDocRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setSettings(prev => ({
              ...prev,
              userName: data.userName || prev.userName,
              userBio: data.userBio || prev.userBio,
              userAvatar: data.userAvatar || prev.userAvatar
            }));
          } else {
            // Document doesn't exist, initialize it with current settings
            setDoc(userDocRef, {
              userName: settings.userName,
              userBio: settings.userBio,
              userAvatar: settings.userAvatar,
              email: user.email,
              updatedAt: new Date()
            });
          }
        });

        return () => unsubscribeDoc();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    // Apply theme
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply Font Size
    const root = document.documentElement;
    root.classList.remove('text-small', 'text-medium', 'text-large');
    root.classList.add(`text-${settings.fontSize}`);
  }, [settings.theme, settings.fontSize, settings.userName, settings.userBio]);

  const updateSetting = async <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    // Update local state first for immediate UI feedback
    setSettings(prev => ({ ...prev, [key]: value }));

    // If it's a profile setting, sync to Firestore
    if (['userName', 'userBio', 'userAvatar'].includes(key as string)) {
      const user = auth.currentUser;
      if (user) {
        try {
          await setDoc(doc(db, 'users', user.uid), {
            [key]: value,
            updatedAt: new Date()
          }, { merge: true });
        } catch (error) {
          console.error('Error syncing setting to Firestore:', error);
        }
      }
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
