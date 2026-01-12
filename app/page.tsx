'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import SignalWidget from '@/components/SignalWidget';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  
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
  const [nicknameError, setNicknameError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showForgotLink, setShowForgotLink] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  // --- 검증 로직 (실시간) ---
  const validateEmail = useCallback((val: string) => {
    if (!val) return setEmailError('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return setEmailError('Invalid email format');
    if (isSignUp && !val.endsWith('@lakeheadu.ca')) return setEmailError('Lakehead University email required');
    setEmailError('');
  }, [isSignUp]);

  const validatePassword = useCallback((val: string) => {
    if (!val) return setPasswordError('');
    if (val.length < 6) return setPasswordError('Password too short (min 6)');
    if (val.length > 20) return setPasswordError('Access key too long (max 20)');
    setPasswordError('');
  }, []);

  // --- 실시간 감시 (회원가입 모드일 때만 가동) ---
  useEffect(() => {
    if (isSignUp) {
      validateEmail(email);
      validatePassword(password);
    } else {
      setEmailError('');
      setPasswordError('');
      setError(''); // 로그인 입력 중에는 에러 초기화
      setShowForgotLink(false);
    }
  }, [email, password, isSignUp, validateEmail, validatePassword]);

  // 중복 체크 (500ms 디바운스)
  useEffect(() => {
    if (!isSignUp || !email || emailError) return;
    const timer = setTimeout(async () => {
      const { data } = await supabase.from('profiles').select('email').eq('email', email).maybeSingle();
      if (data) setEmailError('Email already registered');
    }, 500);
    return () => clearTimeout(timer);
  }, [email, isSignUp, emailError, supabase]);

  useEffect(() => {
    if (!isSignUp || !nickname || nickname.length < 2 || nickname.length > 15) {
      setNicknameError(nickname.length > 15 ? 'Nickname must be 2-15 characters' : '');
      return;
    }
    const timer = setTimeout(async () => {
      const { data } = await supabase.from('profiles').select('lower_nickname').eq('lower_nickname', nickname.toLowerCase()).maybeSingle();
      if (data) setNicknameError('Nickname already in use');
      else setNicknameError('');
    }, 500);
    return () => clearTimeout(timer);
  }, [nickname, isSignUp, supabase]);

  // 패스워드 일치 확인 (500ms 디바운스)
  useEffect(() => {
    if (!isSignUp || !password || !confirmPassword) {
      if (passwordError && passwordError.includes('match')) {
        setPasswordError('');
      }
      return;
    }
    const timer = setTimeout(() => {
      if (password !== confirmPassword) {
        setPasswordError('Passwords do not match');
      } else {
        if (passwordError && passwordError.includes('match')) {
          setPasswordError('');
        }
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [password, confirmPassword, isSignUp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && (emailError || nicknameError || passwordError)) return;

    // 로그인 검증 (보안상 상세 정보 미제공)
    if (!isSignUp && (!email || !password)) {
      return setError('Missing email or password');
    }

    setIsPending(true);
    setError('');

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setPasswordError('Passwords do not match');
          setIsPending(false);
          return;
        }
        const { data, error: authError } = await supabase.auth.signUp({ email, password, options: { data: { nickname } } });
        if (authError) throw authError;
        if (data.user) {
          await supabase.from('profiles').insert([{ id: data.user.id, nickname, lower_nickname: nickname.toLowerCase(), email }]);
        }
        setShowSuccessModal(true);
      } else {
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) {
          setError('Invalid login credentials');
          setShowForgotLink(true);
          setIsPending(false);
          return;
        }
        if (data.session) {
          // Ensure browser has fully recorded the session cookie in memory
          await supabase.auth.getSession();
          // Give browser physical time to write cookie to disk
          await new Promise(resolve => setTimeout(resolve, 500));
          setIsTransitioning(true);
          setTimeout(() => window.location.href = '/station', 1500);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsPending(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail);
    if (error) {
      setError(error.message);
    } else {
      setForgotPasswordSuccess(true);
      setError(''); // 성공 시 에러 초기화
    }
    setIsPending(false);
  };

  const handleDotClick = () => {
    setShowForm(!showForm);
    if (showForm) {
      setEmail(''); setPassword(''); setConfirmPassword(''); setNickname('');
      setError(''); setEmailError(''); setPasswordError(''); setNicknameError('');
      setIsForgotPassword(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white overflow-hidden">
      <SignalWidget variant="light" />
      {isTransitioning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
          <div className="w-3 h-3 bg-gray-800 rounded-full" style={{ animation: 'expandToScreen 1.5s forwards' }} />
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white border border-gray-300 p-8 shadow-lg text-center">
            <h2 className="text-xl font-light tracking-[0.3em] text-gray-800 mb-4 uppercase">Initialization Successful</h2>
            <p className="text-xs text-gray-600 font-light mb-6">Verification link transmitted to your email.</p>
            <button onClick={() => { setShowSuccessModal(false); setIsSignUp(false); router.push('/'); }} className="w-full py-3 border border-gray-800 text-xs font-light tracking-wide text-gray-800 hover:bg-gray-800 hover:text-white transition-colors" suppressHydrationWarning>CONFIRM</button>
          </div>
        </div>
      )}
      {!showForm ? (
        <button onClick={handleDotClick} className="relative group focus:outline-none" suppressHydrationWarning>
          <div className="w-3 h-3 bg-gray-800 rounded-full animate-pulse shadow-lg hover:scale-110 transition-transform" />
        </button>
      ) : (
        <div className="w-full max-w-sm px-8 animate-fade-in">
          <div className="flex justify-center mb-8"><button onClick={handleDotClick} className="w-2 h-2 bg-gray-400 rounded-full hover:bg-gray-600 transition-colors" suppressHydrationWarning /></div>
          <form onSubmit={isForgotPassword ? handleForgotPassword : handleSubmit} className="space-y-4" noValidate>
            {isForgotPassword ? (
              <>
                <div>
                  <label className="block text-xs font-light text-gray-600 tracking-wide mb-2 uppercase">Email</label>
                  <input type="email" value={forgotPasswordEmail} onChange={(e) => setForgotPasswordEmail(e.target.value)} placeholder="username@lakeheadu.ca" className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-800 focus:outline-none focus:border-gray-600" required suppressHydrationWarning />
                  {forgotPasswordSuccess && <p className="text-xs text-gray-500 font-light mt-2">■ Reset link transmitted to your email</p>}
                </div>
                {error && <p className="text-xs text-[#ec4899] font-light mt-2">⚠ {error}</p>}
                <button type="submit" disabled={isPending} className="w-full py-6 mt-4 flex items-center justify-center gap-2 group disabled:opacity-50" suppressHydrationWarning>
                  {isPending ? <span className="text-xs animate-pulse uppercase">Transmitting...</span> : (
                    <div className="flex gap-2">{[1,2,3,4].map(i => <div key={i} className="w-3 h-3 bg-gray-800 transition-all group-hover:shadow-[0_0_10px_rgba(0,0,0,0.5)]" />)}</div>
                  )}
                </button>
                <button type="button" onClick={() => setIsForgotPassword(false)} className="w-full text-xs text-gray-500 hover:text-gray-800 transition-colors font-light tracking-wide mt-4 uppercase text-center block" suppressHydrationWarning>Return</button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-light text-gray-600 tracking-wide mb-2 uppercase">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="username@lakeheadu.ca" className={`w-full px-4 py-3 border text-sm text-gray-800 focus:outline-none ${isSignUp && emailError ? 'border-[#ec4899]' : 'border-gray-300'}`} required suppressHydrationWarning />
                  {isSignUp && emailError && <p className="text-xs text-[#ec4899] font-light mt-1">⚠ {emailError}</p>}
                </div>
                {isSignUp && (
                  <div>
                    <label className="block text-xs font-light text-gray-600 tracking-wide mb-2 uppercase">Nickname</label>
                    <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Anonymous ID" className={`w-full px-4 py-3 border text-sm text-gray-800 focus:outline-none ${nicknameError ? 'border-[#ec4899]' : 'border-gray-300'}`} required suppressHydrationWarning />
                    <p className="text-xs font-light mt-1">{nicknameError ? <span className="text-[#ec4899]">⚠ {nicknameError}</span> : <span className="text-gray-400">Offensive names will be changed by DCEK.</span>}</p>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-light text-gray-600 tracking-wide mb-2 uppercase">Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`w-full px-4 py-3 pr-10 border text-sm text-gray-800 focus:outline-none ${isSignUp && passwordError ? 'border-[#ec4899]' : 'border-gray-300'}`} required suppressHydrationWarning />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" suppressHydrationWarning>
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
                  {isSignUp && passwordError && <p className="text-xs text-[#ec4899] font-light mt-1">⚠ {passwordError}</p>}
                </div>
                {isSignUp && (
                  <div>
                    <label className="block text-xs font-light text-gray-600 tracking-wide mb-2 uppercase">Confirm Password</label>
                    <div className="relative">
                      <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className={`w-full px-4 py-3 pr-10 border text-sm text-gray-800 focus:outline-none ${passwordError && passwordError.includes('match') ? 'border-[#ec4899]' : 'border-gray-300'}`} required suppressHydrationWarning />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" suppressHydrationWarning>
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
                    {passwordError && passwordError.includes('match') && <p className="text-xs text-[#ec4899] font-light mt-1">⚠ {passwordError}</p>}
                  </div>
                )}
                {error && <p className="text-xs text-[#ec4899] font-light mt-2">⚠ {error}</p>}
                {showForgotLink && !isSignUp && (<button type="button" onClick={() => setIsForgotPassword(true)} className="w-full text-[10px] text-gray-400 underline hover:text-gray-600 transition-colors font-light mt-2 uppercase" suppressHydrationWarning>Forgot Password?</button>)}
                <button type="submit" disabled={isPending} className="w-full py-6 mt-4 flex items-center justify-center gap-2 group" suppressHydrationWarning>
                  {isPending ? <span className="text-xs animate-pulse uppercase">Transmitting...</span> : (
                    <div className="flex gap-2">{[1,2,3,4].map(i => <div key={i} className="w-3 h-3 bg-gray-800 transition-all group-hover:shadow-[0_0_10px_rgba(0,0,0,0.5)]" />)}</div>
                  )}
                </button>
                <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="w-full text-xs text-gray-500 hover:text-gray-800 transition-colors font-light tracking-wide mt-6 uppercase" suppressHydrationWarning>{isSignUp ? 'Return' : 'Create'}</button>
              </>
            )}
          </form>
        </div>
      )}
      <style jsx>{` @keyframes expandToScreen { 0% { transform: scale(1); } 100% { transform: scale(300); } } `}</style>
    </div>
  );
}