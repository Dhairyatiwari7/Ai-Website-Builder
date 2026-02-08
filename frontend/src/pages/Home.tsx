import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <section className="flex flex-col items-center text-white text-sm pb-20 px-4" style={{fontFamily: 'Poppins, sans-serif'}}>
      
      <a href="https://prebuiltui.com" className="flex items-center gap-2 border border-slate-700 rounded-full p-1 pr-3 text-sm mt-20 hover:bg-white/5 transition-all">
        <span className="bg-linear-to-r from-purple-600 to-pink-500 text-xs px-3 py-1 rounded-full font-medium">NEW</span>
        <p className="flex items-center gap-2">
          <span>Try 30 days free trial option</span>
          <svg className="mt-px w-1.5 h-2.25" viewBox="0 0 6 9" fill="none">
            <path d="m1 1 4 3.5L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </p>
      </a>

      <h1 className="text-center text-[40px] leading-[48px] md:text-6xl md:leading-[70px] mt-4 font-semibold max-w-3xl">
        Turn thoughts into websites instantly, with AI.
      </h1>

      <p className="text-center text-base max-w-md mt-2 opacity-90">
        Create stunning, responsive websites in seconds using our AI-powered platform. No coding required.
      </p>

      <div className="relative max-w-2xl w-full mt-10 mb-4">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-pink-400/60 to-purple-500/60 p-[3px] opacity-0 group-focus-within:opacity-100 group-hover:opacity-80 transition-all duration-500 pointer-events-none" />
        
        <form 
          onSubmit={onSubmitHandler} 
          className="bg-white/5 backdrop-blur-xl w-full rounded-2xl p-6 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 relative group z-10"
          style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
        >
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-white/5 backdrop-blur-sm w-full text-gray-100 placeholder-gray-400 resize-none rounded-xl p-5 text-lg font-light border-0 outline-none transition-all"
            rows={4}
            placeholder="Describe your presentation in details..."
            required
            disabled={loading}
          />
          
          <button 
            type="submit"
            disabled={loading}
            className="ml-auto flex items-center gap-2.5 mt-4 px-8 py-3 font-semibold text-sm rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group/button"
            style={{
              background: 'linear-gradient(135deg, #581C87 0%, #7C3AED 35%, #9333EA 65%, #6D28D9 100%)',
              backgroundSize: '300% 300%',
              color: 'white',
              border: 'none',
              minWidth: '160px',
              animation: loading ? 'none' : 'gradientShift 4s ease infinite'
            }}
          >
            <span className="relative z-10 font-medium">
              {loading ? 'Creating...' : 'Create with AI'}
            </span>
            {loading && (
              <Loader2 
                className="size-5 ml-1" 
                style={{ animation: 'spin 0.8s linear infinite' }} 
              />
            )}
          </button>
        </form>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-16 md:gap-20 mx-auto mt-16 opacity-80">
        <img className="max-w-28 md:max-w-32 hover:brightness-125 transition-all" src="https://saasly.prebuiltui.com/assets/companies-logo/framer.svg" alt="" />
        <img className="max-w-28 md:max-w-32 hover:brightness-125 transition-all" src="https://saasly.prebuiltui.com/assets/companies-logo/huawei.svg" alt="" />
        <img className="max-w-28 md:max-w-32 hover:brightness-125 transition-all" src="https://saasly.prebuiltui.com/assets/companies-logo/instagram.svg" alt="" />
        <img className="max-w-28 md:max-w-32 hover:brightness-125 transition-all" src="https://saasly.prebuiltui.com/assets/companies-logo/microsoft.svg" alt="" />
        <img className="max-w-28 md:max-w-32 hover:brightness-125 transition-all" src="https://saasly.prebuiltui.com/assets/companies-logo/walmart.svg" alt="" />
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
};

export default Home;
