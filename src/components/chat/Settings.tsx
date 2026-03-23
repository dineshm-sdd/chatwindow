import * as React from 'react';
import { 
  Bell, 
  User, 
  Video, 
  MessageSquare, 
  ArrowLeft
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSettings } from '../../lib/SettingsContext';

interface SettingsProps {
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const { settings, updateSetting } = useSettings();

  const sections = [
    { 
      id: 'profile', 
      title: 'Profile Settings', 
      icon: User, 
      description: 'Manage your public presence and personal info',
      items: [
        { label: 'Display Name', value: settings.userName, type: 'text', key: 'userName' },
        { label: 'Privacy Mode', type: 'toggle', value: true }
      ]
    },
    { 
      id: 'notifications', 
      title: 'Notification Settings', 
      icon: Bell, 
      description: 'Control how you receive alerts and messages',
      items: [
        { label: 'Push Notifications', type: 'toggle', value: settings.pushNotifications, key: 'pushNotifications' },
        { label: 'Email Alerts', type: 'toggle', value: settings.emailAlerts, key: 'emailAlerts' }
      ]
    },
    { 
      id: 'media', 
      title: 'Sound & Video Quality', 
      icon: Video, 
      description: 'Optimize your calling and playback experience',
      items: [
        { label: 'Sound Quality', type: 'select', value: settings.soundQuality, options: ['High', 'Standard', 'Low'], key: 'soundQuality' },
        { label: 'Video Quality', type: 'select', value: settings.videoQuality, options: ['4K', '1080p', '720p', 'Auto'], key: 'videoQuality' },
        { label: 'Noise Cancellation', type: 'toggle', value: settings.noiseCancellation, key: 'noiseCancellation' }
      ]
    },
    { 
      id: 'chat', 
      title: 'Chat Settings', 
      icon: MessageSquare, 
      description: 'Customize your messaging interface',
      items: [
        { label: 'Theme', type: 'select', value: settings.theme, options: ['dark', 'light'], key: 'theme' },
        { label: 'Font Size', type: 'select', value: settings.fontSize, options: ['small', 'medium', 'large'], key: 'fontSize' }
      ]
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background animate-in slide-in-from-right duration-300">
      <header className="h-16 border-b flex items-center px-6 gap-4 bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-accent rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-lg">Settings</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          {sections.map((section) => (
            <section key={section.id} className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <section.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{section.title}</h3>
                  <p className="text-xs text-muted-foreground">{section.description}</p>
                </div>
              </div>

              <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
                {section.items.map((item: any, idx: number) => (
                  <div 
                    key={item.label}
                    className={cn(
                      "group flex items-center justify-between p-4 hover:bg-accent/30 transition-colors",
                      idx !== section.items.length - 1 && "border-b"
                    )}
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                    
                    <div className="flex items-center gap-3">
                      {item.type === 'select' && (
                        <div className="flex gap-1 bg-accent/50 p-1 rounded-lg">
                          {item.options.map((opt: string) => (
                            <button
                              key={opt}
                              onClick={() => updateSetting(item.key, opt as any)}
                              className={cn(
                                "px-2 py-1 text-[10px] uppercase font-bold rounded-md transition-all",
                                item.value === opt ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-accent"
                              )}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}

                      {item.type === 'toggle' && (
                        <button 
                          onClick={() => updateSetting(item.key, !item.value)}
                          className={cn(
                            "w-10 h-5 rounded-full relative transition-colors duration-300",
                            item.value ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
                          )}
                        >
                          <div className={cn(
                            "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm",
                            item.value ? "left-5.5" : "left-0.5"
                          )} />
                        </button>
                      )}

                      {item.type === 'text' && (
                        <input 
                          type="text" 
                          value={item.value}
                          onChange={(e) => updateSetting(item.key, e.target.value)}
                          className="bg-accent/50 border border-transparent rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all outline-none text-right"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};
