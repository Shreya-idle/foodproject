import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthStore';
import { useMeals } from '../hooks/useMeals';
import { Home, Search, PlusCircle, BarChart3, User, LogOut, Flame, Leaf } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const { streak } = useMeals();
  const location = useLocation();

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/discover', icon: Search, label: 'Discover' },
    { to: '/log', icon: PlusCircle, label: 'Log Meal' },
    { to: '/dashboard', icon: BarChart3, label: 'Insights' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <Leaf className="w-7 h-7 text-primary-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
              NourishAI
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {streak > 0 && (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                <Flame className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold text-amber-700">{streak}</span>
              </div>
            )}
            <span className="text-sm text-gray-500 hidden sm:block">Hi, {user?.name}</span>
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 pb-24">
        <div className="page-enter">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/20">
        <div className="max-w-6xl mx-auto flex justify-around items-center h-16">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl no-underline transition-all ${
                  isActive ? 'text-primary-600 scale-105' : 'text-gray-400 hover:text-primary-500'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[10px] font-medium">{label}</span>
                {isActive && <div className="w-1 h-1 rounded-full bg-primary-500 mt-0.5" />}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
