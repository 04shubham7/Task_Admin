const highlights = [
  'JWT auth already wired',
  'Postgres via Docker on 5433',
  'Tailwind 3 configured and working',
]

const steps = [
  'Create a task and assign it to a user.',
  'Track status changes from Todo to Done.',
  'Attach documents without leaving the app.',
]

function App() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-hero-grid bg-[size:28px_28px] opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-[-10rem] h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />

      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 lg:px-10">
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-slate-700/80 bg-white/5 px-4 py-2 text-sm text-slate-200 shadow-glow backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Task Manager backend + frontend scaffold
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-7xl">
              Ship tasks faster with a cleaner control room.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              The stack is now configured end to end: React, Vite, Tailwind,
              Docker Postgres, and a working auth API. This page gives you a
              solid starting point instead of the default scaffold.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-2 text-sm text-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="http://localhost:5000/api/auth/login"
                className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-300"
              >
                Test API
              </a>
              <a
                href="#workflow"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
              >
                View workflow
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700/80 bg-slate-950/70 p-6 shadow-glow backdrop-blur">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Project status</span>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-300">
                Live
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {[
                ['Backend', 'Express + Sequelize connected'],
                ['Database', 'Postgres container mapped on 5433'],
                ['Auth', 'Register and login returning JWTs'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-800 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</div>
                  <div className="mt-2 text-sm text-slate-100">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="workflow" className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step}
              className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-slate-200"
            >
              <div className="mb-4 text-sm font-semibold text-cyan-300">
                0{index + 1}
              </div>
              <p className="leading-7 text-slate-300">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
