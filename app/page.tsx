'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import SignalWidget from '@/components/SignalWidget';

export default function LoginPage() {
  const router = useRouter();
  
  const [showForm, setShowForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Email validation
  const validateEmail = (email: string) => {
    // For signup, only allow @lakeheadu.ca
    // For login, allow @lakeheadu.ca and @gmail.com (admin)
    if (isSignUp) {
      if (!email.endsWith('@lakeheadu.ca')) {
        setEmailError('⚠ Lakehead University email required');
        return false;
      }
    } else {
      // Login: allow both @lakeheadu.ca and @gmail.com
      if (!email.endsWith('@lakeheadu.ca') && !email.endsWith('@gmail.com')) {
        setEmailError('⚠ Invalid email domain');
        return false;
      }
    }
    setEmailError('');
    return true;
  };

  // Password validation
  const validatePassword = () => {
    if (isSignUp && password !== confirmPassword) {
      setPasswordError('⚠ Passwords do not match');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('⚠ Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');
    
    // Validate email
    if (!validateEmail(email)) {
      return;
    }
    
    // Validate password
    if (!validatePassword()) {
      return;
    }
    
    setIsPending(true);
    
    try {
      const supabase = createClient();
      
      let result;
      if (isSignUp) {
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { nickname },
          },
        });
      } else {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }
      
      if (result.error) {
        setError(result.error.message);
        setIsPending(false);
        return;
      }
      
      if (!result.data.session) {
        setError('Session creation failed');
        setIsPending(false);
        return;
      }
      
      // Trigger transition animation
      setIsTransitioning(true);
      
      // Wait for animation to complete before redirecting
      setTimeout(() => {
        window.location.href = '/station';
      }, 1500);
      
    } catch (err: any) {
      setError('An unexpected error occurred');
      setIsPending(false);
    }
  };

  const handleDotClick = () => {
    setShowForm(!showForm);
    if (showForm) {
      // Reset form on close
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setNickname('');
      setError('');
      setEmailError('');
      setPasswordError('');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white overflow-hidden">
      
      {/* Signal Widget */}
      <SignalWidget />
      
      {/* Transition Animation Overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
          <div 
            className="w-3 h-3 bg-gray-800 rounded-full"
            style={{
              animation: 'expandToScreen 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
            }}
          />
        </div>
      )}

      {/* The Breathing Dot */}
      {!showForm && (
        <button
          onClick={handleDotClick}
          className="relative group focus:outline-none"
        >
          <div className="w-3 h-3 bg-gray-800 rounded-full animate-pulse shadow-lg hover:scale-110 transition-transform" />
        </button>
      )}

      {/* The Login/Signup Form */}
      {showForm && (
        <div className="w-full max-w-sm px-8 animate-fade-in">
          
          {/* Close Button (Dot) */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handleDotClick}
              className="w-2 h-2 bg-gray-400 rounded-full hover:bg-gray-600 transition-colors"
            />
          </div>

          {/* Form Title - Removed for Login, keep for Signup */}
          {isSignUp && (
            <h1 className="text-center text-2xl font-light tracking-[0.4em] text-gray-800 mb-8">
              CREATE SIGNAL
            </h1>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
            <div>
              <label className="block text-xs font-light text-gray-600 tracking-wide mb-2">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                onBlur={(e) => validateEmail(e.target.value)}
                placeholder="your.email@lakeheadu.ca"
                className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-gray-600 transition-colors"
                required
              />
              {emailError && (
                <p className="text-xs text-[#FF358B] font-light mt-1">
                  {emailError}
                </p>
              )}
              {isSignUp && !emailError && (
                <p className="text-xs text-gray-400 font-light mt-1">
                  Must use @lakeheadu.ca email
                </p>
              )}
            </div>

            {/* Nickname (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-light text-gray-600 tracking-wide mb-2">
                  NICKNAME
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Anonymous ID"
                  className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-gray-600 transition-colors"
                  required
                />
                <p className="text-xs text-gray-400 font-light mt-1">
                  Anonymous, but offensive names will be forcibly changed by DCEK.
                </p>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-light text-gray-600 tracking-wide mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError('');
                  }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-10 border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-gray-600 transition-colors"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-light text-gray-600 tracking-wide mb-2">
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-10 border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-gray-600 transition-colors"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Password Error */}
            {passwordError && (
              <p className="text-xs text-[#FF358B] font-light">
                {passwordError}
              </p>
            )}

            {/* General Error Message */}
            {error && (
              <p className="text-xs text-[#FF358B] font-light">
                ⚠ {error}
              </p>
            )}

            {/* Submit Button - Four Blocks */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-6 mt-4 flex items-center justify-center gap-2 disabled:opacity-50 group"
            >
              <div className={`w-3 h-3 bg-gray-800 transition-all duration-300 ${
                isPending ? 'animate-pulse' : 'group-hover:shadow-[0_0_10px_rgba(0,0,0,0.5)]'
              }`} />
              <div className={`w-3 h-3 bg-gray-800 transition-all duration-300 ${
                isPending ? 'animate-pulse' : 'group-hover:shadow-[0_0_10px_rgba(0,0,0,0.5)]'
              }`} style={{ animationDelay: '0.1s' }} />
              <div className={`w-3 h-3 bg-gray-800 transition-all duration-300 ${
                isPending ? 'animate-pulse' : 'group-hover:shadow-[0_0_10px_rgba(0,0,0,0.5)]'
              }`} style={{ animationDelay: '0.2s' }} />
              <div className={`w-3 h-3 bg-gray-800 transition-all duration-300 ${
                isPending ? 'animate-pulse' : 'group-hover:shadow-[0_0_10px_rgba(0,0,0,0.5)]'
              }`} style={{ animationDelay: '0.3s' }} />
            </button>

            {/* Toggle Sign Up / Login */}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setEmailError('');
                setPasswordError('');
                setConfirmPassword('');
              }}
              className="w-full text-xs text-gray-500 hover:text-gray-800 transition-colors font-light tracking-wide mt-6"
            >
              {isSignUp ? 'RETURN' : 'CREATE'}
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        @keyframes expandToScreen {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(200);
          }
        }
      `}</style>
    </div>
  );
}
