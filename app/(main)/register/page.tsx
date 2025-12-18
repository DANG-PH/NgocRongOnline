"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  realname: string;
  email: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
  realname?: string;
  email?: string;
}

function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    confirmPassword: '',
    realname: '',
    email: ''
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      // Gọi Next.js API route
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          realname: formData.realname,
          password: formData.password,
          email: formData.email
        })
      });

      const data = await response.json();

      console.log('Register response:', data);
      
      if (response.ok) {
        alert('Đăng ký thành công!');
        setFormData({
          username: '',
          password: '',
          confirmPassword: '',
          realname: '',
          email: ''
        });
        router.push("/login");
      } else {
        alert(data.error || 'Đăng ký thất bại!');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Đã xảy ra lỗi không mong đợi!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/assets/br.jpg')" }}>
      <div className="bg-white/[0.08] backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_rgba(124,58,237,0.3)] rounded-3xl p-8 w-full max-w-[420px] relative z-10  hover:shadow-[0_0_20px_rgba(16,185,129,0.4),0_0_40px_rgba(16,185,129,0.12),0_0_80px_rgba(16,185,129,0.04)] sm:p-6 sm:mx-4" style={{ transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' }}>
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-[2.5rem] sm:text-[2rem] font-extrabold bg-gradient-to-br from-emerald-500 via-cyan-500 to-violet-600 bg-clip-text text-transparent mb-2 animate-[titleGlow_3s_ease-in-out_infinite_alternate]">
            Đăng Ký
          </h2>
          <p className="text-white/80 text-base font-medium">Tạo tài khoản mới của bạn</p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-[2] pointer-events-none">
              <i className="text-xl text-white/60 transition-all duration-300">👤</i>
            </div>
            <input
              type="text"
              name="username"
              placeholder="Nhập tên đăng nhập"
              value={formData.username}
              onChange={handleInputChange}
              disabled={loading}
              required
              className={`w-full h-14 px-4 pl-12 bg-white/[0.08] border rounded-2xl text-white text-base leading-6 transition-all duration-300 box-border placeholder:text-white/50 focus:outline-none focus:border-emerald-500 focus:bg-white/[0.12] focus:shadow-[0_0_20px_rgba(16,185,129,0.3),0_0_40px_rgba(16,185,129,0.09),0_0_80px_rgba(16,185,129,0.03)] disabled:opacity-60 disabled:cursor-not-allowed ${
                errors.username 
                  ? 'border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3),0_0_40px_rgba(220,38,38,0.09),0_0_80px_rgba(220,38,38,0.03)]' 
                  : 'border-white/20'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
            {errors.username && (
              <p className="mt-2 text-red-600 text-sm font-medium" style={{ textShadow: '0 0 10px rgba(220, 38, 38, 0.5)' }}>
                {errors.username}
              </p>
            )}
          </div>

          {/* Real Name Input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-[2] pointer-events-none">
              <i className="text-xl text-white/60 transition-all duration-300">📝</i>
            </div>
            <input
              type="text"
              name="realname"
              placeholder="Nhập tên thật"
              value={formData.realname}
              onChange={handleInputChange}
              disabled={loading}
              required
              className={`w-full h-14 px-4 pl-12 bg-white/[0.08] border rounded-2xl text-white text-base leading-6 transition-all duration-300 box-border placeholder:text-white/50 focus:outline-none focus:border-emerald-500 focus:bg-white/[0.12] focus:shadow-[0_0_20px_rgba(16,185,129,0.3),0_0_40px_rgba(16,185,129,0.09),0_0_80px_rgba(16,185,129,0.03)] disabled:opacity-60 disabled:cursor-not-allowed ${
                errors.realname 
                  ? 'border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3),0_0_40px_rgba(220,38,38,0.09),0_0_80px_rgba(220,38,38,0.03)]' 
                  : 'border-white/20'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
            {errors.realname && (
              <p className="mt-2 text-red-600 text-sm font-medium" style={{ textShadow: '0 0 10px rgba(220, 38, 38, 0.5)' }}>
                {errors.realname}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-[2] pointer-events-none">
              <i className="text-xl text-white/60 transition-all duration-300">📧</i>
            </div>
            <input
              type="email"
              name="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              required
              className={`w-full h-14 px-4 pl-12 bg-white/[0.08] border rounded-2xl text-white text-base leading-6 transition-all duration-300 box-border placeholder:text-white/50 focus:outline-none focus:border-emerald-500 focus:bg-white/[0.12] focus:shadow-[0_0_20px_rgba(16,185,129,0.3),0_0_40px_rgba(16,185,129,0.09),0_0_80px_rgba(16,185,129,0.03)] disabled:opacity-60 disabled:cursor-not-allowed ${
                errors.email 
                  ? 'border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3),0_0_40px_rgba(220,38,38,0.09),0_0_80px_rgba(220,38,38,0.03)]' 
                  : 'border-white/20'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
            {errors.email && (
              <p className="mt-2 text-red-600 text-sm font-medium" style={{ textShadow: '0 0 10px rgba(220, 38, 38, 0.5)' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-[2] pointer-events-none">
              <i className="text-xl text-white/60 transition-all duration-300">🔒</i>
            </div>
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
              required
              className={`w-full h-14 px-4 pl-12 bg-white/[0.08] border rounded-2xl text-white text-base leading-6 transition-all duration-300 box-border placeholder:text-white/50 focus:outline-none focus:border-emerald-500 focus:bg-white/[0.12] focus:shadow-[0_0_20px_rgba(16,185,129,0.3),0_0_40px_rgba(16,185,129,0.09),0_0_80px_rgba(16,185,129,0.03)] disabled:opacity-60 disabled:cursor-not-allowed ${
                errors.password 
                  ? 'border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3),0_0_40px_rgba(220,38,38,0.09),0_0_80px_rgba(220,38,38,0.03)]' 
                  : 'border-white/20'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
            {errors.password && (
              <p className="mt-2 text-red-600 text-sm font-medium" style={{ textShadow: '0 0 10px rgba(220, 38, 38, 0.5)' }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-[2] pointer-events-none">
              <i className="text-xl text-white/60 transition-all duration-300">🔐</i>
            </div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={loading}
              required
              className={`w-full h-14 px-4 pl-12 bg-white/[0.08] border rounded-2xl text-white text-base leading-6 transition-all duration-300 box-border placeholder:text-white/50 focus:outline-none focus:border-emerald-500 focus:bg-white/[0.12] focus:shadow-[0_0_20px_rgba(16,185,129,0.3),0_0_40px_rgba(16,185,129,0.09),0_0_80px_rgba(16,185,129,0.03)] disabled:opacity-60 disabled:cursor-not-allowed ${
                errors.confirmPassword 
                  ? 'border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3),0_0_40px_rgba(220,38,38,0.09),0_0_80px_rgba(220,38,38,0.03)]' 
                  : 'border-white/20'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
            {errors.confirmPassword && (
              <p className="mt-2 text-red-600 text-sm font-medium" style={{ textShadow: '0 0 10px rgba(220, 38, 38, 0.5)' }}>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading} 
            className={`w-full px-4 py-4 sm:py-[14px] bg-gradient-to-br from-emerald-500 to-cyan-500 border-none rounded-2xl text-white text-[1.1rem] sm:text-base font-bold cursor-pointer flex items-center justify-center gap-2 transition-all duration-[400ms] relative overflow-hidden hover:translate-y-[-2px] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(16,185,129,0.6),0_0_40px_rgba(16,185,129,0.18),0_0_80px_rgba(16,185,129,0.06)] active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:!transform-none ${
              loading ? 'pointer-events-none' : ''
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span className="text-xl"></span>
            )}
            {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-5 text-center text-white/80 text-[0.95rem]">
          <span>Đã có tài khoản? </span>
          <button 
            onClick={() => router.push("/login")} 
            className="ml-5 bg-transparent border-none text-cyan-500 font-bold cursor-pointer underline underline-offset-4 transition-all duration-300 hover:text-emerald-500 hover:shadow-[0_0_10px_rgba(16,185,129,0.5)] hover:scale-105"
            style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            Đăng nhập ngay
          </button>
        </div>

        {/* Home Link */}
        <div className="text-center">
          <button 
            onClick={() => router.push("/")} 
            className="bg-transparent border-none text-white/60 text-sm cursor-pointer flex items-center justify-center gap-1 mx-auto px-4 py-2 rounded-xl transition-all duration-300 hover:text-white/90 hover:bg-white/5 hover:-translate-x-1"
            style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            <span className="text-base">⬅</span> Quay về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;