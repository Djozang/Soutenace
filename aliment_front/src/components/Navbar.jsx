import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';



const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Suivi Alimentaire</Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:underline">Tableau de bord</Link>
              <Link to="/meal-planner" className="hover:underline">Planificateur</Link>
              <Link to="/health-tracker" className="hover:underline">Suivi Santé</Link>
              <Link to="/recipes" className="hover:underline">Recettes</Link>
              <Link to="/profile" className="hover:underline">Profil</Link>
              <button onClick={handleLogout} className="hover:underline">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Connexion</Link>
              <Link to="/register" className="hover:underline">Inscription</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;