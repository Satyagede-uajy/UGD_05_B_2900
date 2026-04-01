'use client';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import AuthFromWrapper from '@/component/AuthFormWrapper';
import SocialAuth from '@/component/SocialAuth';
import Link from 'next/link';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';

const generateCaptcha = () => Math.random().toString(36).substring(2, 8);

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [attempts, setAttempts] = useState(3);

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const handleLogin = (e: any) => {
    e.preventDefault();

    if (attempts === 0) return;

    if (captchaInput !== captcha) {
      setAttempts(prev => prev - 1);
      alert("Captcha salah!");
      return;
    }

    localStorage.setItem("isLogin", "true");

    alert("Login berhasil!");
    router.push("/home");
  };

  return (
    <AuthFromWrapper title="Login">
      <form onSubmit={handleLogin} className="space-y-4">

       
        <input
          placeholder="Masukkan email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        />

        
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
          </button>
        </div>

        
        <div className="flex justify-between text-sm text-gray-600">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2"/>
            Ingat Saya
          </label>
          <span className="text-blue-600">Forgot Password?</span>
        </div>

        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-gray-100 px-3 py-1 rounded font-semibold">
              {captcha}
            </span>
            <button type="button" onClick={() => setCaptcha(generateCaptcha())}>
              <RefreshCw size={16}/>
            </button>
          </div>

          <input
            placeholder="Masukkan captcha"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"
          />

          
          <p className="text-center text-gray-400 text-sm mt-3">
            Atau masuk dengan
          </p>
          <SocialAuth />
        </div>

       
        <p className="text-center text-sm text-gray-500">
          Sisa kesempatan: {attempts}
        </p>

        
        <button
          type="submit"
          disabled={attempts === 0}
          className={`w-full py-3 rounded-lg text-white ${
            attempts === 0 ? "bg-gray-400" : "bg-blue-600"
          }`}
        >
          Sign In
        </button>

        
        <button
          type="button"
          onClick={() => setAttempts(3)}
          disabled={attempts !== 0}
          className={`w-full py-3 rounded-lg ${
            attempts === 0 ? "bg-green-500 text-white" : "bg-gray-300"
          }`}
        >
          Reset Kesempatan
        </button>

        
        <p className="text-center text-sm text-gray-600 mt-4">
          Tidak punya akun?{" "}
          <Link href="/auth/register" className="text-blue-600 font-medium">
            Daftar
          </Link>
        </p>

      </form>
    </AuthFromWrapper>
  );
}