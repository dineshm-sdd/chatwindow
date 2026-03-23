import {
  MessageSquare,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Github,
  Chrome
} from 'lucide-react';
import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import authBg from '../../assets/auth-bg.png';

interface AuthProps {
  onLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const saveUserToDB = async (user: any) => {
    if (!user) return;
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          userName: user.displayName || email.split('@')[0] || "Anonymous",
          email: user.email,
          userAvatar: user.photoURL || "",
          userBio: "Hey there! I'm using NexChat.",
          createdAt: new Date()
        },
        { merge: true }
      );
    } catch (e) {
      console.error("Error saving user profile:", e);
    }
  };

  const handleSocialLogin = async (providerName: 'google' | 'github') => {
    setIsLoading(true);
    try {
      const provider = providerName === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await saveUserToDB(result.user);
      onLogin();
    } catch (error: any) {
      console.error('Social login error:', error);
      if (error.code === 'auth/popup-blocked') alert('Popup blocked! Please allow popups.');
      else if (error.code === 'auth/unauthorized-domain') alert('Domain not authorized in Firebase.');
      else if (error.code === 'auth/operation-not-allowed') alert('Provider not enabled in Firebase.');
      else alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === 'login') {
        const result = await signInWithEmailAndPassword(auth, email, password);
        await saveUserToDB(result.user);
        onLogin();
      } else if (mode === 'signup') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await saveUserToDB(result.user);
        onLogin();
      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        alert('Password reset link sent to your email!');
        setMode('login');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      if (error.code === 'auth/user-not-found') alert('User not found');
      else if (error.code === 'auth/wrong-password') alert('Wrong password');
      else if (error.code === 'auth/email-already-in-use') alert('Email already registered');
      else alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0c] relative overflow-hidden font-sans selection:bg-primary/30">
      {/* Background Image & Overlays */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center brightness-[0.35] contrast-[1.1] opacity-60 scale-105 animate-pulse-slow transition-all duration-1000"
        style={{ backgroundImage: `url(${authBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0c] via-transparent to-primary/10 z-1" />

      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-2">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        
        {/* Decorative Floating "Bubbles" */}
        <div className="absolute top-[15%] left-[10%] w-24 h-24 bg-primary/15 rounded-3xl rotate-12 blur-xl animate-float opacity-40 shadow-[0_0_50px_rgba(139,92,246,0.1)]" />
        <div className="absolute bottom-[20%] right-[15%] w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl animate-float-delayed opacity-30 shadow-[0_0_60px_rgba(99,102,241,0.05)]" />
        
        {/* Morphing Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-15">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-indigo-600/20 blur-[100px] animate-morph" />
        </div>
      </div>

      <div className="w-full max-w-[440px] px-6 relative z-10">
        <div className="glass backdrop-blur-3xl rounded-[2.5rem] border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-700 ease-out border-t-white/20">
          
          <div className="flex flex-col items-center mb-10">
            <div className="group relative">
              <div className="absolute inset-0 bg-primary blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-6 shadow-[0_15px_30px_rgba(139,92,246,0.2)] relative border border-white/20 ring-4 ring-primary/5">
                <MessageSquare className="w-10 h-10 text-white drop-shadow-lg" />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'signup' && 'Get Started'}
                {mode === 'forgot' && 'Reset Link'}
              </h1>
              <p className="text-slate-100 text-sm font-bold opacity-80 drop-shadow-sm">
                {mode === 'login' && 'Sign in to continue your conversations'}
                {mode === 'signup' && 'Join the next generation of messaging'}
                {mode === 'forgot' && 'Enter your email to recover access'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-all group-focus-within:scale-110 z-20">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  required
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-[#0c0c0e]/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all outline-none backdrop-blur-md relative z-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {mode !== 'forgot' && (
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-all group-focus-within:scale-110 z-20">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full bg-[#0c0c0e]/60 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-600 focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all outline-none backdrop-blur-md relative z-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors p-2 z-20"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              )}
            </div>

            {mode === 'login' && (
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => setMode('forgot')}
                  className="text-xs text-primary/70 font-bold hover:text-primary transition-colors cursor-pointer drop-shadow-sm"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_15px_30px_rgba(139,92,246,0.2)] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98] mt-2 ring-2 ring-primary/10"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Sign In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'forgot' && 'Send Reset Link'}
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">
              <span className="bg-[#0c0c0e]/40 backdrop-blur-md px-4 rounded-full py-1 border border-white/5">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleSocialLogin('google')} 
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-3.5 transition-all group active:scale-[0.98] cursor-pointer shadow-sm hover:border-primary/20"
            >
              <Chrome className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
              <span className="text-sm font-bold text-slate-300 group-hover:text-white">Google</span>
            </button>

            <button 
              onClick={() => handleSocialLogin('github')} 
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-3.5 transition-all group active:scale-[0.98] cursor-pointer shadow-sm hover:border-primary/20"
            >
              <Github className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
              <span className="text-sm font-bold text-slate-300 group-hover:text-white">GitHub</span>
            </button>
          </div>

          <p className="text-center text-slate-500 text-sm mt-10 font-medium">
            {mode === 'login' ? (
              <>New to NexChat? <button onClick={() => setMode('signup')} className="text-primary font-black hover:underline ml-1">Join now</button></>
            ) : (
              <>Already registered? <button onClick={() => setMode('login')} className="text-primary font-black hover:underline ml-1">Sign in</button></>
            )}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 opacity-40 group hover:opacity-100 transition-opacity">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/60">Powered by NexTech AI</span>
        </div>
      </div>
    </div>
  );
};