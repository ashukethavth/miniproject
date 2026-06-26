import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShieldCheckIcon, Bars3Icon, UserCircleIcon, BellIcon } from '@heroicons/react/24/outline';
import { motion } from 'motion/react';
import { Button } from '@/src/components/ui/Button';
import { cn } from '@/src/utils/cn';

export const Header = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled ? 'bg-white/70 backdrop-blur-xl border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent py-6'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="bg-primary-600 p-2 rounded-xl group-hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20"
            >
              <ShieldCheckIcon className="h-6 w-6 text-white" />
            </motion.div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">CloudLock</span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {['Features', 'Compliance', 'Pricing'].map((item) => (
              <NavLink 
                key={item}
                to={`/${item.toLowerCase()}`} 
                className={({ isActive }) => cn(
                  'text-sm font-bold tracking-wide uppercase transition-all hover:text-primary-600 relative group',
                  isActive ? 'text-primary-600' : 'text-slate-500'
                )}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="hidden md:flex font-bold text-slate-600">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="px-6 rounded-xl font-bold shadow-lg shadow-primary-500/20">
                Get Started
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="md:hidden p-2">
              <Bars3Icon className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
