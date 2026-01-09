'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import SignalWidget from '@/components/SignalWidget';

export default function StationPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isPhysicsUnlocked, setIsPhysicsUnlocked] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [showAccessInput, setShowAccessInput] = useState(false);
  const [showManifesto, setShowManifesto] = useState(false);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check user session and profile
  useEffect(() => {
    async function checkUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/');
        return;
      }

      setUser(user);

      // Check if Physics is unlocked
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_physics_unlocked')
        .eq('id', user.id)
        .single();

      if (profile?.is_physics_unlocked) {
        setIsPhysicsUnlocked(true);
      }

      setLoading(false);
    }

    checkUser();
  }, [router]);

  // Handle Access Code submission
  const handleAccessCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setVerifying(true);

    try {
      // Check access code client-side
      const correctCode = '1234';
      
      if (accessCode !== correctCode) {
        setError('⚠ INVALID ACCESS CODE');
        setVerifying(false);
        return;
      }
      
      // Update profile in database
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_physics_unlocked: true })
        .eq('id', user.id);
      
      if (updateError) {
        console.error('Failed to update profile:', updateError);
        setError('⚠ VERIFICATION FAILED');
        setVerifying(false);
        return;
      }
      
      // Success!
      setIsPhysicsUnlocked(true);
      setShowAccessInput(false);
      setAccessCode('');
      setVerifying(false);
      
    } catch (err) {
      console.error('Exception:', err);
      setError('⚠ VERIFICATION FAILED');
      setVerifying(false);
    }
  };

  // Handle Enter Station (Route to /study)
  const handleEnterStation = () => {
    router.push('/study');
  };

  // Current date
  const currentDate = new Date().toLocaleDateString('en-CA');

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-3 h-3 bg-[#FF358B] rounded-full shadow-[0_0_15px_#FF358B] animate-pulse mx-auto mb-4" />
          <p className="text-xs text-gray-400 tracking-widest">INITIALIZING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-gray-200 overflow-hidden">
      
      {/* Signal Widget */}
      <SignalWidget />

      {/* Moving Starfield Background with Twinkle */}
      <div className="fixed inset-0 overflow-hidden">
        {[...Array(200)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          {/* Left: Mission + Welcome */}
          <div className="flex items-center gap-2">
            {/* Pink Station Dot */}
            <button
              onClick={() => setShowManifesto(!showManifesto)}
              className="w-2 h-2 bg-[#FF358B] rounded-full shadow-[0_0_10px_#FF358B] hover:shadow-[0_0_15px_#FF358B] transition-all mr-3"
              title="DCEK Manifesto"
            />
            <h1 className="text-sm font-light tracking-widest text-white uppercase">
              SELECT YOUR MISSION
            </h1>
            <span className="text-sm font-light text-gray-500">
              // Welcome, {user?.user_metadata?.nickname || 'Traveler'}
            </span>
          </div>

          {/* Right: My Satellite | Network */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => alert('My Satellite - Coming Soon!')}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#FF358B] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              <span>My Satellite</span>
            </button>
            <span className="text-gray-600">|</span>
            <button
              onClick={() => alert('Network - Coming Soon!')}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#FF358B] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
              </svg>
              <span>Network</span>
            </button>
          </div>
        </div>

        {/* DCEK Manifesto - Slide Down */}
        {showManifesto && (
          <div className="border-t border-white/10 bg-black/60 backdrop-blur-md animate-slide-down">
            <div className="max-w-4xl mx-auto px-6 py-8">
              <h2 className="text-lg font-light tracking-widest text-[#FF358B] mb-4 uppercase">
                DCEK Manifesto
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                This is an unofficial survival guide built by a student, for students. 
                Expect typos, missing sections, and occasional chaos—use at your own risk. 
                "All models are wrong, but some are useful."
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Future subjects may be added based on demand and availability. 
                Currently in Alpha stage with Chapter 15 (Oscillations) as the starting point.
              </p>
            </div>
          </div>
        )}
      </header>

      {/* HUD - Bottom Left */}
      <div className="fixed bottom-6 left-6 z-10 text-xs text-gray-500 space-y-1 font-mono">
        <div>Project Start: 2025.11</div>
        <div>Current Date: {currentDate}</div>
        <div>Ver: Alpha 0.5</div>
        <div>Last Update: Ch.15 Oscillations</div>
      </div>

      {/* Main Content - Planetary System */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
        <div className="text-center">
          
          {/* Physics Planet */}
          <div className="relative inline-block">
            {/* Progress Ring */}
            <svg className="w-64 h-64 -rotate-90" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255, 53, 139, 0.1)"
                strokeWidth="2"
              />
              {/* Progress Arc (5%) */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#FF358B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45 * 0.05} ${2 * Math.PI * 45}`}
                className="transition-all duration-1000"
                style={{
                  filter: 'drop-shadow(0 0 8px #FF358B)',
                }}
              />
            </svg>

            {/* Planet Center */}
            <button
              onClick={() => !isPhysicsUnlocked && setShowAccessInput(!showAccessInput)}
              disabled={isPhysicsUnlocked && !showAccessInput}
              className="absolute inset-0 m-auto w-48 h-48 rounded-full bg-black/80 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center hover:border-[#FF358B]/50 transition-all group"
            >
              <h2 className="text-2xl font-light tracking-widest text-white mb-2 uppercase group-hover:text-[#FF358B] transition-colors">
                PHYSICS
              </h2>
              <p className="text-xs text-gray-400 tracking-wide">
                Halliday 12th Ed.
              </p>
              <div className={`mt-4 w-2 h-2 rounded-full ${
                isPhysicsUnlocked 
                  ? 'bg-green-500 shadow-[0_0_10px_#10b981]' 
                  : 'bg-gray-600'
              }`} />
            </button>
          </div>

          {/* Passcode Input - Below Planet */}
          {showAccessInput && !isPhysicsUnlocked && (
            <div className="mt-8 max-w-sm mx-auto animate-fade-in">
              <form onSubmit={handleAccessCodeSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 tracking-wider mb-2 uppercase">
                    ACCESS CODE
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      placeholder="Enter class password"
                      className="w-full px-4 py-3 pr-10 bg-black/60 backdrop-blur-md border border-white/20 text-gray-100 text-sm focus:outline-none focus:border-[#FF358B] transition-colors"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
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

                {error && (
                  <p className="text-xs text-[#FF358B] font-light">
                    {error}
                  </p>
                )}

                {/* Submit Button - Four Blocks */}
                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full py-6 flex items-center justify-center gap-2 disabled:opacity-50 group"
                >
                  <div className={`w-3 h-3 bg-[#FF358B] transition-all duration-300 ${
                    verifying ? 'animate-pulse' : 'group-hover:shadow-[0_0_10px_#FF358B]'
                  }`} />
                  <div className={`w-3 h-3 bg-[#FF358B] transition-all duration-300 ${
                    verifying ? 'animate-pulse' : 'group-hover:shadow-[0_0_10px_#FF358B]'
                  }`} style={{ animationDelay: '0.1s' }} />
                  <div className={`w-3 h-3 bg-[#FF358B] transition-all duration-300 ${
                    verifying ? 'animate-pulse' : 'group-hover:shadow-[0_0_10px_#FF358B]'
                  }`} style={{ animationDelay: '0.2s' }} />
                  <div className={`w-3 h-3 bg-[#FF358B] transition-all duration-300 ${
                    verifying ? 'animate-pulse' : 'group-hover:shadow-[0_0_10px_#FF358B]'
                  }`} style={{ animationDelay: '0.3s' }} />
                </button>
              </form>
            </div>
          )}

          {/* Enter Station - If Unlocked */}
          {isPhysicsUnlocked && !showAccessInput && (
            <div className="mt-8 max-w-sm mx-auto">
              <button
                onClick={handleEnterStation}
                className="w-full py-6 flex items-center justify-center gap-2 group"
              >
                <div className="w-3 h-3 bg-[#FF358B] transition-all duration-300 group-hover:shadow-[0_0_10px_#FF358B]" />
                <div className="w-3 h-3 bg-[#FF358B] transition-all duration-300 group-hover:shadow-[0_0_10px_#FF358B]" />
                <div className="w-3 h-3 bg-[#FF358B] transition-all duration-300 group-hover:shadow-[0_0_10px_#FF358B]" />
                <div className="w-3 h-3 bg-[#FF358B] transition-all duration-300 group-hover:shadow-[0_0_10px_#FF358B]" />
              </button>
            </div>
          )}

        </div>
      </main>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
