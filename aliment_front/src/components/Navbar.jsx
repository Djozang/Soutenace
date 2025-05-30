import React, { useState, useEffect } from 'react';
import { ChefHat, Menu, X, Home, BarChart3, Calendar, Heart, User, LogOut, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (href) => {
    navigate(href);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const authenticatedNavItems = [
    { icon: <Home className="w-4 h-4" />, label: 'Dashboard', href: '/dashboard' },
    { icon: <Calendar className="w-4 h-4" />, label: 'Planificateur', href: '/meal-planner' },
    { icon: <BarChart3 className="w-4 h-4" />, label: 'Suivi Santé', href: '/health-tracker' },
    { icon: <Heart className="w-4 h-4" />, label: 'Recettes', href: '/recipes' },
    { icon: <User className="w-4 h-4" />, label: 'Profil', href: '/profile' },
  ];

  const unauthenticatedNavItems = [
    { icon: <LogIn className="w-4 h-4" />, label: 'Connexion', href: '/login' },
    { icon: <UserPlus className="w-4 h-4" />, label: 'Inscription', href: '/register' },
  ];

  const navItems = isAuthenticated ? authenticatedNavItems : unauthenticatedNavItems;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-gradient-to-r from-purple-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-lg shadow-2xl' 
        : 'bg-gradient-to-r from-purple-800/80 via-blue-800/80 to-indigo-800/80 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => handleNavigation('/')}>
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full opacity-20 blur-lg group-hover:opacity-30 transition-opacity duration-300" />
              <ChefHat className="w-8 h-8 text-white relative transform group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 group-hover:from-pink-300 group-hover:to-purple-300 transition-all duration-300">
              Suivi Alimentaire
            </span>
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.href)}
                className="group relative px-4 py-2 rounded-xl text-white/80 hover:text-white transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center space-x-2">
                  <span className="transform group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </div>
              </button>
            ))}
            
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="group relative px-4 py-2 rounded-xl text-red-300 hover:text-red-200 transition-all duration-300 hover:scale-105 ml-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center space-x-2">
                  <LogOut className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">Déconnexion</span>
                </div>
              </button>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-300"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-2">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.href)}
                className="group w-full text-left px-4 py-3 rounded-xl text-white/80 hover:text-white transition-all duration-300 hover:bg-white/10"
              >
                <div className="flex items-center space-x-3">
                  <span className="transform group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </div>
              </button>
            ))}
            
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="group w-full text-left px-4 py-3 rounded-xl text-red-300 hover:text-red-200 transition-all duration-300 hover:bg-red-500/10"
              >
                <div className="flex items-center space-x-3">
                  <LogOut className="w-4 h-4 transform group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">Déconnexion</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </nav>
  );
};

export default Navbar;