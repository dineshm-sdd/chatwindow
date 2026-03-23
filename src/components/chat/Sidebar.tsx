import * as React from 'react';
import { useState } from 'react';
import { Hash, MessageSquare, Settings as SettingsIcon, Plus, LogOut, BellOff } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  channels: string[];
  activeId: string;
  activeView: string;
  mutedChats: Set<string>;
  onSelect: (id: string, name: string, isChannel: boolean) => void;
  onAddChannel: (name: string) => void;
  onSettingsClick: () => void;
  onProfileClick: () => void;
  onLogout: () => void;
}

import { useSettings } from '../../lib/SettingsContext';

export const Sidebar: React.FC<SidebarProps> = ({ 
  channels,
  activeId, 
  activeView, 
  mutedChats,
  onSelect, 
  onAddChannel,
  onSettingsClick,
  onProfileClick,
  onLogout
}) => {
  const { settings } = useSettings();
  const [isAddingChannel, setIsAddingChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');

  const users = [
    { name: 'Alice', status: 'online' },
    { name: 'Bob', status: 'online' },
    { name: 'Charlie', status: 'away' }
  ];

  return (
    <aside className="w-20 @[240px]:w-64 h-full flex flex-col border-r bg-card/50 backdrop-blur-xl transition-all duration-300">
      <div className="p-4 flex items-center gap-3 border-b h-16">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <MessageSquare className="text-primary-foreground w-5 h-5" />
        </div>
        <span className="font-bold text-xl hidden @[240px]:block truncate">NexChat</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        <div>
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 hidden @[240px]:block">
            Channels
          </h3>
          <div className="space-y-1">
            {channels.map((channel) => (
              <button
                key={channel}
                onClick={() => onSelect(channel, channel, true)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent group",
                  activeId === channel && activeView === 'chat' ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-accent-foreground"
                )}
              >
                <Hash className="w-4 h-4 shrink-0" />
                <span className="hidden @[240px]:block truncate">#{channel}</span>
                {mutedChats.has(channel) && (
                  <BellOff className="w-3 h-3 ml-auto text-muted-foreground/40 shrink-0" />
                )}
              </button>
            ))}
            
            {isAddingChannel ? (
              <div className="px-3 py-2 space-y-2 animate-in slide-in-from-left-2 duration-200">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="channel-name"
                  className="w-full bg-accent border border-transparent rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (newChannelName.trim()) {
                        onAddChannel(newChannelName);
                        setNewChannelName('');
                        setIsAddingChannel(false);
                      }
                    } else if (e.key === 'Escape') {
                      setIsAddingChannel(false);
                    }
                  }}
                  onBlur={() => !newChannelName && setIsAddingChannel(false)}
                />
                <div className="flex gap-1 justify-end">
                  <button onClick={() => setIsAddingChannel(false)} className="p-1 hover:bg-destructive/10 text-destructive rounded-md transition-colors">
                    <Plus className="w-3 h-3 rotate-45" />
                  </button>
                  <button 
                    onClick={() => { if (newChannelName.trim()) { onAddChannel(newChannelName); setNewChannelName(''); setIsAddingChannel(false); }}}
                    className="p-1 hover:bg-primary/10 text-primary rounded-md transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAddingChannel(true)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground/60 hover:bg-accent hover:text-accent-foreground transition-all group"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                <span className="hidden @[240px]:block">Add Channel</span>
              </button>
            )}
          </div>
        </div>

        <div>
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 hidden @[240px]:block">
            Direct Messages
          </h3>
          <div className="space-y-1">
            {users.map((user) => (
              <button
                key={user.name}
                onClick={() => onSelect(user.name.toLowerCase(), user.name, false)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent group",
                  activeId === user.name.toLowerCase() && activeView === 'chat' ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-accent-foreground"
                )}
              >
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center relative shrink-0">
                  <span className="text-[10px] uppercase">{user.name[0]}</span>
                  <div className={cn(
                    "absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-card",
                    user.status === 'online' ? "bg-emerald-500" : "bg-amber-500"
                  )} />
                </div>
                <span className="hidden @[240px]:block truncate">{user.name}</span>
                {mutedChats.has(user.name.toLowerCase()) && (
                  <BellOff className="w-3 h-3 ml-auto text-muted-foreground/40 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t space-y-1 bg-card/80 transition-all">
        <button 
          onClick={onProfileClick}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 group relative",
            activeView === 'profile' 
              ? "bg-primary text-white shadow-lg shadow-primary/20" 
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-transparent group-hover:ring-primary/30 transition-all">
            {settings.userAvatar ? (
              <img src={settings.userAvatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] font-bold text-slate-500">{settings.userName[0]}</span>
            )}
          </div>
          <div className="hidden @[240px]:flex flex-col items-start min-w-0">
            <span className="text-xs font-bold truncate w-full">{settings.userName}</span>
            <span className="text-[10px] text-muted-foreground/60 truncate w-full">View Profile</span>
          </div>
        </button>
        <button 
          onClick={onSettingsClick}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
            activeView === 'settings' ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <SettingsIcon className="w-4 h-4" />
          <span className="hidden @[240px]:block">Settings</span>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden @[240px]:block">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
