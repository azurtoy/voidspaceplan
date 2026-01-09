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
  const [userRole, setUserRole] = useState<string>('student');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  // Fetch user and role
  useEffect(() => {
    async function getUserAndRole() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Fetch user role from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserRole(profile.role || 'student');
        }
      }
    }
    getUserAndRole();
  }, []);

  // Fetch messages and subscribe to real-time updates
  useEffect(() => {
    fetchMessages();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('dashboard-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('New message received:', payload);
          // Add new message immediately
          if (payload.new && (payload.new as any).recipient_id === null) {
            fetchMessages(); // Refetch to get profile data
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('Message deleted:', payload);
          // Remove deleted message immediately
          setMessages((prev) => prev.filter((msg) => msg.id !== (payload.old as any).id));
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

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

  const handleDelete = async (messageId: string) => {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  const canDeleteMessage = (message: Message) => {
    // User can delete own messages OR admin can delete any message
    return message.sender_id === user?.id || userRole === 'admin';
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
      {/* Header - Compact */}
      <div className="border-b border-white/20 pb-2 mb-3">
        <h3 className="text-sm font-light tracking-widest text-[#FF358B] uppercase flex items-center gap-2">
          📡 LIVE FREQUENCY
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Public channel for the cohort
        </p>
      </div>

      {/* Messages - Increased height, custom scrollbar */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-3 max-h-96 pr-2 custom-scrollbar">
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
                className={`relative max-w-[85%] px-2.5 py-1.5 rounded group ${
                  msg.sender_id === user?.id
                    ? 'bg-[#FF358B]/20 border border-[#FF358B]/30'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                {/* Delete Button - More visible, top-right corner */}
                {canDeleteMessage(msg) && (
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-black/80 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-900/30 transition-all border border-white/20 opacity-0 group-hover:opacity-100"
                    title="Delete message"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                )}
                
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-gray-300">
                    {msg.profiles?.nickname || 'Anonymous'}
                    {userRole === 'admin' && msg.sender_id !== user?.id && (
                      <span className="ml-1 text-[10px] text-[#FF358B]/60">[Admin]</span>
                    )}
                  </span>
                  <span className="text-[10px] text-gray-500">
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

      {/* Input - Compact */}
      <form onSubmit={handleSend} className="border-t border-white/20 pt-2">
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
            className="px-4 py-2 bg-[#FF358B]/20 border border-[#FF358B]/30 text-[#FF358B] text-xs font-light tracking-wider hover:bg-[#FF358B]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? '...' : 'SEND'}
          </button>
        </div>
        <p className="text-[10px] text-gray-600 mt-1.5">
          Max 500 characters. Be respectful.
        </p>
      </form>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
        
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.15) rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </div>
  );
}
