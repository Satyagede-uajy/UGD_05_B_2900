"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft } from "lucide-react";

export default function Page() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center max-w-sm w-full shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-red-500/20 p-4 rounded-full">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">Anda belum login</h1>
        <p className="text-white/70 mb-8">Silakan login terlebih dahulu untuk mengakses halaman ini.</p>
        
        <button
          onClick={() => router.push("/auth/login")}
          className="flex items-center justify-center space-x-2 w-full py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all active:scale-95 shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>
      </motion.div>
    </div>
  );
}
