"use client";

import { Send, Bot, User, Sparkles, Wifi } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState("");
  // 1. Pehle message ka type define karein
interface MessageProps {
  text: string;
  sender: "me" | "them";
}

// 2. Phir useState ko yeh type assign karein (Empty array ke sath)
const [chat, setChat] = useState<MessageProps[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  // Jab bhi 'chat' array mein naya message aayega, yeh automatic scroll karwayega
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]); // Here 'chat' means execute every time a new message is added

  useEffect(() => {
    //Django ka Websocket URL(Jo routing.py mein set kiya tha)
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/chat/");

    ws.onopen = () => console.log("Django se connect ho gaya!");

    ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const rawText = data.message || "";

    // Agay ka text clean karein agar koi prefix laga hai
    const cleanText = rawText.replace(/👤 Aap:|🤖 Bot:|🤖 AI:/g, "").trim();

    // FIX: Agar yeh message hamara apna hi bheja hua echo hai, toh isse 'them' mein add mat karo
    setChat((prev) => {
      // Check karein ke kya aakhri message bhi bilkul yahi tha aur 'me' ki taraf se tha
      const lastMessage = prev[prev.length - 1];
      if (lastMessage && lastMessage.text === cleanText && lastMessage.sender === "me") {
        return prev; // Kuch mat karo, list ko waise hi rehne do
      }
      // Agar naya message hai (waqai kisi aur ka hai), toh left side par dikhao
      return [...prev, { text: cleanText, sender: "them" }];
  });
};
    ws.onclose = () => console.log("Connectionband ho gaya");

    setSocket(ws);
    return () =>  ws.close();
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // FIX: inputMessage ko badal kar sirf 'message' kar diya hai
    if (socket && message.trim()) {
      // 1. Apni screen par text ko 'me' tag ke sath right side dalo
      setChat((prev) => [...prev, { text: message, sender: "me" }]);
      
      // 2. Django ko message bhejo
      socket.send(JSON.stringify({ "message": message }));
      
      // 3. Input field clear karo
      setMessage("");
    }
  };
  return (
  <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-900 to-black text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
    
    {/* Main Futuristic Container */}
    <div className="w-full max-w-4xl h-[85vh] bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
      
      {/* Background Neon Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Premium Header */}
      <div className="px-6 py-4 bg-slate-900/40 border-b border-slate-800/80 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
            <Bot size={24} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-1.5">
              Nexus Network <Sparkles size={16} className="text-purple-400" />
            </h1>
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              Secure Django Channel Connected
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50 text-xs text-slate-400">
          <Wifi size={14} className="text-emerald-400" />
          <span>Live Port: 8000</span>
        </div>
      </div>

      {/* Advance Chat Screen Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent z-10">
        {chat.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
            <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl text-slate-400 mb-2 shadow-inner">
              <Sparkles size={32} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-200">No Messages Yet</h3>
            <p className="text-sm text-slate-400 max-w-sm">
              Type a message below to send it across the Django WebSocket layer.
            </p>
          </div>
        ) : (
          chat.map((msg, index) => {
            // FIX: Ab hum direct msg.sender aur msg.text ka use karenge
            const isMe = msg.sender === "me";
            const cleanText = msg.text; // Kisi replace ya includes ki ab zarooriat nahi hai
          
            return (
              <div
                key={index}
                className={`flex items-end gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}
              >
                {/* Bot Avatar */}
                {!isMe && (
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white border border-indigo-400/20 shadow-lg flex-shrink-0">
                    <Bot size={16} />
                  </div>
                )}

                {/* Stylish Chat Bubble */}
                <div className="flex flex-col max-w-[75%] space-y-1">
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-lg text-sm leading-relaxed ${
                      isMe
                        ? "bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white rounded-br-none border border-indigo-500/30"
                        : "bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-bl-none backdrop-blur-md"
                    }`}
                  >
                    {cleanText}
                  </div>
                </div>

                {/* User Avatar */}
                {isMe && (
                  <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white border border-purple-400/20 shadow-lg flex-shrink-0">
                    <User size={16} />
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Futuristic Glassmorphic Input Form */}
      <div className="p-4 bg-slate-900/40 border-t border-slate-800/80 flex items-center gap-3 z-10 backdrop-blur-md">
        <div className="relative flex-1">
          <input
            type="text"
            value={message} // Aapka current state variable
            onChange={(e) => setMessage(e.target.value)} // Aapka current change handler
            placeholder="Write a secure message..."
            className="w-full bg-slate-950/80 text-slate-100 pl-4 pr-12 py-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-500 transition-all text-sm font-medium shadow-inner"
          />
        </div>
        <button
          onClick={sendMessage} // Aapka current click handler
          className="p-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center border border-indigo-400/20 active:scale-95"
        >
          <Send size={18} />
        </button>
      </div>

    </div>
  </div>
);
}