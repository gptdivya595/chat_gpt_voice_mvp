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

type Screen = "lock" | "home" | "assistant-landing" | "assistant-chat";

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
            speak("Listening");
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
          speak("Listening");
          // Auto-close listening after 4 seconds if not clicked
          setTimeout(() => setIsListening(false), 4000);
        }
      }, 8000);
      return () => clearTimeout(triggerTimer);
    }
  }, [screen, isListening]);

  const openApp = () => {
    setScreen("assistant-landing");
    setIsListening(false);
  };

  const goHome = () => {
    setScreen("home");
    setIsListening(false);
  };

  const goToAssistantChat = () => {
    setScreen("assistant-chat");
    speak("Hi, How can I help you today?");
  };

  // Auto-transition from landing → chat (stays inside assistant shell)
  useEffect(() => {
    if (screen !== "assistant-landing") return;
    const timer = setTimeout(() => {
      setScreen("assistant-chat");
      speak("Hi, How can I help you today?");
    }, 3000);
    return () => clearTimeout(timer);
  }, [screen]);

  const inAssistant = screen === "assistant-landing" || screen === "assistant-chat";

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
      {/* Mobile Device Frame */}
      <div className="relative w-[375px] h-[812px] bg-black rounded-[3rem] shadow-[0_0_0_8px_#1a1a1a,0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden border-[4px] border-zinc-800">
        
        {/* Notch — pointer-events-none so it never blocks taps */}
        <div className="pointer-events-none absolute top-0 left-1/2 z-[100] flex h-7 w-40 -translate-x-1/2 items-center justify-center rounded-b-3xl bg-black">
          <div className="h-1 w-12 rounded-full bg-zinc-900" />
        </div>

        {/* Status bar: does not capture taps — was blocking assistant header (X) */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 z-[90] h-12 px-8 flex justify-between items-center text-white text-[13px] font-semibold">
          <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-4 h-4" />
            <Wifi className="w-4 h-4" />
            <Battery className="w-5 h-5" />
          </div>
        </div>

        {/* Screen Content — lift above status bar (z-90) while assistant is open so header taps register */}
        <div
          className={`relative h-full w-full overflow-hidden bg-zinc-900 ${inAssistant ? "z-[95]" : ""}`}
        >
          
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
                className="relative z-10 flex h-full w-full flex-col px-6 pt-24"
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

            {inAssistant && (
              <motion.div
                key="assistant-shell"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 220 }}
                className="absolute inset-0 z-[95] flex flex-col bg-white"
              >
                <div className="relative min-h-0 flex-1 overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    {screen === "assistant-landing" && (
                      <motion.div
                        key="assistant-landing"
                        initial={{ opacity: 1, x: 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -28 }}
                        transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                        className="absolute inset-0 flex flex-col bg-white"
                      >
                        <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-100 px-6 pt-4">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={goHome}
                              className="-m-2 flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 hover:bg-zinc-100 active:bg-zinc-200"
                              aria-label="Close and return home"
                            >
                              <X className="h-5 w-5" />
                            </button>
                            <h1 className="text-sm font-bold tracking-tight">ChatGPT</h1>
                          </div>
                          <div className="h-7 w-7 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100">
                            <img src="https://picsum.photos/seed/user/50/50" alt="" className="h-full w-full object-cover" />
                          </div>
                        </header>

                        <div className="flex min-h-0 flex-1 flex-col items-center space-y-8 overflow-y-auto px-6 pt-12">
                          <div className="flex flex-col items-center space-y-4">
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={goToAssistantChat}
                              className="group relative flex h-32 w-32 items-center justify-center rounded-full border border-zinc-50 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
                            >
                              <div className="absolute inset-0 scale-0 rounded-full bg-zinc-100 transition-transform duration-300 group-hover:scale-100" />
                              <Mic className="relative z-10 h-10 w-10 text-zinc-900" strokeWidth={1.5} />
                            </motion.button>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Tap to speak</span>
                          </div>

                          <div className="w-full space-y-3 pb-4">
                            <ActionCard
                              icon={<ImageIcon className="h-5 w-5 text-zinc-600" />}
                              title="Create image"
                              description="Visualize any concept instantly"
                            />
                            <ActionCard
                              icon={<BookOpen className="h-5 w-5 text-zinc-600" />}
                              title="Write a story"
                              description="Generate creative narratives"
                            />
                            <ActionCard
                              icon={<FileText className="h-5 w-5 text-zinc-600" />}
                              title="Summarize text"
                              description="Condense long articles quickly"
                            />
                            <ActionCard
                              icon={<Lightbulb className="h-5 w-5 text-zinc-600" />}
                              title="Explain a concept"
                              description="Understand complex topics simply"
                            />
                          </div>
                        </div>

                        <div className="shrink-0 border-t border-zinc-100 p-4">
                          <div className="flex items-center gap-2 rounded-full bg-zinc-100 p-1.5">
                            <button type="button" className="flex h-8 w-8 items-center justify-center text-zinc-400">
                              <Plus className="h-5 w-5" />
                            </button>
                            <input
                              type="text"
                              placeholder="Message ChatGPT..."
                              className="min-w-0 flex-1 border-none bg-transparent py-1.5 text-sm focus:ring-0"
                            />
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex h-16 shrink-0 items-center justify-around border-t border-zinc-100 px-6 pb-2">
                          <MessageSquare className="h-6 w-6 text-zinc-400" />
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900">
                            <Mic className="h-5 w-5 text-white" />
                          </div>
                          <Compass className="h-6 w-6 text-zinc-400" />
                          <User className="h-6 w-6 text-zinc-400" />
                        </div>
                      </motion.div>
                    )}

                    {screen === "assistant-chat" && (
                      <motion.div
                        key="assistant-chat"
                        initial={{ opacity: 0, x: 36 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 36 }}
                        transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                        className="absolute inset-0 flex flex-col bg-white"
                      >
                        <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-100 px-6 pt-4">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={goHome}
                              className="-m-2 flex min-h-11 min-w-11 items-center justify-center rounded-full p-2 hover:bg-zinc-100 active:bg-zinc-200"
                              aria-label="Close and return home"
                            >
                              <X className="h-5 w-5" />
                            </button>
                            <h1 className="text-sm font-bold tracking-tight">ChatGPT</h1>
                          </div>
                          <div className="h-7 w-7 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100">
                            <img src="https://picsum.photos/seed/user/50/50" alt="" className="h-full w-full object-cover" />
                          </div>
                        </header>

                        <div className="flex min-h-0 flex-1 flex-col items-center justify-center space-y-10 overflow-y-auto px-6 pb-20">
                          <div className="flex flex-col items-center space-y-6 text-center">
                            <Waveform />
                            <h2 className="text-3xl font-bold leading-tight tracking-tight">Hi, How can I help you today?</h2>
                            <p className="text-sm font-medium text-zinc-500">AI Assistant is listening...</p>
                          </div>

                          <div className="w-full space-y-3">
                            <ActionCard
                              icon={<Calendar className="h-5 w-5 text-zinc-600" />}
                              title="Check my schedule"
                              description="What's on for tomorrow?"
                            />
                            <ActionCard
                              icon={<Lightbulb className="h-5 w-5 text-zinc-600" />}
                              title="Draft a brief"
                              description="For the new project"
                            />
                          </div>
                        </div>

                        <div className="shrink-0 border-t border-zinc-100 p-4 pb-8">
                          <div className="flex items-center gap-2 rounded-full bg-zinc-100 p-1.5">
                            <button type="button" className="flex h-8 w-8 items-center justify-center text-zinc-400">
                              <Plus className="h-5 w-5" />
                            </button>
                            <input
                              type="text"
                              placeholder="Message..."
                              className="min-w-0 flex-1 border-none bg-transparent py-1.5 text-sm focus:ring-0"
                            />
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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

          {/* Home indicator: only tappable on home so it does not steal taps from the assistant */}
          <div
            role={screen === "home" ? "button" : undefined}
            tabIndex={screen === "home" ? 0 : undefined}
            onClick={screen === "home" ? goHome : undefined}
            onKeyDown={
              screen === "home"
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") goHome();
                  }
                : undefined
            }
            className={`absolute bottom-2 left-1/2 z-[110] h-1.5 w-32 -translate-x-1/2 rounded-full bg-zinc-400/30 transition-colors ${
              screen === "home"
                ? "cursor-pointer hover:bg-zinc-400/50"
                : "pointer-events-none"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
