'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function StationPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isPhysicsUnlocked, setIsPhysicsUnlocked] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [showAccessInput, setShowAccessInput] = useState(false);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);

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
    <div className="relative min-h-screen bg-black text-gray-200 overflow-hidden flex items-center justify-center px-6">
      
      {/* Moving Starfield Background */}
      <div className="fixed inset-0 overflow-hidden">
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 border-2 border-[#FF358B] rounded-full">
            <div className="w-4 h-4 bg-[#FF358B] rounded-full shadow-[0_0_20px_#FF358B] animate-pulse" />
          </div>
          
          <h1 className="text-4xl font-light tracking-[0.5em] text-white mb-4">
            THE STATION
          </h1>
          
          <p className="text-sm text-gray-400 tracking-wider">
            SELECT YOUR MISSION
          </p>
        </div>

        {/* Physics II Card */}
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-light text-gray-100 mb-2">
                Physics II
              </h2>
              <p className="text-xs text-gray-400 tracking-wide">
                Halliday 12th Edition • Chapters 15-34
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              isPhysicsUnlocked 
                ? 'bg-green-500 shadow-[0_0_10px_#10b981]' 
                : 'bg-gray-600'
            }`} />
          </div>

          {/* If Physics is unlocked, show Enter button */}
          {isPhysicsUnlocked ? (
            <button
              onClick={handleEnterStation}
              className="w-full py-3 bg-[#FF358B] text-white text-sm font-light tracking-[0.3em] hover:bg-[#E62E7B] transition-all duration-300"
            >
              ENTER STATION
            </button>
          ) : (
            <>
              {/* If not unlocked, show Access Code input option */}
              {!showAccessInput ? (
                <button
                  onClick={() => setShowAccessInput(true)}
                  className="w-full py-3 border border-white/20 text-gray-300 text-sm font-light tracking-[0.3em] hover:border-[#FF358B] hover:text-white transition-all duration-300"
                >
                  REQUEST ACCESS
                </button>
              ) : (
                <form onSubmit={handleAccessCodeSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 tracking-wider mb-2">
                      ACCESS CODE
                    </label>
                    <input
                      type="text"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      placeholder="Enter class password"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-gray-100 text-sm focus:outline-none focus:border-[#FF358B] transition-colors"
                      required
                      autoFocus
                    />
                  </div>

                  {error && (
                    <p className="text-[#FF358B] text-xs tracking-wide animate-pulse">
                      {error}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={verifying}
                      className="flex-1 py-3 bg-[#FF358B] text-white text-sm font-light tracking-[0.3em] hover:bg-[#E62E7B] transition-all duration-300 disabled:opacity-50"
                    >
                      {verifying ? 'VERIFYING...' : 'VERIFY'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAccessInput(false);
                        setAccessCode('');
                        setError('');
                      }}
                      className="flex-1 py-3 border border-white/20 text-gray-300 text-sm font-light tracking-[0.3em] hover:border-[#FF358B] hover:text-white transition-all duration-300"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>

        {/* Info Text */}
        <div className="text-center">
          <p className="text-xs text-gray-500 font-light tracking-wide">
            Welcome, <span className="text-gray-400">{user?.user_metadata?.nickname || user?.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
