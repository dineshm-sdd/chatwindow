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

interface AuthProps {
  onLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 SAVE USER TO FIRESTORE
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050507] relative overflow-hidden font-sans selection:bg-primary/30">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        
        {/* Decorative Floating "Bubbles" */}
        <div className="absolute top-[15%] left-[10%] w-24 h-24 bg-primary/10 rounded-3xl rotate-12 blur-xl animate-float opacity-40" />
        <div className="absolute bottom-[20%] right-[15%] w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-float-delayed opacity-30" />
        <div className="absolute top-[40%] right-[10%] w-16 h-16 bg-purple-500/10 rounded-2xl -rotate-12 blur-lg animate-float opacity-20" />
        
        {/* Morphing Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-blue-500/20 blur-[100px] animate-morph" />
        </div>
      </div>

      <div className="w-full max-w-[440px] px-6 relative z-10">
        <div className="glass backdrop-blur-3xl rounded-[2.5rem] border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-700 ease-out">
          
          <div className="flex flex-col items-center mb-10">
            <div className="group relative">
              <div className="absolute inset-0 bg-primary blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-6 shadow-2xl relative border border-white/20">
                <MessageSquare className="w-10 h-10 text-white drop-shadow-lg" />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black text-white tracking-tight">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'signup' && 'Get Started'}
                {mode === 'forgot' && 'Reset Link'}
              </h1>
              <p className="text-slate-400 text-sm font-medium">
                {mode === 'login' && 'Sign in to continue your conversations'}
                {mode === 'signup' && 'Join the next generation of messaging'}
                {mode === 'forgot' && 'Enter your email to recover access'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  required
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none backdrop-blur-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {mode !== 'forgot' && (
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none backdrop-blur-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            {mode === 'login' && (
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => setMode('forgot')}
                  className="text-xs text-primary/80 font-bold hover:text-primary transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
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
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-black text-slate-600">
              <span className="bg-transparent px-2">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleSocialLogin('google')} 
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl py-3 transition-all hover:border-white/10 group active:scale-[0.98] cursor-pointer"
            >
              <Chrome className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              <span className="text-sm font-bold text-slate-300 group-hover:text-white">Google</span>
            </button>

            <button 
              onClick={() => handleSocialLogin('github')} 
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl py-3 transition-all hover:border-white/10 group active:scale-[0.98] cursor-pointer"
            >
              <Github className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              <span className="text-sm font-bold text-slate-300 group-hover:text-white">GitHub</span>
            </button>
          </div>

          <p className="text-center text-slate-500 text-sm mt-10">
            {mode === 'login' ? (
              <>New to NexChat? <button onClick={() => setMode('signup')} className="text-primary font-black hover:underline ml-1">Join now</button></>
            ) : (
              <>Already registered? <button onClick={() => setMode('login')} className="text-primary font-black hover:underline ml-1">Sign in</button></>
            )}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 opacity-40 group hover:opacity-100 transition-opacity">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white">Powered by NexTech AI</span>
        </div>
      </div>
    </div>
  );
};