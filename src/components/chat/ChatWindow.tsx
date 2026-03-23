import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Smile, 
  Paperclip, 
  Search, 
  Phone, 
  Video, 
  MoreVertical,
  Menu,
  BellOff,
  Bell,
  Trash2,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Message } from '../../types';
import { db } from '../../lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';

interface ChatWindowProps {
  id: string;
  name: string;
  isChannel: boolean;
  isMuted: boolean;
  messages: Message[];
  onUpdateMessages: (messages: Message[]) => void;
  onMenuClick: () => void;
  onToggleMute: () => void;
  onDeleteChat: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  id, 
  name, 
  isChannel, 
  isMuted,
  messages,
  onUpdateMessages,
  onMenuClick,
  onToggleMute,
  onDeleteChat
}) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isVideoCalling, setIsVideoCalling] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', id),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text,
          senderId: data.senderId,
          senderName: data.senderName,
          timestamp: data.timestamp?.toDate() || new Date(),
        } as Message;
      });
      onUpdateMessages(msgs);
    });

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const text = inputText;
    
    setInputText('');
    setShowEmojiPicker(false);

    try {
      await addDoc(collection(db, 'messages'), {
        chatId: id,
        text: text,
        senderId: 'me',
        senderName: 'Me',
        timestamp: serverTimestamp(),
      });

      if (!isChannel) {
        // Simple auto-reply simulation for DM
        setTimeout(async () => {
          await addDoc(collection(db, 'messages'), {
            chatId: id,
            text: `Thanks for your message: "${text}". I'll get back to you soon!`,
            senderId: id,
            senderName: name,
            timestamp: serverTimestamp(),
          });
        }, 1500);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: `📎 Attached file: ${file.name}`,
        senderId: 'me',
        senderName: 'Me',
        timestamp: new Date(),
      };
      onUpdateMessages([...messages, newMessage]);
    }
  };

  const filteredMessages = searchQuery 
    ? messages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  return (
    <div className="flex-1 flex flex-col h-full bg-background/50 relative min-w-0 overflow-hidden transition-all">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange}
      />

      {/* Calling Modal Overlay */}
      {(isCalling || isVideoCalling) && (
        <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center relative mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20" />
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold text-white uppercase">
              {name[0]}
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
          <p className="text-slate-400 mb-12 animate-pulse">
            {isCalling ? 'Voice calling...' : 'Video calling...'}
          </p>
          <div className="flex gap-6">
            <button 
              onClick={() => { setIsCalling(false); setIsVideoCalling(false); }}
              className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <Phone className="w-6 h-6 rotate-[135deg]" />
            </button>
            {isVideoCalling && (
              <button className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-white shadow-lg cursor-pointer">
                <Video className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="h-16 border-b flex items-center justify-between px-4 sm:px-6 bg-card/50 backdrop-blur-md sticky top-0 z-10 w-full min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 hover:bg-accent rounded-lg lg:hidden transition-colors shrink-0 cursor-pointer"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <div className={cn(
            "w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center transition-all shrink-0",
            isSearching && "hidden sm:flex"
          )}>
            <span className="font-semibold text-primary text-sm sm:text-base uppercase">{isChannel ? '#' : name[0]}</span>
          </div>
          <div className={cn("min-w-0", isSearching && "hidden sm:block")}>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-xs sm:text-sm leading-none truncate">{name}</h2>
              {isMuted && <BellOff className="w-3 h-3 text-muted-foreground/40 shrink-0" />}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1 truncate mt-0.5">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 shrink-0" />
              {isChannel ? '12 online' : 'Active now'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {isSearching ? (
            <div className="flex items-center bg-accent/50 rounded-xl px-2 py-1.5 animate-in slide-in-from-right-4 duration-300 w-[150px] sm:w-[200px]">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input 
                autoFocus
                type="text" 
                placeholder="Search messages..."
                className="bg-transparent border border-transparent focus:ring-2 focus:ring-primary/10 focus:border-primary/20 rounded-lg text-xs w-full px-2 outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={() => { setIsSearching(false); setSearchQuery(''); }} className="p-1 hover:bg-accent rounded-md cursor-pointer">
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => setIsSearching(true)}
                className="p-2 hover:bg-accent rounded-xl text-muted-foreground transition-all cursor-pointer"
              >
                <Search className="w-4 h-4 sm:w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsCalling(true)}
                className="p-2 hover:bg-accent rounded-xl text-muted-foreground transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4 sm:w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsVideoCalling(true)}
                className="p-2 hover:bg-accent rounded-xl text-muted-foreground transition-all cursor-pointer"
              >
                <Video className="w-4 h-4 sm:w-5 h-5" />
              </button>
            </>
          )}

          <div className="relative">
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 hover:bg-accent rounded-xl text-muted-foreground transition-all cursor-pointer"
            >
              <MoreVertical className="w-4 h-4 sm:w-5 h-5" />
            </button>
            
            {showMoreMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border rounded-2xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <button 
                  onClick={() => { onToggleMute(); setShowMoreMenu(false); }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-sm hover:bg-accent text-left transition-colors cursor-pointer"
                >
                  {isMuted ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  {isMuted ? 'Unmute' : 'Mute'} Notifications
                </button>
                <button 
                  onClick={() => { onDeleteChat(); setShowMoreMenu(false); }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-sm hover:bg-destructive/10 text-destructive text-left transition-colors font-medium border-t cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Conversation
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
      >
        {filteredMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
              <Search className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-sm font-medium">
              {searchQuery ? `No messages found matching "${searchQuery}"` : 'No messages here yet...'}
            </p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div 
              key={msg.id}
              className={cn(
                "flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300",
                msg.senderId === 'me' ? "items-end" : "items-start",
                msg.senderId === 'system' && "items-center"
              )}
            >
              {msg.senderId === 'system' ? (
                <span className="text-[10px] sm:text-xs text-muted-foreground bg-accent/50 px-3 py-1 rounded-full">{msg.text}</span>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{msg.senderName}</span>
                    <span className="text-[10px] text-muted-foreground/60">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className={cn(
                    "max-w-[85%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                    msg.senderId === 'me' 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-card border text-card-foreground rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="p-4 sm:p-6 bg-card/30 backdrop-blur-sm border-t relative">
        {showEmojiPicker && (
          <div className="absolute bottom-full mb-4 left-4 sm:left-6 w-64 bg-card border rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-2 duration-200 z-30">
            <div className="grid grid-cols-6 gap-2">
              {['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪'].map(emoji => (
                <button 
                  key={emoji}
                  onClick={() => {
                    setInputText(prev => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="text-xl hover:bg-accent rounded-lg p-1.5 transition-all hover:scale-125 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-center">
              Popular Emojis
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto flex items-end gap-2 sm:gap-4 relative group">
          <div className="flex-1 bg-accent/30 hover:bg-accent/40 border border-white/5 shadow-inner rounded-3xl transition-all duration-300 focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/30 focus-within:bg-card flex items-end px-3 sm:px-4 py-2 sm:py-3 relative">
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={cn(
                "p-1 sm:p-2 hover:bg-accent rounded-full text-muted-foreground transition-all cursor-pointer",
                showEmojiPicker && "text-primary bg-primary/10"
              )}
            >
              <Smile className="w-5 h-5 sm:w-6 h-6" />
            </button>
            
            <textarea 
              rows={1}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm sm:text-base resize-none py-1 sm:py-1.5 px-2 max-h-32 text-foreground"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-1 sm:p-2 hover:bg-accent rounded-full text-muted-foreground transition-all cursor-pointer"
            >
              <Paperclip className="w-5 h-5 sm:w-6 h-6" />
            </button>
          </div>

          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="w-10 h-10 sm:w-14 h-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-5 h-5 sm:w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
