export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: any;
  avatar?: string;
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'dm';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
}
