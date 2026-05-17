import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, AlertCircle, UserPlus } from 'lucide-react';

const Register = ({compact=false}) => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User'); // Added for easy local assignment testing
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await registerUser(email, password, role);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  const containerClass = compact ? 'w-full max-w-sm bg-white dark:bg-slate-800 dark:border-slate-700 border border-slate-100 rounded-2xl shadow p-6 transition-colors duration-300' : 'w-full max-w-md bg-white dark:bg-slate-800 dark:border-slate-700 border border-slate-100 rounded-2xl shadow-premium p-8 z-10 transition-colors duration-300';

  return (
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
        transition={{ duration: 0.5 }}
        className={containerClass}
      >
        <div className="text-center mb-8 transition-colors duration-300">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl shadow-lg text-white mb-4 font-bold text-xl">
            TF
          </div>
          <h2 className="text-2xl font-bold text-dark-900 dark:text-slate-100 tracking-tight">Create an Account</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Get started with your custom profile</p>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-300 rounded-xl text-sm transition-colors duration-300">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 text-emerald-600 dark:text-emerald-300 rounded-xl text-sm transition-colors duration-300">
            <UserPlus size={18} />
            <span>Registration successful! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail size={18} />
              </span>
              <input 
                type="email" required value={email}
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
                type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 border border-slate-200 rounded-xl outline-none text-sm transition-all focus:border-indigo-600 dark:focus:bg-slate-700 text-slate-900 dark:text-slate-100" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Select Account Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 border border-slate-200 rounded-xl outline-none text-sm transition-all focus:border-indigo-600 dark:focus:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              <option value="User">Standard User</option>
              <option value="Admin">System Administrator</option>
            </select>
          </div>

          <motion.button 
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            type="submit" disabled={isSubmitting || success}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 dark:shadow-none"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Sign Up'}
          </motion.button>
        </form>

        <p className={compact ? "text-center text-slate-500 text-xs mt-4" : "text-center text-slate-500 text-xs mt-6"}>
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;