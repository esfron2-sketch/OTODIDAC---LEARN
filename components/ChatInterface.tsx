import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, GraduationCap, Sparkles } from 'lucide-react';
import { ChatMessage, UserSettings } from '../types';
import { createMentorChat } from '../services/geminiService';
import { GenerateContentResponse } from '@google/genai';
import ReactMarkdown from 'react-markdown';

interface Props {
  settings: UserSettings;
}

const ChatInterface: React.FC<Props> = ({ settings }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Halo! Saya Profesor AI Anda untuk mata kuliah **${settings.topic}**. Ada yang ingin didiskusikan mengenai materi ini? Silakan tanya apa saja.`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatSession = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatSession.current) {
        chatSession.current = createMentorChat(settings);
    }
  }, [settings]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      if (chatSession.current) {
        const result = await chatSession.current.sendMessageStream({ message: userMsg.text });
        
        let fullResponse = '';
        const botMsgId = (Date.now() + 1).toString();
        
        setMessages(prev => [...prev, {
            id: botMsgId,
            role: 'model',
            text: '',
            timestamp: new Date()
        }]);

        for await (const chunk of result) {
            const c = chunk as GenerateContentResponse;
            const text = c.text;
            if (text) {
                fullResponse += text;
                setMessages(prev => prev.map(msg => 
                    msg.id === botMsgId ? { ...msg, text: fullResponse } : msg
                ));
            }
        }
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Maaf, terjadi gangguan koneksi dengan server Universitas. Silakan coba lagi.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans">
        {/* Header */}
        <div className="p-4 bg-white border-b border-slate-200 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-secondary" />
            </div>
            <div>
                <h3 className="font-bold text-slate-800 text-sm">Ruang Konsultasi Dosen</h3>
                <p className="text-[10px] text-slate-500 text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Online • OT-LEARN AI
                </p>
            </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'model' && (
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Bot className="w-5 h-5 text-secondary" />
                        </div>
                    )}
                    
                    <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm
                        ${msg.role === 'user' 
                            ? 'bg-secondary text-white rounded-br-none' 
                            : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                        }
                    `}>
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>

                    {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-slate-500" />
                        </div>
                    )}
                </div>
            ))}
            {isTyping && (
                <div className="flex gap-3 justify-start animate-pulse">
                     <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="bg-slate-100 px-4 py-2 rounded-full text-slate-400 text-xs flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-secondary" />
                        Sedang mengetik...
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-200">
            <div className="flex gap-2 relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ketik pertanyaan Anda..."
                    className="flex-1 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/50 text-slate-700 text-sm pl-4"
                />
                <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="bg-secondary hover:bg-violet-700 disabled:bg-slate-300 text-white p-3 rounded-xl transition-colors shadow-lg shadow-violet-100"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    </div>
  );
};

export default ChatInterface;