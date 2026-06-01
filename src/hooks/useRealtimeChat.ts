import { useState, useEffect, useCallback } from 'react';
import { rtdb, auth } from '@/lib/firebase';
import { ref, push, set, onValue, off, serverTimestamp, query, limitToLast, DataSnapshot } from 'firebase/database';
import { useUserStore } from '@/store/useUserStore';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderPhoto: string;
  text: string;
  type: 'text' | 'image' | 'voice';
  mediaUrl?: string;
  timestamp: number;
  reactions?: Record<string, string[]>; // emoji: [uid1, uid2]
}

export function useRealtimeChat(chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});
  const { profile } = useUserStore();
  const user = auth.currentUser;

  // Listen for messages
  useEffect(() => {
    if (!chatId) {
      return;
    }

    const messagesRef = query(ref(rtdb, `messages/${chatId}`), limitToLast(50));
    const handleData = (snapshot: DataSnapshot) => {
      const data = snapshot.val() as Record<string, Omit<Message, 'id'>> | null;
      if (data) {
        const msgList = Object.entries(data).map(([id, val]) => ({
          id,
          ...val,
        })) as Message[];
        setMessages(msgList.sort((a, b) => a.timestamp - b.timestamp));
      } else {
        setMessages([]);
      }
    };

    onValue(messagesRef, handleData);
    return () => off(messagesRef, 'value', handleData);
  }, [chatId]);

  // Listen for typing status
  useEffect(() => {
    if (!chatId) return;

    const typingRef = ref(rtdb, `typing/${chatId}`);
    const handleTyping = (snapshot: any) => {
      setIsTyping(snapshot.val() || {});
    };

    onValue(typingRef, handleTyping);
    return () => off(typingRef, 'value', handleTyping);
  }, [chatId]);

  const sendMessage = useCallback(async (text: string, type: Message['type'] = 'text', mediaUrl?: string) => {
    if (!chatId || !user) return;

    const messagesRef = ref(rtdb, `messages/${chatId}`);
    const newMessageRef = push(messagesRef);
    
    await set(newMessageRef, {
      senderId: user.uid,
      senderName: profile.name,
      senderPhoto: profile.pfp,
      text,
      type,
      mediaUrl,
      timestamp: serverTimestamp(),
    });
  }, [chatId, user, profile]);

  const setTyping = useCallback((status: boolean) => {
    if (!chatId || !user) return;
    const typingRef = ref(rtdb, `typing/${chatId}/${user.uid}`);
    set(typingRef, status);
  }, [chatId, user]);

  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!chatId || !user) return;
    const reactionRef = ref(rtdb, `messages/${chatId}/${messageId}/reactions/${emoji}`);
    // This is simplified, in a real app we'd use a transaction to add/remove the user's UID
    // For now, we'll just push the UID if not present
    onValue(reactionRef, (snapshot) => {
      const uids = snapshot.val() || [];
      if (!uids.includes(user.uid)) {
        set(reactionRef, [...uids, user.uid]);
      }
    }, { onlyOnce: true });
  }, [chatId, user]);

  return { messages, isTyping, sendMessage, setTyping, addReaction };
}
