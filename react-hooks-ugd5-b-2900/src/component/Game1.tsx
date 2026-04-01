import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Zap, MousePointer2, ArrowLeft, Banknote, Coins, TrendingUp } from "lucide-react";

interface Game1Props {
  onBack: () => void;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  value: number;
}

export default function Game1({ onBack }: Game1Props) {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [autoClicker, setAutoClicker] = useState(0);
  const [clickUpgradeCost, setClickUpgradeCost] = useState(10);
  const [autoUpgradeCost, setAutoUpgradeCost] = useState(50);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  const expToNextLevel = Math.floor(500 * Math.pow(1.8, level - 1));

  const handleGainMoney = (amount: number, isManual: boolean = false, x: number = 0, y: number = 0) => {
    setScore(prev => prev + amount);
    
    if (isManual) {
      const id = Date.now();
      setFloatingTexts(prev => [...prev, { id, x, y, value: amount }]);
      setTimeout(() => {
        setFloatingTexts(prev => prev.filter(t => t.id !== id));
      }, 1000);
    }

    setExp(prev => {
      let newExp = prev + amount;
      if (newExp >= expToNextLevel) {
        setLevel(l => l + 1);
        toast.success(`Level Up! Sekarang Level ${level + 1}`);
        return newExp - expToNextLevel;
      }
      return newExp;
    });
  };

  useEffect(() => {
    if (autoClicker > 0) {
      const interval = setInterval(() => {
        handleGainMoney(autoClicker);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoClicker, level, expToNextLevel]);

  const handleUpgradeClick = () => {
    if (score >= clickUpgradeCost) {
      setScore(prev => prev - clickUpgradeCost);
      setExp(prev => Math.max(0, prev - clickUpgradeCost));
      setClickPower(prev => prev + (level * 5));
      setClickUpgradeCost(prev => Math.floor(prev * 1.8));
      toast.info("Upgrade Investasi Berhasil!");
    } else {
      toast.error("Modal tidak cukup!");
    }
  };

  const handleAutoClick = () => {
    if (score >= autoUpgradeCost) {
      setScore(prev => prev - autoUpgradeCost);
      setExp(prev => Math.max(0, prev - autoUpgradeCost));
      setAutoClicker(prev => prev + (level * 10));
      setAutoUpgradeCost(prev => Math.floor(prev * 2.2));
      toast.info("Manajer Otomatis Berhasil!");
    } else {
      toast.error("Modal tidak cukup!");
    }
  };

  const handleManualClick = (e: React.MouseEvent) => {
    // Get click position relative to the button or container if needed, 
    // but simple random offset around center is often better for clickers
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    handleGainMoney(clickPower, true, x, y);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-emerald-800/80 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border-4 border-emerald-600 shadow-2xl text-white"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-emerald-200 flex items-center justify-center">
          Game Ternak Uang 💰
        </h2>
        <p className="text-emerald-300/80 text-sm italic">Klik uang 💰 untuk mengumpulkan kekayaan!</p>
      </div>

      <div className="bg-black/40 rounded-2xl p-6 mb-8 text-center border border-emerald-500/30">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-bold">Modal: ${score}</span>
          <span className="text-xl font-bold">Level: {level}</span>
        </div>
        <div className="h-4 w-full bg-black/50 rounded-full overflow-hidden border border-emerald-500/20">
          <motion.div 
            animate={{ width: `${Math.min(100, (exp / expToNextLevel) * 100)}%` }}
            className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
          />
        </div>
      </div>

      <div className="flex justify-center mb-12 relative">
        <AnimatePresence>
          {floatingTexts.map(text => (
            <motion.span
              key={text.id}
              initial={{ opacity: 1, y: text.y - 50, x: text.x - 20 }}
              animate={{ opacity: 0, y: text.y - 150 }}
              exit={{ opacity: 0 }}
              className="absolute pointer-events-none text-2xl font-bold text-yellow-400 z-50 drop-shadow-md"
            >
              +${text.value}
            </motion.span>
          ))}
        </AnimatePresence>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.8 }}
          onClick={handleManualClick}
          className="text-9xl drop-shadow-[0_0_30px_rgba(52,211,153,0.5)] select-none cursor-pointer z-10"
        >
          💰
        </motion.button>
      </div>


      <div className="grid grid-cols-2 gap-4 mb-8">
        <button 
          onClick={handleUpgradeClick}
          className="bg-emerald-600 hover:bg-emerald-500 p-3 rounded-xl text-xs font-bold flex flex-col items-center justify-center shadow-lg active:scale-95"
        >
          <div className="flex items-center space-x-1 mb-1">
            <TrendingUp className="w-3 h-3" />
            <span>Upgrade Klik</span>
          </div>
          <span className="text-[10px] opacity-80">Cost: ${clickUpgradeCost}</span>
        </button>
        <button 
          onClick={handleAutoClick}
          className="bg-emerald-600 hover:bg-emerald-500 p-3 rounded-xl text-xs font-bold flex flex-col items-center justify-center shadow-lg active:scale-95"
        >
          <div className="flex items-center space-x-1 mb-1">
            <Coins className="w-3 h-3" />
            <span>Auto Klik</span>
          </div>
          <span className="text-[10px] opacity-80">Cost: ${autoUpgradeCost}</span>
        </button>
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
