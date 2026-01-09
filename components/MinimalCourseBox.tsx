'use client';

import { useState } from 'react';
import { verifyAccessCode } from '@/app/actions/station';
import { useRouter } from 'next/navigation';

interface MinimalCourseBoxProps {
  title: string;
  subtitle: string;
}

export default function MinimalCourseBox({ title, subtitle }: MinimalCourseBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  // Auto-Landing: Check for existing auth cookie
  const checkAuth = async () => {
    try {
      const response = await fetch('/study/check-auth');
      if (response.ok) {
        // Valid cookie exists, trigger warp and redirect
        console.log('🚀 Auto-Landing: Valid cookie detected');
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/study');
        }, 1500);
      }
    } catch (error) {
      // No valid cookie, stay on portal
      console.log('No valid auth cookie', error);
    }
  };

  const handleSingularityClick = async () => {
    if (!isOpen) {
      // First click: check for auto-landing
      await checkAuth();
      // If still here, open the form
      setTimeout(() => setIsOpen(true), 100);
    } else {
      // Close the form
      setIsOpen(false);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Step 1: Start verification
    console.log('📡 Form submitted - starting verification...');
    setIsPending(true);
    setError('');
    setShake(false);
    
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    
    // Step 2: Call Server Action
    const result = await verifyAccessCode(password);
    
    console.log('📬 Server response:', result);
    setIsPending(false);
    
    // Step 3-A: Authentication FAILED
    if (!result.success) {
      console.log('❌ Login failed - showing error');
      setError(result.error || 'Access Denied: Invalid Frequency');
      setShake(true);
      
      // Stop shake after 500ms
      setTimeout(() => setShake(false), 500);
      return;
    }
    
    // Step 4: Authentication SUCCESS → Trigger WARP
    console.log('✅ Login successful! Initiating warp sequence...');
    setIsSuccess(true);
    
    // Wait for warp animation to complete (1.5s), then navigate
    setTimeout(() => {
      console.log('🌌 Warp complete! Navigating to /study');
      router.push('/study');
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center touch-manipulation relative min-h-[550px]">
      {/* State 4: WARP - Full Screen Expansion */}
      {isSuccess && (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
          <div 
            className="absolute w-6 h-6 rounded-full border-2 border-lca-pink bg-transparent animate-warp-expand shadow-[0_0_100px_50px_rgba(255,53,139,0.9)]"
          />
        </div>
      )}

      {/* State 1, 2, 3: The Singularity Point */}
      <div className="relative">
        <button
          onClick={handleSingularityClick}
          disabled={isSuccess}
          className={`
            rounded-full transition-all ease-in-out touch-manipulation relative
            ${isOpen 
              ? /* State 3: Selected - Pink Ring */ 'w-6 h-6 bg-transparent border-2 border-lca-pink shadow-[0_0_25px_rgba(255,53,139,0.5)] duration-1000' 
              : /* State 1: Idle - Gray Dot */ 'w-2 h-2 bg-gray-500 border-0 hover:scale-150 duration-700'
            }
            ${isSuccess ? 'opacity-0' : 'opacity-100'}
          `}
          aria-label="Access portal"
        />
      </div>

      {/* Course Label & Form Container - Absolute positioning to prevent layout shift */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
        {/* Course Label (appears when open) */}
        {isOpen && (
          <div className="text-center animate-fade-in mb-8">
            <div className="text-base sm:text-lg font-extralight tracking-[0.25em] text-lca-pink mb-2">
              {title}
            </div>
            <div className="text-xs sm:text-sm font-extralight tracking-widest text-gray-400">
              {subtitle}
            </div>
          </div>
        )}

        {/* Login Form */}
        {isOpen && (
          <div className="w-full animate-fade-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password Input */}
              <div className={`relative ${shake ? 'animate-shake' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="access code"
                  className={`w-full bg-transparent border-0 border-b text-sm font-light tracking-wide text-black placeholder-gray-400 focus:outline-none pb-2 transition-colors duration-500 ${
                    error ? 'border-lca-pink' : 'border-gray-300 focus:border-lca-pink'
                  }`}
                  required
                  disabled={isPending || isSuccess}
                  autoFocus
                />
                
                {/* Show/Hide Password Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-2 text-gray-400 hover:text-lca-pink transition-colors duration-500"
                  aria-label="Toggle password visibility"
                  disabled={isSuccess}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Error Message Area - Fixed height to prevent layout shift */}
              <div className="min-h-[24px]">
                {error && (
                  <div className="text-sm font-light tracking-wide text-lca-pink animate-fade-in text-center">
                    {error}
                  </div>
                )}
              </div>


              {/* Submit Button - MUST be type="submit" */}
              <button
                type="submit"
                disabled={isPending || isSuccess}
                className="w-full border border-gray-400 py-3 text-sm font-extralight tracking-[0.3em] hover:bg-lca-pink hover:text-white hover:border-lca-pink hover:shadow-[0_0_25px_rgba(255,53,139,0.5)] transition-all duration-700 disabled:opacity-50 disabled:cursor-not-allowed uppercase ease-in-out"
              >
                {isSuccess ? '◉ Warping ◉' : isPending ? '◉ Verifying ◉' : 'Landing'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
