import * as React from 'react';
import { useState, useEffect } from 'react';
import { Sidebar } from './components/chat/Sidebar';
import { ChatWindow } from './components/chat/ChatWindow';
import { Settings } from './components/chat/Settings';
import { Auth } from './components/auth/Auth';
import { Profile } from './components/chat/Profile';
import { Message } from './types';

export type ViewType = 'chat' | 'settings' | 'profile';

const initialMessagesData: Record<string, Message[]> = {
  'general': [
    { id: '1', text: 'Welcome to the general channel!', senderId: 'system', senderName: 'System', timestamp: new Date() },
    { id: '2', text: 'Anyone here?', senderId: 'bob', senderName: 'Bob', timestamp: new Date() },
  ],
  'alice': [
    { id: '3', text: 'Hey there!', senderId: 'alice', senderName: 'Alice', timestamp: new Date() },
    { id: '4', text: 'How is the new app coming along?', senderId: 'alice', senderName: 'Alice', timestamp: new Date() },
  ]
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('nexchat-auth') === 'true';
  });
  
  const [activeView, setActiveView] = useState<ViewType>('chat');
  const [activeId, setActiveId] = useState<string>('general');
  const [activeName, setActiveName] = useState<string>('general');
  const [isChannel, setIsChannel] = useState<boolean>(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const [channels, setChannels] = useState<string[]>(['general', 'design-team', 'development', 'random']);
  const [mutedChats, setMutedChats] = useState<Set<string>>(new Set());
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(initialMessagesData);

  useEffect(() => {
    localStorage.setItem('nexchat-auth', isAuthenticated.toString());
  }, [isAuthenticated]);

  const handleSelectConversation = (id: string, name: string, isChan: boolean) => {
    setActiveId(id);
    setActiveName(name);
    setIsChannel(isChan);
    setActiveView('chat');
    setIsMobileSidebarOpen(false);
  };

  const handleAddChannel = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    if (!channels.includes(slug)) {
      setChannels([...channels, slug]);
      handleSelectConversation(slug, slug, true);
    }
  };

  const handleDeleteChat = (id: string) => {
    if (confirm(`Are you sure you want to delete the chat with ${id}?`)) {
      setChannels(channels.filter(c => c !== id));
      const newMessages = { ...allMessages };
      delete newMessages[id];
      setAllMessages(newMessages);
      
      if (activeId === id) {
        handleSelectConversation('general', 'general', true);
      }
    }
  };

  const toggleMute = (id: string) => {
    const newMuted = new Set(mutedChats);
    if (newMuted.has(id)) newMuted.delete(id);
    else newMuted.add(id);
    setMutedChats(newMuted);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView('chat');
  };

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden @container transition-all duration-300 relative">
      {isMobileSidebarOpen && (
        <div 
          className="lg:hidden absolute inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all animate-in fade-in duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          channels={channels}
          activeId={activeId} 
          activeView={activeView}
          mutedChats={mutedChats}
          onSelect={handleSelectConversation}
          onAddChannel={handleAddChannel}
          onSettingsClick={() => {
            setActiveView('settings');
            setIsMobileSidebarOpen(false);
          }}
          onProfileClick={() => {
            setActiveView('profile');
            setIsMobileSidebarOpen(false);
          }}
          onLogout={handleLogout}
        />
      </div>

      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {activeView === 'chat' && (
          <ChatWindow 
            id={activeId} 
            name={activeName} 
            isChannel={isChannel}
            isMuted={mutedChats.has(activeId)}
            messages={allMessages[activeId] || []}
            onUpdateMessages={(newMsgs: Message[]) => setAllMessages(prev => ({ ...prev, [activeId]: newMsgs }))}
            onMenuClick={() => setIsMobileSidebarOpen(true)}
            onToggleMute={() => toggleMute(activeId)}
            onDeleteChat={() => handleDeleteChat(activeId)}
          />
        )}
        {activeView === 'settings' && (
          <Settings onBack={() => setActiveView('chat')} />
        )}
        {activeView === 'profile' && (
          <Profile onBack={() => setActiveView('chat')} />
        )}
      </main>
    </div>
  );
};

export default App;
