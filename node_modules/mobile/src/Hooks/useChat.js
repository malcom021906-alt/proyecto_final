import { useState, useEffect } from 'react';
import { ref, push, onValue, set } from 'firebase/database';
import { realtimeDb } from '../firebase';

export const useChat = (chatId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatId) return;

    setLoading(true);

    try {
      const messagesRef = ref(realtimeDb, `chats/${chatId}/messages`);
      
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          // Ordenar cronológicamente
          setMessages(list.sort((a, b) => a.timestamp - b.timestamp));
        } else {
          setMessages([]);
        }
        setLoading(false);
      }, (error) => {
        console.warn("Fallo Firebase Realtime Database, utilizando simulador de Chat en Memoria Local:", error.message);
        loadLocalChat();
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn("Firebase no inicializado para chat. Iniciando simulador offline.");
      loadLocalChat();
    }
  }, [chatId]);

  const loadLocalChat = () => {
    const localMsgs = JSON.parse(localStorage.getItem(`malcom_chat_${chatId}`) || '[]');
    setMessages(localMsgs);
    setLoading(false);
  };

  const sendMessage = async (senderId, content) => {
    if (!content.trim()) return;

    const messageData = {
      senderId,
      content,
      timestamp: Date.now()
    };

    try {
      const messagesRef = ref(realtimeDb, `chats/${chatId}/messages`);
      await push(messagesRef, messageData);
    } catch (e) {
      console.warn("Enviando mensaje local debido a modo offline.");
      const key = 'msg-' + Math.random().toString(36).substr(2, 9);
      const localMsgs = JSON.parse(localStorage.getItem(`malcom_chat_${chatId}`) || '[]');
      const newMsg = { id: key, ...messageData };
      localMsgs.push(newMsg);
      localStorage.setItem(`malcom_chat_${chatId}`, JSON.stringify(localMsgs));
      setMessages(localMsgs);

      // Simular respuesta del vendedor en 2 segundos si el remitente es el cliente
      if (senderId !== 'admin-seed-id') {
        setTimeout(() => {
          const responseMsg = {
            id: 'msg-' + Math.random().toString(36).substr(2, 9),
            senderId: 'admin-seed-id',
            content: '¡Hola! Claro que sí, el producto está disponible con envío inmediato y garantía de 12 meses. ¿Tienes alguna otra duda?',
            timestamp: Date.now()
          };
          const currentMsgs = JSON.parse(localStorage.getItem(`malcom_chat_${chatId}`) || '[]');
          currentMsgs.push(responseMsg);
          localStorage.setItem(`malcom_chat_${chatId}`, JSON.stringify(currentMsgs));
          setMessages(currentMsgs);
        }, 1500);
      }
    }
  };

  return { messages, loading, sendMessage };
};
