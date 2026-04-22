import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import pb from '../lib/pb'; 
import dobermanLogo from '../assets/doberman.png'; 

const placeholder1 = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop"; 
const placeholder2 = "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop"; 
const placeholder3 = "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop"; 

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Data-Driven Growth.",
      subtitle: "Access powerful analytics and insights to make informed decisions and scale your fitness business.",
      image: placeholder1 
    },
    {
      title: "Intelligent Tracking.",
      subtitle: "Monitor client progress, automate renewals, and never lose sight of your members' goals.",
      image: placeholder2
    },
    {
      title: "Empower Your Vision.",
      subtitle: "Streamline your daily operations, manage clients seamlessly, and boost your overall retention.",
      image: placeholder3
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      onLogin(authData.record); 
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Base layout uses the Cream background
    <div className="min-h-screen w-full bg-tpcream flex font-sans">
      
      {/* ========================================== */}
      {/* LEFT PANEL: Immersive Dark Teal Side */}
      {/* ========================================== */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-tpteal overflow-hidden">
        
        {/* FIX: Clean fade without mix-blend-modes on the images themselves */}
        {slides.map((slide, index) => (
          <img 
            key={index}
            src={slide.image} 
            alt={`Slide ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              currentSlide === index ? 'opacity-100 z-0' : 'opacity-0 -z-10'
            }`}
          />
        ))}
        
        {/* FIX: A uniform Dark Teal overlay creates the colored effect flawlessly */}
        <div className="absolute inset-0 bg-tpteal/80 mix-blend-multiply z-10"></div>
        <div className="absolute inset-0 bg-tpteal/30 z-10"></div>

        {/* Top Left Logo */}
        <div className="absolute top-12 left-12 z-20 flex items-center gap-3">
          <img 
            src={dobermanLogo} 
            alt="TrackPoint" 
            className="h-10 w-auto invert brightness-0" 
            onError={(e) => e.target.style.display = 'none'} 
          />
          <span className="text-2xl font-medium text-white tracking-widest uppercase">TrackPoint</span>
        </div>

        {/* Transparent Frosted Glass Card */}
        <div className="absolute bottom-16 left-12 right-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-10 z-20 shadow-2xl text-white">
          
          {/* Stats Row */}
          <div className="flex gap-10 mb-8 border-b border-white/20 pb-8">
            
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <h3 className="text-3xl font-medium leading-none mb-1.5 text-tpyellow">1000+</h3>
                <p className="text-[11px] leading-[1.3] text-white/80 font-medium uppercase tracking-wider">Active Community<br/>Members</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              </div>
              <div>
                <h3 className="text-3xl font-medium leading-none mb-1.5 text-tpyellow">40+</h3>
                <p className="text-[11px] leading-[1.3] text-white/80 font-medium uppercase tracking-wider">Active Members<br/>Country</p>
              </div>
            </div>
          </div>

          {/* Rotating Text */}
          <div className="min-h-[100px]">
            <h2 className="text-3xl font-serif font-medium tracking-tight text-white mb-3 transition-all duration-500">
              {slides[currentSlide].title}
            </h2>
            <p className="text-sm font-medium text-white/80 leading-relaxed pr-6 transition-all duration-500">
              {slides[currentSlide].subtitle}
            </p>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-12 flex gap-2 z-20">
            {slides.map((_, index) => (
              <div 
                key={index}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  currentSlide === index ? 'w-10 bg-tpyellow' : 'w-4 bg-white/40'
                }`}
              ></div>
            ))}
        </div>
      </div>

      {/* ========================================== */}
      {/* RIGHT PANEL: The Form */}
      {/* ========================================== */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-10 sm:px-20 lg:px-32 relative py-16 bg-tpcream">
        
        <div className="max-w-[480px] w-full mx-auto">
          
          <h1 className="text-5xl font-serif font-medium mb-4 tracking-tight text-tpteal">
            Log In Now
          </h1>
          <p className="text-base font-medium text-tpgray mb-12 leading-relaxed">
            Welcome back. Access your dashboard to connect with professionals, showcase your progress, and grow your vision.
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-100 border border-red-200 text-red-600 text-sm rounded-xl font-medium">
                {error}
              </div>
            )}
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-tpteal mb-2.5 ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-tpteal text-tpcream placeholder-tpgray/50 border-none rounded-2xl px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-tpyellow transition-all"
                placeholder="e.g. yourname@domain.com"
                required 
              />
            </div>
            
            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2.5 mx-1">
                <label className="block text-sm font-medium text-tpteal">Password</label>
                <a href="#" className="text-sm font-medium text-tpgray hover:text-tpteal transition-colors">Forgot?</a>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-tpteal text-tpcream placeholder-tpgray/50 border-none rounded-2xl px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-tpyellow transition-all"
                  placeholder="••••••••"
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-tpyellow hover:brightness-110 transition-all"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {/* Neon Yellow Login Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-tpyellow text-tpteal font-medium text-lg rounded-2xl py-4 hover:brightness-95 transition-all mt-4 shadow-lg shadow-tpyellow/20"
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-12 text-center">
              <p className="text-sm font-semibold text-tpgray">
                Don't have an account?{' '}
                {/* Yellow text with slight shadow so it pops against cream */}
                <a href="#" className="font-medium text-tpyellow drop-shadow-sm hover:underline underline-offset-4 transition-all">
                  Sign Up
                </a>
              </p>
          </div>

        </div>
      </div>
      
    </div>
  );
}