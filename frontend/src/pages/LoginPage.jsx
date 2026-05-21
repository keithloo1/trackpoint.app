import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Mail, Lock, ArrowRight, Loader2, Dumbbell, CalendarCheck, TrendingUp, ShieldCheck, Eye, EyeOff } from 'lucide-react';

// --- ASSET IMPORTS ---
import newLogo from '../assets/logo.svg'; 
import slide1 from '../assets/slide-1.jpg';
import slide2 from '../assets/slide-2.jpg';
import slide3 from '../assets/slide-3.jpg';

// --- CAROUSEL DATA SETUP (3 Slides to match your files) ---
const carouselSlides = [
  {
    id: 1,
    icon: <Dumbbell size={64} className="text-[#E6FF2B]" />,
    title: "Client Tracking, Simplified.",
    description: "Instant access to client profiles, session balances, and workout history. No more paperwork.",
    image: slide1 
  },
  {
    id: 2,
    icon: <CalendarCheck size={64} className="text-[#E6FF2B]" />,
    title: "Seamless Booking.",
    description: "A shared calendar where clients book or reschedule sessions. Hassle-free management.",
    image: slide2 
  },
  {
    id: 3,
    icon: <TrendingUp size={64} className="text-[#E6FF2B]" />,
    title: "Live Progress Tracking.",
    description: "Visualize client weight trends and PRs. Keep them motivated and accountable.",
    image: slide3 
  }
];

