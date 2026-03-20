/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode, useRef } from "react";
import { 
  Mic, 
  Menu, 
  Image as ImageIcon, 
  BookOpen, 
  FileText, 
  Lightbulb, 
  Plus, 
  ArrowUp, 
  MessageSquare, 
  Compass, 
  User,
  X,
  Mail,
  Calendar,
  Map,
  Settings,
  Music,
  Folder,
  Terminal,
  Wifi,
  Battery,
  Signal
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- Types ---

type Screen = "lock" | "home" | "app";

interface ActionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

interface AppIconProps {
  icon: ReactNode;
  label: string;
  color: string;
  onClick?: () => void;
  isChatGPT?: boolean;
}

// --- Components ---

const AppIcon = ({ icon, label, color, onClick, isChatGPT }: AppIconProps) => (
  <motion.div 
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="flex flex-col items-center gap-1.5 cursor-pointer group"
  >
    <div className={`w-16 h-16 ${color} rounded-[1.5rem] flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 relative`}>
      {icon}
      {isChatGPT && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />
      )}
    </div>
    <span className="text-[11px] font-medium text-white drop-shadow-md">{label}</span>
  </motion.div>
);

const ActionCard = ({ icon, title, description }: ActionCardProps) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="flex items-center gap-4 p-4 bg-white/60 hover:bg-white/80 backdrop-blur-md transition-colors rounded-2xl text-left border border-white/20 group w-full"
  >
    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-zinc-900 font-semibold text-[14px]">{title}</span>
      <span className="text-zinc-500 text-[12px]">{description}</span>
    </div>
  </motion.button>
);

