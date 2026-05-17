import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle(){
  const { theme, toggle } = useTheme();
  return (
    <button aria-pressed={theme==='dark'} onClick={toggle} className="relative w-11 h-11 rounded-md flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" title="Toggle theme">
      <motion.div
        className="relative w-6 h-6"
        animate={theme === 'dark' ? 'dark' : 'light'}
        initial={false}
      >
        <motion.span
          className="absolute inset-0"
          variants={{
            light: { opacity: 1, scale: 1, rotate: 0 },
            dark: { opacity: 0, scale: 0.45, rotate: -90 },
          }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          <SunIcon />
        </motion.span>

        <motion.span
          className="absolute inset-0"
          variants={{
            light: { opacity: 0, scale: 0.45, rotate: 90, x: 6, y: -2 },
            dark: { opacity: 1, scale: 1, rotate: 0, x: 0, y: 0 },
          }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          <MoonMorph />
        </motion.span>
      </motion.div>
    </button>
  )
}

function SunIcon(){
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-slate-800 dark:text-slate-100">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 2.8v2.4" />
        <path d="M12 18.8v2.4" />
        <path d="M2.8 12h2.4" />
        <path d="M18.8 12h2.4" />
        <path d="M4.5 4.5l1.7 1.7" />
        <path d="M17.8 17.8l1.7 1.7" />
        <path d="M4.5 19.5l1.7-1.7" />
        <path d="M17.8 6.2l1.7-1.7" />
      </g>
    </svg>
  )
}

function MoonMorph(){
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-slate-800 dark:text-slate-100">
      <defs>
        <mask id="moonCut">
          <rect width="24" height="24" fill="white" />
          <circle cx="15.5" cy="9" r="7.5" fill="black" />
        </mask>
      </defs>
      <circle cx="11" cy="12" r="7" fill="currentColor" mask="url(#moonCut)" />
    </svg>
  )
}
