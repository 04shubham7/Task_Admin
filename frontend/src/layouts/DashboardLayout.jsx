import AppNavbar from '../components/AppNavbar'

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="pb-8">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <AppNavbar variant="protected" />
          </div>
        </div>

        <main className="px-4 sm:px-6 lg:px-8 pt-6 transition-colors duration-300">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
