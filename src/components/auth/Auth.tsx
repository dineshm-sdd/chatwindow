import { 
  MessageSquare, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles,
  Github,
  Chrome,
  Eye,
  EyeOff
} from 'lucide-react';
import { useState } from 'react';

interface AuthProps {
  onLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth
    setTimeout(() => {
      setIsLoading(false);
      if (mode !== 'forgot') onLogin();
      else alert('Password reset link sent to your email!');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0c] relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="w-full max-w-md p-8 relative z-10 glass rounded-[2.5rem] border-white/5 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            {mode === 'login' && 'Enter your credentials to access NexChat'}
            {mode === 'signup' && 'Join the world\'s most premium chat app'}
            {mode === 'forgot' && 'We\'ll send you a link to reset your password'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
              <input 
                required
                type="email" 
                placeholder="Email Address"
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {mode !== 'forgot' && (
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input 
                  required
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password"
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
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
                className="text-xs text-primary font-medium hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:opacity-90 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {mode === 'login' && 'Sign In'}
                {mode === 'signup' && 'Register Now'}
                {mode === 'forgot' && 'Send Reset Link'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5">
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={handleSocialLogin}
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white rounded-2xl py-3 border border-white/5 transition-all cursor-pointer"
            >
              <Chrome className="w-5 h-5" />
              <span className="text-sm font-medium">Google</span>
            </button>
            <button 
              onClick={handleSocialLogin}
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white rounded-2xl py-3 border border-white/5 transition-all cursor-pointer"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </div>

          <p className="text-center text-slate-500 text-sm mt-8">
            {mode === 'login' ? (
              <>Don't have an account? <button onClick={() => setMode('signup')} className="text-primary font-bold hover:underline">Sign Up</button></>
            ) : (
              <>Already have an account? <button onClick={() => setMode('login')} className="text-primary font-bold hover:underline">Sign In</button></>
            )}
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-slate-500">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium tracking-widest uppercase">Powered by NexTech</span>
      </div>
    </div>
  );
};
