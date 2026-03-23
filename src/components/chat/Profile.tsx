import * as React from 'react';
import { useState } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Camera, 
  ArrowLeft,
  Check,
  Edit2
} from 'lucide-react';
import { useSettings } from '../../lib/SettingsContext';

interface ProfileProps {
  onBack: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ onBack }) => {
  const { settings, updateSetting } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(settings.userName);
  const [tempBio, setTempBio] = useState(settings.userBio);

  const handleSave = () => {
    updateSetting('userName', tempName);
    updateSetting('userBio', tempBio);
    setIsEditing(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background animate-in fade-in slide-in-from-right duration-300">
      <header className="h-16 border-b flex items-center px-6 gap-4 bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-accent rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-lg">My Profile</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header Card */}
          <div className="bg-card border rounded-[2rem] p-8 mb-8 relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-12 translate-x-12 blur-3xl group-hover:bg-primary/10 transition-colors" />
            
            <div className="flex flex-col items-center gap-6 relative z-10">
              <div className="relative">
                <div className="w-32 h-32 rounded-[2.5rem] bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-4xl shadow-xl border-4 border-background overflow-hidden animate-in zoom-in-75 duration-500">
                  {settings.userAvatar ? (
                    <img src={settings.userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{settings.userName[0]}</span>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all border-4 border-background cursor-pointer">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center space-y-2 w-full">
                {isEditing ? (
                  <div className="space-y-4 max-w-sm mx-auto animate-in fade-in slide-in-from-bottom-2">
                    <input 
                      autoFocus
                      type="text" 
                      className="w-full bg-accent border border-transparent rounded-xl px-4 py-2 text-center font-bold text-xl focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all outline-none"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                    />
                    <textarea 
                      className="w-full bg-accent border border-transparent rounded-xl px-4 py-2 text-center text-sm text-muted-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary/30 min-h-[80px] transition-all outline-none"
                      value={tempBio}
                      onChange={(e) => setTempBio(e.target.value)}
                    />
                    <div className="flex gap-2 justify-center">
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-accent hover:bg-slate-300 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSave}
                        className="px-4 py-2 bg-primary text-white hover:opacity-90 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all"
                      >
                        <Check className="w-3 h-3" /> Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-3">
                      <h3 className="text-2xl font-bold">{settings.userName}</h3>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">{settings.userBio}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-card border rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Mail className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Email Address</p>
                <p className="text-sm font-medium truncate">alice.smith@example.com</p>
              </div>
            </div>

            <div className="bg-card border rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Shield className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Security Level</p>
                <p className="text-sm font-medium">Verified Account</p>
              </div>
            </div>

            <div className="bg-card border rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <User className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">User ID</p>
                <p className="text-sm font-medium truncate">#NX-998234-M</p>
              </div>
            </div>

            <div className="bg-card border rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow underline-offset-4 cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Camera className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Theme Mode</p>
                <p className="text-sm font-medium capitalize">{settings.theme}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
