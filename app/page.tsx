'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  
  const [showForm, setShowForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
    console.log(msg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDebugLog([]);
    setIsPending(true);
    
    addLog('🟢 FORM SUBMITTED');

    try {
      const supabase = createClient();
      
      if (isSignUp) {
        addLog('🟡 Creating account...');
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { nickname }
          }
        });
        
        if (error) {
          addLog(`🔴 Sign up failed: ${error.message}`);
          setError(error.message);
          setIsPending(false);
          return;
        }
        
        addLog('✅ Account created! Redirecting...');
      } else {
        addLog('🟡 Logging in...');
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          addLog(`🔴 Login failed: ${error.message}`);
          setError(error.message);
          setIsPending(false);
          return;
        }
        
        addLog(`✅ Login successful! Session: ${data.session ? 'YES' : 'NO'}`);
      }
      
      addLog('⏳ Waiting for cookies to be set...');
      // Small delay for browser to process cookies
      await new Promise(resolve => setTimeout(resolve, 500));
      
      addLog('🔄 Reloading to sync session...');
      // Reload current page - proxy will redirect authenticated users to /station
      window.location.reload();
      
    } catch (err: any) {
      addLog(`🔴 EXCEPTION: ${err.message}`);
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
      setNickname('');
      setError('');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white overflow-hidden">
      
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

          {/* Form Title */}
          <h1 className="text-center text-2xl font-light tracking-[0.4em] text-gray-800 mb-8">
            {isSignUp ? 'CREATE SIGNAL' : 'AUTHENTICATE'}
          </h1>

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
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@lakeheadu.ca"
                className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-gray-600 transition-colors"
                required
              />
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
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-light text-gray-600 tracking-wide mb-2">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-gray-600 transition-colors"
                required
                minLength={6}
              />
            </div>

            {/* Debug Log */}
            {debugLog.length > 0 && (
              <div className="text-xs bg-gray-100 p-3 rounded max-h-32 overflow-y-auto font-mono">
                {debugLog.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <p className="text-xs text-red-500 font-light animate-pulse">
                ⚠ {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 mt-2 bg-gray-800 text-white text-xs font-light tracking-[0.3em] hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {isPending ? 'PROCESSING...' : (isSignUp ? 'CREATE ACCOUNT' : 'ENTER')}
            </button>

            {/* Toggle Sign Up / Login */}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="w-full text-xs text-gray-500 hover:text-gray-800 transition-colors font-light tracking-wide mt-4"
            >
              {isSignUp ? 'Already have an account? Log In' : 'Need an account? Sign Up'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
