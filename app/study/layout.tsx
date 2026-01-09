'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { physicsData } from '@/data/physicsData';
import { logout } from '@/app/actions/auth';

export default function StudyLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [footerFormExpanded, setFooterFormExpanded] = useState(false);
  const [emailForm, setEmailForm] = useState({ email: '', message: '' });
  const [footerForm, setFooterForm] = useState({ email: '', content: '' });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // 로그아웃 핸들러
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await logout();
      
      if (result.success) {
        router.push('/');
      } else {
        console.error('Logout failed:', result.error);
        alert(`로그아웃 실패: ${result.error}\n다시 시도해주세요.`);
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error('Unexpected logout error:', error);
      alert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsLoggingOut(false);
    }
  };

  // 이메일 전송 핸들러
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Feedback sent:', emailForm);
    alert('Signal transmitted successfully!');
    setShowEmailForm(false);
    setEmailForm({ email: '', message: '' });
  };

  // 푸터 폼 제출 핸들러
  const handleFooterFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Footer form data:', footerForm);
    alert('Signal transmitted successfully!');
    setFooterForm({ email: '', content: '' });
    setFooterFormExpanded(false);
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-black text-gray-200 overflow-hidden">
      
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

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-screen w-72 bg-black/60 backdrop-blur-md border-r border-white/10 z-50 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pb-safe">
          
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-white/10 z-50">
            <button 
              onClick={() => window.location.reload()} 
              className="block w-full text-left"
            >
              <h1 className="text-xl font-light tracking-[0.4em] text-white hover:text-[#FF358B] transition-colors">
                V O I D
              </h1>
            </button>
            <Link 
              href="/station" 
              className="mt-2 text-[10px] text-gray-400 tracking-wider hover:text-[#FF358B] transition-colors inline-block"
              onClick={() => setSidebarOpen(false)}
            >
              SPACE PLAN
            </Link>
          </div>

          {/* System Status */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <h2 className="text-xs font-light tracking-widest text-gray-400 mb-3">
                SYSTEM STATUS
              </h2>
            </div>

            {/* Chapter List */}
            <nav className="space-y-1">
              {physicsData.map((chapter) => {
                const isActive = pathname === `/study/${chapter.id}`;
                return (
                  <Link
                    key={chapter.id}
                    href={`/study/${chapter.id}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded text-xs font-light tracking-wide transition-all duration-200 ${
                      isActive
                        ? 'bg-[#FF358B]/20 text-[#FF358B] border-l-2 border-[#FF358B]'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-[#FF358B] shadow-[0_0_8px_#FF358B]' : 'bg-gray-600'
                    }`} />
                    <span className="flex-1">{chapter.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer - Formula Sheet & Signal & Logout */}
          <div className="border-t border-white/10 pb-20 md:pb-6">
            <Link 
              href="/study/formulas"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2 px-6 py-4 text-xs text-gray-300 hover:text-[#FF358B] transition-colors border-b border-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Formula Cheat Sheet
            </Link>

            {/* Signal Button */}
            <button
              onClick={() => setShowEmailForm(!showEmailForm)}
              className="flex items-center gap-2 w-full px-6 py-4 text-xs text-gray-300 hover:text-[#FF358B] transition-colors border-b border-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
              </svg>
              Transmit Signal
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 w-full px-6 py-4 text-xs text-gray-500 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exiting...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  Exit Station
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-6 left-6 z-50 lg:hidden p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded text-white hover:text-[#FF358B] transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Top-Right User Menu */}
      <div className="fixed top-6 right-6 z-40 flex items-center gap-3">
        {/* My Satellite */}
        <button
          onClick={() => alert('My Satellite - Coming Soon!')}
          className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded text-xs text-gray-300 hover:text-[#FF358B] hover:border-[#FF358B]/50 transition-all"
          title="My Satellite"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          <span className="hidden sm:inline">My Satellite</span>
        </button>

        {/* Network */}
        <button
          onClick={() => alert('Network - Coming Soon!')}
          className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded text-xs text-gray-300 hover:text-[#FF358B] hover:border-[#FF358B]/50 transition-all"
          title="Network"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
          </svg>
          <span className="hidden sm:inline">Network</span>
        </button>

        {/* Bookmoon */}
        <button
          onClick={() => alert('Bookmoon - Coming Soon!')}
          className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded text-xs text-gray-300 hover:text-[#FF358B] hover:border-[#FF358B]/50 transition-all"
          title="Bookmoon"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
          </svg>
          <span className="hidden sm:inline">Bookmoon</span>
        </button>
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col lg:ml-72">
        {/* Main Content */}
        <main className="flex-1 relative z-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-8">
            
            {/* Report Signal Error - Accordion */}
            <div className="mb-6">
              <button
                onClick={() => setFooterFormExpanded(!footerFormExpanded)}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-[#FF358B] transition-colors"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={1.5} 
                  stroke="currentColor" 
                  className={`w-4 h-4 transition-transform ${footerFormExpanded ? 'rotate-90' : ''}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
                Report Signal Error
              </button>

              {/* Expanded Form */}
              {footerFormExpanded && (
                <div className="mt-4 pl-6 border-l border-white/20 animate-fade-in">
                  <form onSubmit={handleFooterFormSubmit} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Email</label>
                      <input
                        type="email"
                        value={footerForm.email}
                        onChange={(e) => setFooterForm({ ...footerForm, email: e.target.value })}
                        placeholder="your.email@example.com"
                        className="w-full px-3 py-2 bg-black/40 border border-white/20 text-sm text-white focus:outline-none focus:border-[#FF358B] transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Content</label>
                      <textarea
                        value={footerForm.content}
                        onChange={(e) => setFooterForm({ ...footerForm, content: e.target.value })}
                        placeholder="Describe the error or provide feedback..."
                        className="w-full px-3 py-2 bg-black/40 border border-white/20 text-sm text-white focus:outline-none focus:border-[#FF358B] transition-colors resize-none"
                        rows={4}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#FF358B] text-white text-xs font-light tracking-wider hover:bg-[#E62E7B] transition-colors"
                    >
                      Transmit Signal
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Disclaimer Text */}
            <div className="text-xs text-gray-100 leading-relaxed mb-3">
              <p>
                Unofficial survival guide built by a student, for students. Expect typos, missing sections, and occasional chaos—use at your own risk. 
                "All models are wrong, but some are useful."
              </p>
            </div>

            {/* Status Message */}
            <div className="text-xs text-pink-500 leading-relaxed">
              <p>
                Currently in early Alpha stage. Content is being gradually added, starting from Chapter 15 (Oscillations).
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Email Modal (Global) */}
      {showEmailForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={() => setShowEmailForm(false)}>
          <div 
            className="relative w-full max-w-md bg-black/90 backdrop-blur-md border border-white/20 p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setShowEmailForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 모달 제목 */}
            <h2 className="mb-6 text-lg font-light tracking-[0.4em] text-center text-white">
              TRANSMIT SIGNAL
            </h2>

            {/* 이메일 폼 */}
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <div className="border-b border-white/20 focus-within:border-[#FF358B] transition-colors">
                <input
                  type="email"
                  placeholder="Your Email"
                  value={emailForm.email}
                  onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                  className="w-full py-3 bg-transparent text-sm text-white font-light focus:outline-none placeholder-gray-500"
                  required
                />
              </div>

              <div className="border-b border-white/20 focus-within:border-[#FF358B] transition-colors">
                <textarea
                  placeholder="Feedback / Error Report / Suggestion"
                  value={emailForm.message}
                  onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                  className="w-full py-3 bg-transparent text-sm text-white font-light focus:outline-none placeholder-gray-500 resize-none"
                  rows={4}
                  required
                />
              </div>

              {/* 버튼들 */}
              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FF358B] text-white text-xs font-light tracking-[0.25em] hover:bg-[#E62E7B] transition-all duration-300"
                >
                  TRANSMIT
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="flex-1 py-2.5 border border-white/20 text-xs font-light tracking-[0.25em] text-gray-300 hover:border-[#FF358B] hover:text-white transition-all duration-300"
                >
                  CLOSE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
