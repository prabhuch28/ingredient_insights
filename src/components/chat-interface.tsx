'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, User, Bot } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Message } from '@/lib/client-api';
import { sendChatMessage } from '@/app/actions';

// Typewriter effect hook
const useTypewriter = (texts: string[], speed: number = 100) => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setDisplayText(currentText.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(currentText.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, speed]);

  return displayText;
};

interface ChatInterfaceProps {
  sessionId: number;
}

export function ChatInterface({ sessionId }: ChatInterfaceProps) {
  const { currentSession, addMessage, loading } = useChat();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const typewriterText = useTypewriter([
    "Ask me about ingredients...",
    "What's in your food?",
    "Need nutrition advice?",
    "Curious about additives?"
  ], 80);

  const messages = currentSession?.messages || [];

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || sending) return;

    try {
      setSending(true);

      // Add user message to chat
      await addMessage(sessionId, 'user', message);
      const userMessage = message;
      setMessage('');

      // Get conversation history for context
      const conversationHistory = messages.map((msg: Message) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Add the new user message to history
      conversationHistory.push({
        role: 'user' as const,
        content: userMessage,
      });

      // Get AI response using Gemini via server action
      const aiResponse = await sendChatMessage(userMessage, conversationHistory);

      // Add AI response to chat
      await addMessage(sessionId, 'assistant', aiResponse);

    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message to chat
      await addMessage(sessionId, 'assistant', 'Sorry, I encountered an error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-black/95">
      <CardHeader className="border-b glass-morphism">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary neon-text" />
          {currentSession?.title || 'Chat'}
        </CardTitle>
      </CardHeader>

      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 neon-scrollbar">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50 text-primary" />
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((msg: Message) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${msg.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'
                    }`}>
                    {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>

                  <div className={`rounded-lg px-4 py-2 ${msg.role === 'user'
                    ? 'chat-message-user'
                    : 'chat-message-assistant'
                    }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}

          {sending && (
            <div className="flex gap-3 justify-start">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full chat-message-assistant">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-lg px-4 py-2 chat-message-assistant">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-4 glass-morphism">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={typewriterText}
            className="min-h-[60px] resize-none neon-input placeholder:text-white"
            disabled={sending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || sending}
            size="icon"
            className="self-end neon-button"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