export default function LoginPage({ onLogin }) {
  // --- Auth State ---
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // --- Carousel State & Logic ---
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === carouselSlides.length - 1 ? 0 : prev + 1));
    }, 5000); 
    return () => clearInterval(slideInterval);
  }, []);

  // --- Real Supabase Auth Logic ---
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) onLogin(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Account created successfully! You can now log in.");
        setIsLogin(true);
        setPassword('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Forgot Password Logic ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin, // Sends them back to your site after clicking the email link
      });
      if (error) throw error;
      setMessage("Password reset link sent! Check your email.");
      setIsForgotPassword(false); // Switch back to login view automatically
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F9F7F2] font-sans text-[#0B4550]">
      
      {/* ========================================== */}
      {/* LEFT SIDE - AUTH FORM (SWAPPED & UPSCALED) */}
      {/* ========================================== */}
      <div className="flex-1 lg:flex-[0.8] flex flex-col justify-center items-center p-6 sm:p-4 lg:p-8 relative bg-[#F9F7F2]">
        
        {/* LOGO PLACEMENT: Responsive sizing and positioning for mobile vs desktop */}
        <div className="absolute top-6 sm:top-10 left-6 sm:left-12 z-20">
             <img src={newLogo} alt="TrackPoint" className="h-16 sm:h-40 w-auto object-contain" onError={(e) => e.target.style.display = 'none'} />
        </div>

        {/* LOGIN CARD: Mobile Padding (p-6) & Margin (mt-24), scaling up on larger screens */}
        <div className="w-full max-w-lg bg-white p-6 sm:p-6 lg:p-12 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 z-10 mt-28 sm:mt-16">
          
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-3xl lg:text-5xl font-medium text-[#0B4550] mb-3">
              {isForgotPassword ? 'Reset Password' : (isLogin ? 'Log In' : 'Register Now')}
            </h2>
            <p className="text-[#898A8D] font-medium text-base sm:text-lg">
              {isForgotPassword 
                ? 'Enter your email to receive a reset link.' 
                : (isLogin ? 'Sign in with your trainer credentials.' : 'Create an admin account to start tracking.')}
            </p>
          </div>

          <form onSubmit={isForgotPassword ? handleResetPassword : handleAuth} className="space-y-7">
            
            {error && <div className="bg-red-50 text-red-600 p-5 rounded-2xl text-base font-medium border border-red-100">{error}</div>}
            {message && <div className="bg-emerald-50 text-emerald-600 p-5 rounded-2xl text-base font-medium border border-emerald-100">{message}</div>}

            <div>
              <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest mb-2 block">Trainer Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400">
                  <Mail size={24} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-5 pl-14 pr-5 font-medium text-lg text-[#0B4550] outline-none focus:border-[#0B4550] transition-colors"
                  placeholder="email"
                  required
                />
              </div>
            </div>

            {/* PASSWORD SECTION - Hides when in Forgot Password mode */}
            {!isForgotPassword && (
              <div>
                <div className="flex justify-between items-center mb-2">
                   <label className="text-[#898A8D] font-medium text-sm uppercase tracking-widest block">Password</label>
                   {isLogin && (
                     <button 
                       type="button" 
                       onClick={() => { setIsForgotPassword(true); setError(null); setMessage(null); }} 
                       className="text-sm font-medium text-[#0B4550] hover:underline"
                     >
                       Forgot?
                     </button>
                   )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400">
                    <Lock size={24} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#F9F7F2] border border-gray-100 rounded-2xl py-5 pl-14 pr-14 font-medium text-lg text-[#0B4550] outline-none focus:border-[#0B4550] transition-colors"
                    placeholder="••••••••"
                    required
                  />
                  {/* EYE ICON */}
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="text-gray-400 hover:text-[#0B4550] transition-colors p-2"
                    >
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Button increased in size */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 rounded-[2rem] font-medium text-xl bg-[#E6FF2B] text-[#0B4550] shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:scale-100 mt-4"
            >
              {loading ? <Loader2 size={28} className="animate-spin" /> : (isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Sign Up'))}
              {!loading && <ArrowRight size={24} />}
            </button>
          </form>

          <div className="mt-10 text-center">
             <p className="text-[#898A8D] font-medium text-base">
               {isForgotPassword ? "Remembered your password?" : (isLogin ? "Need a dashboard?" : "Already registered?")}
               <button 
                 type="button"
                 onClick={() => { 
                   setIsForgotPassword(false); 
                   setIsLogin(!isForgotPassword ? !isLogin : true); 
                   setError(null); 
                   setMessage(null); 
                 }} 
                 className="ml-2 text-[#0B4550] hover:underline"
               >
                 {isForgotPassword ? 'Log in' : (isLogin ? 'Sign up' : 'Log in')}
               </button>
             </p>
          </div>

        </div>
      </div>

      {/* ========================================== */}
      {/* RIGHT SIDE - CAROUSEL (FLOATING ROUNDED PANEL) */}
      {/* ========================================== */}
      <div className="hidden lg:flex flex-[1.2] flex-col justify-between bg-[#0B4550] text-white p-14 relative overflow-hidden my-4 mr-4 rounded-[3rem] shadow-2xl">
        
        {/* REAL BACKGROUND IMAGES */}
        {carouselSlides.map((slide, index) => (
          <div 
            key={`bg-${slide.id}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out z-0 ${index === currentSlide ? 'opacity-40' : 'opacity-0'}`}
          >
            <img 
              src={slide.image} 
              alt="Background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#0B4550]/70 mix-blend-multiply"></div>
          </div>
        ))}
        
        {/* --- Slides Content Area --- */}
        <div className="relative flex-1 flex flex-col justify-center pb-20 z-10 pl-8">
          {carouselSlides.map((slide, index) => (
            <div 
              key={`content-${slide.id}`} 
              className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ease-in-out ${index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}
            >
              <div className="mb-8">{slide.icon}</div>
              <h1 className="text-7xl font-medium tracking-tight mb-6 text-[#E6FF2B] leading-[1.1] drop-shadow-md max-w-2xl">
                {slide.title}
              </h1>
              <p className="text-3xl font-medium text-white/90 max-w-2xl leading-snug drop-shadow-md">
                {slide.description}
              </p>
            </div>
          ))}
        </div>

        {/* --- Slide Indicators (Dots) --- */}
        <div className="absolute bottom-14 left-20 flex gap-3 z-20">
          {carouselSlides.map((slide, index) => (
            <button 
              key={`dot-${slide.id}`} 
              onClick={() => setCurrentSlide(index)} 
              className={`h-2.5 rounded-full transition-all ${index === currentSlide ? 'bg-[#E6FF2B] w-20 shadow-md' : 'bg-white/40 hover:bg-white/80 w-12'}`} 
            />
          ))}
        </div>

        {/* Secure Message */}
        <div className="absolute top-10 right-10 z-20 flex items-center gap-3 font-medium text-sm text-white/70 bg-black/20 px-4 py-2 rounded-full backdrop-blur-md">
           <ShieldCheck size={18} /> 
        </div>
      </div>

    </div>
  );
}