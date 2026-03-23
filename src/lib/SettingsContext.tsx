import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

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

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem('nexchat-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('nexchat-settings', JSON.stringify(settings));
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
  }, [settings.theme, settings.fontSize]);

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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