const Waveform = () => (
  <div className="flex items-center gap-1.5 h-12">
    {[...Array(9)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ height: 4 }}
        animate={{ 
          height: [4, 16, 32, 24, 12, 28, 8, 36, 4][i % 9],
          opacity: [0.3, 0.6, 1, 0.8, 0.4, 0.9, 0.5, 1, 0.3][i % 9]
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.1
        }}
        className="w-1 bg-zinc-900 rounded-full"
      />
    ))}
  </div>
);

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [isListening, setIsListening] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Speak function
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speech Recognition for "Hey ChatGPT" wake word
  useEffect(() => {
    if (screen === "home") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('')
            .toLowerCase();

          if (transcript.includes("hey chatgpt") || transcript.includes("hey chat gpt")) {
            setIsListening(true);
            recognition.stop();
            // Auto-open app after a brief listening period
            setTimeout(() => {
              openApp();
            }, 2000);
          }
        };

        recognition.start();
        return () => recognition.stop();
      }
    }
  }, [screen]);

  // Simulate "Hey ChatGPT" trigger as a fallback or for demo
  useEffect(() => {
    if (screen === "home") {
      const triggerTimer = setTimeout(() => {
        if (!isListening) {
          setIsListening(true);
          // Auto-close listening after 4 seconds if not clicked
          setTimeout(() => setIsListening(false), 4000);
        }
      }, 8000);
      return () => clearTimeout(triggerTimer);
    }
  }, [screen, isListening]);

  const openApp = () => {
    setScreen("app");
    setIsListening(false);
    // Speak greeting when app opens
    setTimeout(() => {
      speak("Hi, How can I help you today?");
    }, 500);
  };

  const goHome = () => setScreen("home");

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
      {/* Mobile Device Frame */}
      <div className="relative w-[375px] h-[812px] bg-black rounded-[3rem] shadow-[0_0_0_8px_#1a1a1a,0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden border-[4px] border-zinc-800">
        
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-[100] flex items-center justify-center">
          <div className="w-12 h-1 bg-zinc-900 rounded-full" />
        </div>

        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-12 px-8 flex justify-between items-center z-[90] text-white text-[13px] font-semibold">
          <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-4 h-4" />
            <Wifi className="w-4 h-4" />
            <Battery className="w-5 h-5" />
          </div>
        </div>

        {/* Screen Content */}
        <div className="relative w-full h-full bg-zinc-900 overflow-hidden">
          
          {/* Wallpaper (Shared across Home/Lock) */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://picsum.photos/seed/abstract/800/1200" 
              alt="Wallpaper" 
              className="w-full h-full object-cover opacity-60 scale-110 blur-[2px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
          </div>

          <AnimatePresence mode="wait">
            {screen === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative z-10 w-full h-full flex flex-col px-6 pt-24"
              >
                {/* Date/Time Header */}
                <div className="mb-10 px-2">
                  <h2 className="text-5xl font-bold text-white tracking-tighter">
                    {currentTime.toLocaleDateString([], { weekday: 'long' })}
                  </h2>
                  <p className="text-white/70 font-medium text-lg">
                    {currentTime.toLocaleDateString([], { month: 'long', day: 'numeric' })}
                  </p>
                </div>

                {/* App Grid */}
                <div className="grid grid-cols-4 gap-y-8 gap-x-4">
                  <AppIcon icon={<Mail className="text-blue-600" />} label="Mail" color="bg-blue-50" />
                  <AppIcon icon={<Calendar className="text-red-500" />} label="Calendar" color="bg-white" />
                  <AppIcon icon={<Map className="text-green-600" />} label="Maps" color="bg-green-50" />
                  <AppIcon 
                    icon={
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" 
                        alt="ChatGPT" 
                        className="w-10 h-10"
                        referrerPolicy="no-referrer"
                      />
                    } 
                    label="ChatGPT" 
                    color="bg-white" 
                    isChatGPT 
                    onClick={openApp}
                  />
                  <AppIcon icon={<Music className="text-white" />} label="Music" color="bg-rose-500" />
                  <AppIcon icon={<Folder className="text-amber-600" />} label="Files" color="bg-amber-50" />
                  <AppIcon icon={<Terminal className="text-cyan-400" />} label="Code" color="bg-zinc-800" />
                  <AppIcon icon={<Settings className="text-zinc-600" />} label="Settings" color="bg-zinc-200" />
                </div>

                {/* Voice Guide Hint */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="mt-12 flex flex-col items-center gap-3"
                >
                  <div className="px-4 py-2 bg-white/30 backdrop-blur-xl rounded-full border border-white/20 shadow-sm">
                    <p className="text-[11px] font-bold text-white uppercase tracking-[0.15em] drop-shadow-sm">
                      Try saying "Hey ChatGPT"
                    </p>
                  </div>
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-1.5 h-1.5 bg-white rounded-full shadow-lg"
                  />
                </motion.div>

                {/* Dock */}
                <div className="absolute bottom-8 left-6 right-6 h-20 bg-white/20 backdrop-blur-2xl rounded-[2.5rem] flex items-center justify-around px-4 border border-white/10">
                  <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg"><MessageSquare className="text-white w-6 h-6" /></div>
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg"><Compass className="text-blue-500 w-6 h-6" /></div>
                  <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center shadow-lg"><User className="text-zinc-600 w-6 h-6" /></div>
                </div>
              </motion.div>
            )}

            {screen === "app" && (
              <motion.div
                key="app"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative z-20 w-full h-full bg-white flex flex-col"
              >
                {/* App Header */}
                <header className="flex justify-between items-center px-6 h-16 border-b border-zinc-100 pt-4">
                  <div className="flex items-center gap-3">
                    <button onClick={goHome} className="p-1 hover:bg-zinc-100 rounded-full"><X className="w-5 h-5" /></button>
                    <h1 className="text-sm font-bold tracking-tight">ChatGPT</h1>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200">
                    <img src="https://picsum.photos/seed/user/50/50" alt="User" className="w-full h-full object-cover" />
                  </div>
                </header>

                {/* App Content */}
                <div className="flex-grow flex flex-col items-center justify-center px-6 space-y-10 pb-20">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <Waveform />
                    <h2 className="text-3xl font-bold tracking-tight leading-tight">
                      Hi, How can I help you today?
                    </h2>
                    <p className="text-zinc-500 text-sm font-medium">AI Assistant is listening...</p>
                  </div>

                  <div className="w-full space-y-3">
                    <ActionCard 
                      icon={<Calendar className="w-5 h-5 text-zinc-600" />} 
                      title="Check my schedule" 
                      description="What's on for tomorrow?" 
                    />
                    <ActionCard 
                      icon={<Lightbulb className="w-5 h-5 text-zinc-600" />} 
                      title="Draft a brief" 
                      description="For the new project" 
                    />
                  </div>
                </div>

                {/* App Bottom Bar */}
                <div className="p-4 pb-8 border-t border-zinc-100">
                  <div className="bg-zinc-100 rounded-full p-1.5 flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center text-zinc-400"><Plus className="w-5 h-5" /></button>
                    <input 
                      type="text" 
                      placeholder="Message..." 
                      className="flex-grow bg-transparent border-none focus:ring-0 text-sm py-1.5"
                    />
                    <button className="w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center"><ArrowUp className="w-4 h-4" /></button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* "Hey ChatGPT" Overlay (Toast) */}
          <AnimatePresence>
            {isListening && screen === "home" && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="absolute bottom-32 left-6 right-6 z-[100]"
              >
                <div 
                  onClick={openApp}
                  className="bg-white/80 backdrop-blur-3xl px-5 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-white/40 cursor-pointer active:scale-95 transition-transform"
                >
                  <div className="flex gap-1 items-center h-4">
                    <motion.div animate={{ height: [6, 12, 6] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-zinc-900 rounded-full" />
                    <motion.div animate={{ height: [10, 20, 10] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-1 bg-zinc-900 rounded-full" />
                    <motion.div animate={{ height: [14, 28, 14] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-1 bg-zinc-900 rounded-full" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Listening</span>
                    <span className="text-sm font-bold text-zinc-900">"Hey ChatGPT"</span>
                  </div>
                  <div className="ml-auto w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" 
                      alt="ChatGPT" 
                      className="w-6 h-6 invert"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Home Indicator */}
          <div 
            onClick={goHome}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-zinc-400/30 rounded-full z-[110] cursor-pointer hover:bg-zinc-400/50 transition-colors" 
          />
        </div>
      </div>
    </div>
  );
}
