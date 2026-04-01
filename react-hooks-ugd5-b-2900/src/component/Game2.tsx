import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Play, ArrowLeft, Rocket } from "lucide-react";

interface Game2Props {
  onBack: () => void;
}

interface Bullet {
  id: number;
  x: number;
  y: number;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  speed: number;
  vx: number;
  health: number;
  maxHealth: number;
}

export default function Game2({ onBack }: Game2Props) {
  const [health, setHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 90 });
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const lastShotTime = useRef(0);
  const gameStartTime = useRef(0);

  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = setInterval(() => {
      const now = Date.now();
      const elapsedTime = now - gameStartTime.current;
      const currentMaxHealth = 20 + Math.floor(elapsedTime / 4000) * 2; // Increases by 2 every 4 seconds

      // Move enemies
      setEnemies(prev => {
        const newEnemies = prev.map(e => ({
          ...e,
          x: e.x + e.vx,
          y: e.y + e.speed,
        })).filter(e => e.y < 105);

        // Spawn new enemies
        if (Math.random() > 0.92) {
          const spawnX = Math.random() * 90 + 5;
          const targetX = playerPos.x;
          const speed = 0.8 + Math.random() * 2.0;
          const dy = playerPos.y - (-5);
          const dx = targetX - spawnX;
          const vx = (dx / dy) * speed;

          newEnemies.push({ 
            id: now + Math.random(), 
            x: spawnX, 
            y: -5,
            speed: speed,
            vx: vx,
            health: currentMaxHealth,
            maxHealth: currentMaxHealth
          });
        }

        // Collision with player
        newEnemies.forEach(e => {
          const dist = Math.sqrt(Math.pow(e.x - playerPos.x, 2) + Math.pow(e.y - playerPos.y, 2));
          if (dist < 7) {
            setHealth(h => {
              const newH = Math.max(0, h - 10);
              if (newH === 0 && isPlaying) {
                setIsPlaying(false);
                toast.error(`Game Over! Skor anda: ${score}`);
              }
              return newH;
            });
          }
        });

        return newEnemies;
      });

      // Move bullets and check collisions
      setBullets(prevBullets => {
        const nextBullets = prevBullets.map(b => ({
          ...b,
          y: b.y - 6
        })).filter(b => b.y > -5);

        // Check collisions
        setEnemies(currentEnemies => {
          return currentEnemies.map(e => {
            let newHealth = e.health;
            const hitIndex = nextBullets.findIndex(b => {
              const dist = Math.sqrt(Math.pow(e.x - b.x, 2) + Math.pow(e.y - b.y, 2));
              return dist < 6;
            });

            if (hitIndex !== -1) {
              newHealth -= 20; // Base damage
              nextBullets.splice(hitIndex, 1); // Consume bullet
              if (newHealth <= 0) {
                setScore(s => s + 10);
              }
            }
            return { ...e, health: newHealth };
          }).filter(e => e.health > 0);
        });

        return nextBullets;
      });

      // Auto shooting
      if (now - lastShotTime.current > 150) {
        setBullets(prev => [...prev, { id: now, x: playerPos.x, y: playerPos.y - 7 }]);
        lastShotTime.current = now;
      }

    }, 25);

    return () => clearInterval(gameLoop);
  }, [isPlaying, playerPos, score]);

  useEffect(() => {
    if (!isPlaying || !gameAreaRef.current) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!gameAreaRef.current) return;
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setPlayerPos({ 
        x: Math.max(5, Math.min(95, x)), 
        y: Math.max(5, Math.min(95, y)) 
      });
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, [isPlaying]);

  const startGame = () => {
    setHealth(100);
    setScore(0);
    setEnemies([]);
    setBullets([]);
    gameStartTime.current = Date.now();
    setIsPlaying(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-indigo-900/80 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl border-4 border-indigo-600 shadow-2xl text-white"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-200 flex items-center justify-center">
          Spaceship Strike 🛸
        </h2>
        <p className="text-indigo-300/80 text-sm italic">Gunakan mouse untuk menggerakkan Pesawat 🛸 dan tembak Alien 👾 dengan Laser 🔴!</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-black/40 rounded-xl p-3 border border-indigo-500/30">
          <div className="flex justify-between text-xs mb-1">
            <span>Health: {health}%</span>
          </div>
          <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${health}%` }} className={`h-full ${health > 30 ? 'bg-cyan-500' : 'bg-red-500'}`} />
          </div>
        </div>
        <div className="bg-black/40 rounded-xl p-3 border border-indigo-500/30 flex flex-col justify-center items-center">
          <p className="text-xs uppercase text-indigo-300">Skor</p>
          <p className="text-xl font-bold">{score}</p>
        </div>
      </div>

      <div 
        ref={gameAreaRef}
        className="relative h-96 bg-black/60 rounded-2xl overflow-hidden border-2 border-indigo-500/20 cursor-none mb-6"
        style={{ backgroundImage: 'radial-gradient(circle, #312e81 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      >
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <button 
              onClick={startGame}
              className="bg-indigo-500 hover:bg-indigo-600 px-8 py-3 rounded-xl font-bold text-xl flex items-center space-x-2 shadow-xl active:scale-95 transition-all"
            >
              <Rocket className="w-6 h-6" />
              <span>{health <= 0 ? "Main Lagi" : "Mulai Permainan"}</span>
            </button>
            <p className="mt-4 text-indigo-200/60 text-sm">Gerakkan mouse untuk mengontrol</p>
          </div>
        )}

        {/* Player */}
        <motion.div 
          animate={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
          transition={{ type: "tween", ease: "linear", duration: 0 }}
          className="absolute w-12 h-12 -ml-6 -mt-6 flex items-center justify-center text-4xl z-20 pointer-events-none"
        >
          🛸
        </motion.div>

        {/* Bullets */}
        {bullets.map(bullet => (
          <div 
            key={bullet.id}
            className="absolute w-1 h-6 bg-red-500 shadow-[0_0_10px_#ff0000] rounded-full -ml-0.5 -mt-3 z-10"
            style={{ left: `${bullet.x}%`, top: `${bullet.y}%` }}
          />
        ))}

        {/* Enemies */}
        {enemies.map(enemy => (
          <div 
            key={enemy.id}
            className="absolute w-10 h-10 -ml-5 -mt-5 flex flex-col items-center justify-center pointer-events-none"
            style={{ left: `${enemy.x}%`, top: `${enemy.y}%` }}
          >
            {/* Alien Health Bar */}
            <div className="w-8 h-1 bg-gray-800 rounded-full mb-1 overflow-hidden border border-white/10">
              <div 
                className="h-full bg-red-500 transition-all duration-100" 
                style={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
              />
            </div>
            <span className="text-3xl">👾</span>
          </div>
        ))}
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
