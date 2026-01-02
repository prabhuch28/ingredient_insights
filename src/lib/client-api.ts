// Local Storage Keys
const STORAGE_KEYS = {
  SESSIONS: 'ingredient_insights_sessions',
  MESSAGES: 'ingredient_insights_messages',
} as const;

export interface ChatSession {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  last_message?: {
    content: string;
    timestamp: string;
    role: string;
  };
}

export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSessionDetail extends ChatSession {
  messages: Message[];
}

// Helper functions for local storage
class LocalStorageAPI {
  private getFromStorage<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  }

  private saveToStorage<T>(key: string, data: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
      throw new Error('Failed to save data. Storage quota may be exceeded.');
    }
  }

  private generateId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  // Chat Sessions
  async getChatSessions(): Promise<ChatSession[]> {
    const sessions = this.getFromStorage<ChatSession[]>(STORAGE_KEYS.SESSIONS);
    return sessions || [];
  }

  async getChatSession(id: number): Promise<ChatSessionDetail> {
    const sessions = await this.getChatSessions();
    const session = sessions.find((s) => s.id === id);

    if (!session) {
      throw new Error(`Session ${id} not found`);
    }

    const messages = await this.getMessages(id);

    return {
      ...session,
      messages,
    };
  }

  async createChatSession(title?: string): Promise<ChatSession> {
    const sessions = await this.getChatSessions();
    const now = new Date().toISOString();

    const newSession: ChatSession = {
      id: this.generateId(),
      title: title || 'New Chat',
      created_at: now,
      updated_at: now,
      message_count: 0,
    };

    sessions.unshift(newSession);
    this.saveToStorage(STORAGE_KEYS.SESSIONS, sessions);

    return newSession;
  }

  async deleteChatSession(id: number): Promise<void> {
    const sessions = await this.getChatSessions();
    const filteredSessions = sessions.filter((s) => s.id !== id);
    this.saveToStorage(STORAGE_KEYS.SESSIONS, filteredSessions);

    // Also delete messages for this session
    const allMessages = this.getFromStorage<Record<number, Message[]>>(STORAGE_KEYS.MESSAGES) || {};
    delete allMessages[id];
    this.saveToStorage(STORAGE_KEYS.MESSAGES, allMessages);
  }

  // Messages
  async getMessages(sessionId: number): Promise<Message[]> {
    const allMessages = this.getFromStorage<Record<number, Message[]>>(STORAGE_KEYS.MESSAGES) || {};
    return allMessages[sessionId] || [];
  }

  async addMessage(
    sessionId: number,
    role: 'user' | 'assistant',
    content: string
  ): Promise<Message> {
    const allMessages = this.getFromStorage<Record<number, Message[]>>(STORAGE_KEYS.MESSAGES) || {};
    const sessionMessages = allMessages[sessionId] || [];

    const newMessage: Message = {
      id: this.generateId(),
      role,
      content,
      timestamp: new Date().toISOString(),
    };

    sessionMessages.push(newMessage);
    allMessages[sessionId] = sessionMessages;
    this.saveToStorage(STORAGE_KEYS.MESSAGES, allMessages);

    // Update session metadata
    const sessions = await this.getChatSessions();
    const sessionIndex = sessions.findIndex((s) => s.id === sessionId);

    if (sessionIndex !== -1) {
      sessions[sessionIndex].message_count = sessionMessages.length;
      sessions[sessionIndex].updated_at = newMessage.timestamp;
      sessions[sessionIndex].last_message = {
        content: newMessage.content,
        timestamp: newMessage.timestamp,
        role: newMessage.role,
      };
      this.saveToStorage(STORAGE_KEYS.SESSIONS, sessions);
    }

    return newMessage;
  }
}

export const apiClient = new LocalStorageAPI();

// Hook for components to use (keeping same interface for compatibility)
export function useApiClient() {
  // No longer need Clerk auth for local storage
  return {
    getChatSessions: async () => {
      return apiClient.getChatSessions();
    },
    getChatSession: async (id: number) => {
      return apiClient.getChatSession(id);
    },
    createChatSession: async (title?: string) => {
      return apiClient.createChatSession(title);
    },
    deleteChatSession: async (id: number) => {
      return apiClient.deleteChatSession(id);
    },
    getMessages: async (sessionId: number) => {
      return apiClient.getMessages(sessionId);
    },
    addMessage: async (sessionId: number, role: 'user' | 'assistant', content: string) => {
      return apiClient.addMessage(sessionId, role, content);
    },
  };
}
