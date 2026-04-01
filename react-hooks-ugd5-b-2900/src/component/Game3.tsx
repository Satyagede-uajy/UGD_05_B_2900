import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Target, ArrowLeft, Trophy } from "lucide-react";

interface Game3Props {
  onBack: () => void;
}

export default function Game3({ onBack }: Game3Props) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    if (timeLeft === 0 && !isPlaying && score > 0) {
      toast.success(`Game Over! Skor akhir anda: ${score}`);
    }
  }, [timeLeft, isPlaying, score]);

  const moveTarget = () => {
    if (!isPlaying) return;
    setScore((prev) => prev + 1);
    setTargetPos({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
    });
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setTargetPos({ x: 50, y: 50 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-purple-800/80 backdrop-blur-xl rounded-3xl p-8 w-full max-w-xl border-4 border-purple-600 shadow-2xl text-white"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-purple-200 flex items-center justify-center">
          Speed Clicker 🎯
        </h2>
        <p className="text-purple-300/80 text-sm italic">Klik target secepat mungkin sebelum waktu habis!</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-center">
        <div className="bg-black/40 rounded-xl p-3 border border-purple-500/30">
          <p className="text-xs uppercase text-purple-300">Skor</p>
          <p className="text-2xl font-bold">{score}</p>
        </div>
        <div className="bg-black/40 rounded-xl p-3 border border-purple-500/30">
          <p className="text-xs uppercase text-purple-300">Waktu</p>
          <p className="text-2xl font-bold">{timeLeft}s</p>
        </div>
      </div>

      <div className="relative h-80 bg-black/60 rounded-2xl overflow-hidden border-2 border-purple-500/20 mb-6">
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-10 p-6">
            {timeLeft === 0 && (
              <div className="mb-4 text-center">
                <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                <p className="text-xl font-bold">Waktu Habis!</p>
                <p className="text-purple-200">Skor Akhir: {score}</p>
              </div>
            )}
            <button
              onClick={startGame}
              className="bg-purple-500 hover:bg-purple-600 px-8 py-3 rounded-xl font-bold text-xl flex items-center space-x-2 shadow-xl active:scale-95 transition-all"
            >
              <span>{timeLeft === 30 ? "Mulai Game" : "Main Lagi"}</span>
            </button>
          </div>
        )}

        <AnimatePresence>
          {isPlaying && (
            <motion.button
              key="target"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={moveTarget}
              className="absolute w-12 h-12 -ml-6 -mt-6 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.6)] border-4 border-white active:scale-90 transition-transform"
            >
              <Target className="w-6 h-6 text-white" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={onBack}
        className="w-full py-3 bg-black/40 hover:bg-black/60 rounded-xl font-bold flex items-center justify-center space-x-2 transition-colors border border-white/10"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Game Selection</span>
      </button>
    </motion.div>
  );
}
