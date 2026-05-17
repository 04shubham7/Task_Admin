import { Link } from 'react-router-dom'
import Login from './Login'
import ThemeToggle from '../components/ThemeToggle'
import AppNavbar from '../components/AppNavbar'

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50 transition-colors duration-300 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900">
      <AppNavbar variant="public" />
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch transition-colors duration-300">
          <div className="flex flex-col justify-center p-12 bg-indigo-600 text-white rounded-3xl transition-colors duration-300 dark:bg-indigo-700 shadow-[0_20px_60px_rgba(79,70,229,0.25)]">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">TaskFlow — lightweight task management</h1>
            <p className="opacity-90 mb-6 max-w-xl">Create, assign and track tasks with attachments. Secure authentication and role-based access control. Built for speed and clarity.</p>
            <ul className="space-y-3 text-sm opacity-95 mt-4">
              <li>• JWT auth and protected routes</li>
              <li>• Upload and preview documents</li>
              <li>• Admin user registry and task assignment</li>
            </ul>
            <div className="mt-8 flex items-center gap-3">
              <Link to="/register" className="inline-block bg-white text-indigo-700 px-4 py-2 rounded-full font-semibold shadow">Create account</Link>
              <ThemeToggle />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg flex items-center justify-center transition-colors duration-300 dark:bg-slate-800 border border-white/60 dark:border-white/10 backdrop-blur-xl">
            <div className="w-full max-w-md">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-100 mb-4">Sign in to your account</h3>
              <Login compact={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing
