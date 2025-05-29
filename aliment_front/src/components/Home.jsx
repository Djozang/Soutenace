import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Bienvenue sur Suivi Alimentaire</h1>
      <p className="text-lg text-gray-700 mb-6">
        Gérez votre alimentation, planifiez vos repas, suivez votre santé et partagez des recettes avec notre communauté.
      </p>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Connexion
        </Link>
        <Link to="/register" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
          Inscription
        </Link>
      </div>
    </div>
  );
};

export default Home;