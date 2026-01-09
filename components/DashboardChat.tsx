'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  profiles?: {
    nickname: string;
  } | null;
}

export default function DashboardChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  // Fetch user
  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  // Fetch messages
  useEffect(() => {
    fetchMessages();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('dashboard-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: 'recipient_id=is.null', // Public messages (no specific recipient)
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        sender_id,
        content,
        created_at,
        profiles!messages_sender_id_fkey (nickname)
      `)
      .is('recipient_id', null) // Public messages only
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages((data as any) || []);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || sending) return;

    setSending(true);

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        recipient_id: null, // Public message
        content: newMessage.trim(),
      });

    if (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      alert(`Failed to send message: ${error.message || 'Unknown error'}`);
    } else {
      setNewMessage('');
    }

    setSending(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-white/20 pb-3 mb-4">
        <h3 className="text-sm font-light tracking-widest text-[#FF358B] uppercase flex items-center gap-2">
          📡 LIVE FREQUENCY
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Public channel for the cohort
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-64">
        {messages.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-8">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender_id === user?.id ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded ${
                  msg.sender_id === user?.id
                    ? 'bg-[#FF358B]/20 border border-[#FF358B]/30'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-gray-300">
                    {msg.profiles?.nickname || 'Anonymous'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(msg.created_at)}
                  </span>
                </div>
                <p className="text-sm text-gray-200 break-words">
                  {msg.content}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-white/20 pt-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-black/60 border border-white/20 text-gray-100 text-sm focus:outline-none focus:border-[#FF358B] transition-colors"
            maxLength={500}
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="px-4 py-2 bg-[#FF358B]/20 border border-[#FF358B]/30 text-[#FF358B] text-sm font-light tracking-wider hover:bg-[#FF358B]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? '...' : 'SEND'}
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Max 500 characters. Be respectful.
        </p>
      </form>
    </div>
  );
}
