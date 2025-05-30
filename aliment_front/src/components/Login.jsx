import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ChefHat, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate,useLocation } from 'react-router-dom';
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
   const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Effacer l'erreur quand l'utilisateur tape
    if (error) setError(null);
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
     // Validation simple des champs
    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    setIsLoading(true);
    setError(null);
    
    try {

      const result = await login(formData.email, formData.password); // Appel à la fonction de login du contexte
      
      if (result?.success) {
        toast.success("Connexion réussie ! Bienvenue !");
        navigate('/dashboard', { replace: true }); // Redirection vers le tableau de bord
      } else {
        setError(result?.error || "Échec de la connexion");
        toast.error(result?.error || "Échec de la connexion");
      }
    } catch (err) {
      setError("Une erreur inattendue s'est produite");
      console.error("Login error:", err);
      toast.error("Une erreur inattendue s'est produite");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden flex items-center justify-center p-4 mt-16">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-5 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 80 + 20}px`,
              height: `${Math.random() * 80 + 20}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md transform transition-all duration-1000 translate-y-0 opacity-100">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full opacity-20 blur-xl animate-pulse" />
            <ChefHat className="w-16 h-16 text-white mx-auto relative animate-bounce" />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-spin" />
          </div>
          
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-2">
            Bon retour !
          </h1>
          <p className="text-gray-300 font-light">
            Connectez-vous pour continuer votre parcours santé
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-200 animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{typeof error === 'string' ? error : error.message || 'Une erreur est survenue'}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-white font-medium text-sm">Email</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300" />
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-pink-400 transition-colors duration-300" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:bg-white/10 transition-all duration-300"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white font-medium text-sm">Mot de passe</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300" />
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-pink-400 transition-colors duration-300" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:bg-white/10 transition-all duration-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 hover:text-pink-400 transition-colors duration-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full py-4 text-lg font-bold text-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:from-blue-400 group-hover:to-purple-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connexion...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-300 text-sm">
              Pas encore de compte ?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-pink-400 hover:text-pink-300 font-semibold hover:underline transition-colors duration-300 bg-transparent border-none cursor-pointer"
              >
                Créer un compte
              </button>
            </p>
            
            <a href="/forgot-password" className="mt-4 text-gray-400 hover:text-gray-300 text-sm underline transition-colors duration-300">
              Mot de passe oublié ?
            </a>
          </div>
        </div>
      </div>

      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
};

export default Login;