'use client';

import { useState, useEffect } from 'react';
import AuthFromWrapper from '@/component/AuthFormWrapper';
import SocialAuth from '@/component/SocialAuth';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const generateCaptcha = () => Math.random().toString(36).substring(2, 8);

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const getStrength = () => {
    if (password.length < 6) return "Lemah";
    if (password.length < 10) return "Sedang";
    return "Kuat";
  };

  return (
    <AuthFromWrapper title="Register">
      <form className="space-y-4">

        {/* INPUT BOX FIX */}
        <input placeholder="Username" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"/>
        <input placeholder="Email" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"/>
        <input placeholder="Nomor Telepon" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"/>

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm pr-10"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
            {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
          </button>
        </div>

        {/* PASSWORD STRENGTH */}
        <p className="text-sm text-gray-500">
          Kekuatan password: {getStrength()}
        </p>

        <input type="password" placeholder="Konfirmasi Password" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"/>

        {/* CAPTCHA */}
        <div>
          <div className="flex gap-2 mb-2">
            <span className="bg-gray-100 px-3 py-1 rounded font-semibold">{captcha}</span>
            <button type="button" onClick={() => setCaptcha(generateCaptcha())}>
              <RefreshCw size={16}/>
            </button>
          </div>

          <input placeholder="Masukkan captcha" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"/>

          <p className="text-center text-gray-400 text-sm mt-3">
            Atau daftar dengan
          </p>

          <SocialAuth />
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
          Register
        </button>

        <p className="text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="text-blue-600">
            Login
          </Link>
        </p>

      </form>
    </AuthFromWrapper>
  );
}