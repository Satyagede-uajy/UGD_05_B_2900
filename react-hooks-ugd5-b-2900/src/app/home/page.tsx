"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Game1 from "../../component/Game1";
import Game2 from "../../component/Game2";
import Game3 from "../../component/Game3";

export default function Page() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedGame, setSelectedGame] = useState<"none" | "money" | "strike" | "clicker">("none");

  useEffect(() => {
    
    const loggedIn = localStorage.getItem("isLogin") === "true";

    if (!loggedIn) {
      router.push("/auth/belum-login");
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  const handleLogout = () => {
    
    localStorage.removeItem("isLogin");
    toast.success("Logout Berhasil!");
    router.push("/auth/login");
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans text-white">
      <AnimatePresence mode="wait">
        {selectedGame === "none" ? (
          <motion.div 
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center w-full max-w-3xl"
          >
            <div className="flex justify-center mb-8">
              <button 
                onClick={handleLogout}
                className="bg-red-500 p-3 rounded-full hover:bg-red-600 transition-colors shadow-lg active:scale-95"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>

            <h1 className="text-5xl font-bold mb-12 drop-shadow-lg">
              Selamat Datang!
            </h1>
            
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-12 border border-white/10 shadow-2xl">
              <h2 className="text-3xl font-bold mb-8">Pilih Permainan</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <button 
                  onClick={() => setSelectedGame("money")}
                  className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-6 rounded-2xl flex flex-col items-center space-y-3 hover:scale-105 transition-transform shadow-xl group"
                >
                  <div className="text-4xl group-hover:animate-bounce">💰</div>
                  <span className="text-xl font-bold flex items-center">
                    Ternak Uang <Zap className="w-4 h-4 ml-2" />
                  </span>
                </button>

                <button 
                  onClick={() => setSelectedGame("strike")}
                  className="bg-gradient-to-br from-indigo-400 to-indigo-600 p-6 rounded-2xl flex flex-col items-center space-y-3 hover:scale-105 transition-transform shadow-xl group"
                >
                  <div className="text-4xl group-hover:animate-pulse">🛸</div>
                  <span className="text-xl font-bold">
                    Spaceship Strike
                  </span>
                </button>

                <button 
                  onClick={() => setSelectedGame("clicker")}
                  className="bg-gradient-to-br from-purple-400 to-purple-600 p-6 rounded-2xl flex flex-col items-center space-y-3 hover:scale-105 transition-transform shadow-xl group"
                >
                  <div className="text-4xl group-hover:rotate-12">🎯</div>
                  <span className="text-xl font-bold">
                    Speed Clicker
                  </span>
                </button>
              </div>
              
              <p className="mt-8 text-white/60 italic text-sm">
                Pilih salah satu untuk mulai bermain!
              </p>
            </div>
          </motion.div>
        ) : selectedGame === "money" ? (
          <Game1 onBack={() => setSelectedGame("none")} />
        ) : selectedGame === "strike" ? (
          <Game2 onBack={() => setSelectedGame("none")} />
        ) : (
          <Game3 onBack={() => setSelectedGame("none")} />
        )}
      </AnimatePresence>
    </div>
  );
}