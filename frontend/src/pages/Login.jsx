import {useState} from 'react';
import {useAuth} from '../context/AuthContext';
import {useNavigate,Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import {Mail,Lock,Loader2,AlertCircle} from 'lucide-react';

const Login=({compact=false})=>{
    const {loginUser,logoutUser}=useAuth();
    const navigate=useNavigate();
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [error,setError]=useState(null);
    const [isSubmitting,setIsSubmitting]=useState(false);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const result=await loginUser(email,password);
        if(result.success){
            navigate('/dashboard');
        }else{
            setError(result.message);
        }
        setIsSubmitting(false);
    };

    const containerClass = compact ? 'w-full max-w-sm bg-white dark:bg-slate-800 dark:border-slate-700 border border-slate-100 rounded-2xl shadow p-6 transition-colors duration-300' : 'w-full max-w-md bg-white dark:bg-slate-800 dark:border-slate-700 border border-slate-100 rounded-2xl shadow-premium p-8 z-10 transition-colors duration-300';

    return(
        <div className={compact ? "flex items-center justify-center px-4" : "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4"}>
      {!compact && (
        <>
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse delay-75" />
        </>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={containerClass}
      >
        <div className="text-center mb-8 transition-colors duration-300">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100 text-white mb-4 font-bold text-xl">
            TF
          </div>
          <h2 className="text-2xl font-bold text-dark-900 dark:text-slate-100 tracking-tight">Welcome back</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Please enter your credentials to log in</p>
        </div>

        {error && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-5 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-300 rounded-xl text-sm transition-colors duration-300"
          >
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail size={18} />
              </span>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 border border-slate-200 rounded-xl outline-none text-sm transition-all focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-slate-100" 
                placeholder="you@domain.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock size={18} />
              </span>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 border border-slate-200 rounded-xl outline-none text-sm transition-all focus:border-indigo-600 dark:focus:bg-slate-700 text-slate-900 dark:text-slate-100" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 disabled:opacity-70 dark:shadow-none"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>

        <p className={compact ? "text-center text-slate-500 text-xs mt-4" : "text-center text-slate-500 text-xs mt-6"}>
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;