import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../api/client';
import FileUpload from '../components/FileUpload';
import '../styles/chat.css';

interface ChatPageProps {
  token: string;
  userId: string;
  onLogout: () => void;
}

interface Message {
  messageId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export const ChatPage: React.FC<ChatPageProps> = ({ token, userId, onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // チャット初期化
  useEffect(() => {
    const initChat = async () => {
      try {
        const response = await apiClient.createChat(userId, 'New Chat');
        setChatId(response.chatId);
      } catch (err: any) {
        setError('Failed to initialize chat');
        console.error(err);
      }
    };

    initChat();
  }, [userId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || !chatId) {
      return;
    }

    const userMessage: Message = {
      messageId: `msg_${Date.now()}`,
      content: input,
      role: 'user',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // ユーザーメッセージを送信
      await apiClient.sendMessage(chatId, userId, input, 'user');

      // AI レスポンス生成
      const response = await apiClient.generateAIResponse(chatId, userId, [
        ...messages,
        userMessage,
      ]);

      const assistantMessage: Message = {
        messageId: `msg_${Date.now()}`,
        content: response.response,
        role: 'assistant',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'Failed to get response');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (fileName: string, fileContent: string, fileType: string) => {
    if (!chatId) return;

    try {
      const response = await apiClient.uploadFile(
        chatId,
        userId,
        fileName,
        fileContent,
        fileType
      );
      setMessages((prev) => [
        ...prev,
        {
          messageId: `file_${Date.now()}`,
          content: `📄 File uploaded: ${fileName}`,
          role: 'user',
          timestamp: Date.now(),
        },
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      console.error(err);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>AWS Blocks Chatbot</h1>
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.messageId} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
            <div className="message-time">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        {loading && <div className="message assistant loading">Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="chat-input-area">
        <FileUpload onFileUpload={handleFileUpload} />

        <form onSubmit={handleSendMessage} className="message-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
