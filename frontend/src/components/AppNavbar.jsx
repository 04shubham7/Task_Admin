import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { Home, List, Users as UsersIcon, LogOut, Menu } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

const AppNavbar = ({ variant = 'public' }) => {
  const { user, logoutUser } = useAuth();
  const [open, setOpen] = useState(false);

  const protectedLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <Home size={16} /> },
    { to: '/tasks', label: 'Tasks', icon: <List size={16} /> },
    ...(user?.role === 'Admin' ? [{ to: '/users', label: 'Users', icon: <UsersIcon size={16} /> }] : []),
  ];

  const links = variant === 'public' ? [] : protectedLinks;

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mx-auto max-w-7xl rounded-2xl border border-white/40 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold shadow-sm shrink-0">TF</div>
            <div className="min-w-0">
              <div className="font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">Task Flow</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || 'Lightweight task management'}</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-white/10'}`}
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            {variant === 'protected' && (
              <>
                <button onClick={() => setOpen(v => !v)} className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors" aria-label="Open menu">
                  <Menu size={18} />
                </button>
                <button onClick={logoutUser} className="hidden md:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                  <LogOut size={14} />
                  <span>Sign out</span>
                </button>
              </>
            )}
            {variant === 'public' && (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="rounded-full px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-white/10 transition-colors">Login</Link>
                <Link to="/register" className="rounded-full px-4 py-2 text-sm bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 transition-colors">Create account</Link>
              </div>
            )}
          </div>
        </div>

        {variant === 'protected' && open && (
          <div className="md:hidden border-t border-white/30 dark:border-white/10 px-3 py-3">
            <div className="flex flex-col gap-2">
              {links.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-white/10'}`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              ))}
              <button onClick={logoutUser} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left">
                <LogOut size={14} />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default AppNavbar
