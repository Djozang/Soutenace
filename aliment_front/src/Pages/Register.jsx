import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Shield, Heart, AlertTriangle, Eye, EyeOff, ArrowRight, ChefHat, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from "../Contexts/AuthContext";
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    role: 'patient',
    état_santé: 'sain',
    maladie: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulation d'une inscription (remplacez par votre vraie logique)
    //   await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Dans votre vraie app:
      await axios.post('http://localhost:8000/api/register', formData);
      navigate('/login');
      
      alert('Inscription réussie ! Redirection vers la connexion...');
    } catch (err) {
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && formData.nom && formData.email && formData.password) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background elements */}
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

      <div className={`relative z-10 w-full max-w-md transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full opacity-20 blur-xl animate-pulse" />
            <ChefHat className="w-16 h-16 text-white mx-auto relative animate-bounce" />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-spin" />
          </div>
          
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-2">
            Rejoignez-nous !
          </h1>
          <p className="text-gray-300 font-light">
            Créez votre compte et commencez votre transformation
          </p>

          {/* Progress Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
              step >= 1 ? 'bg-pink-400' : 'bg-white/20'
            }`} />
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
              step >= 2 ? 'bg-pink-400' : 'bg-white/20'
            }`} />
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-200 animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-white font-medium text-sm">Nom complet</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300" />
                    <div className="relative flex items-center">
                      <User className="absolute left-4 w-5 h-5 text-gray-400 group-focus-within:text-pink-400 transition-colors duration-300" />
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:bg-white/10 transition-all duration-300"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
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

                {/* Password Field */}
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
                  onClick={nextStep}
                  disabled={!formData.nom || !formData.email || !formData.password}
                  className="group relative w-full py-4 text-lg font-bold text-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 transition-all duration-300 group-hover:from-green-400 group-hover:to-blue-500" />
                  <span className="relative flex items-center justify-center gap-2">
                    Continuer
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-3">
                  <label className="text-white font-medium text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Rôle
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['patient', 'administrateur'].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setFormData({ ...formData, role })}
                        className={`p-4 rounded-2xl border-2 font-medium transition-all duration-300 ${
                          formData.role === role
                            ? 'border-pink-400 bg-pink-500/20 text-pink-200'
                            : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40'
                        }`}
                      >
                        {role === 'patient' ? 'Patient' : 'Administrateur'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Health Status */}
                <div className="space-y-3">
                  <label className="text-white font-medium text-sm flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    État de santé
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['sain', 'malade'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setFormData({ ...formData, état_santé: status, maladie: status === 'sain' ? '' : formData.maladie })}
                        className={`p-4 rounded-2xl border-2 font-medium transition-all duration-300 ${
                          formData.état_santé === status
                            ? 'border-green-400 bg-green-500/20 text-green-200'
                            : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/40'
                        }`}
                      >
                        {status === 'sain' ? (
                          <div className="flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Sain
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Malade
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pathology Field */}
                {formData.état_santé === 'malade' && (
                  <div className="space-y-2">
                    <label className="text-white font-medium text-sm">Pathologie</label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-300" />
                      <input
                        type="text"
                        name="maladie"
                        value={formData.maladie}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/20 rounded-2xl px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white/10 transition-all duration-300"
                        placeholder="Décrivez votre pathologie"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={prevStep}
                    className="flex-1 py-4 text-lg font-bold text-white rounded-2xl border-2 border-white/30 hover:bg-white/10 transition-all duration-300"
                  >
                    Retour
                  </button>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-2 group relative py-4 text-lg font-bold text-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-300 group-hover:from-purple-400 group-hover:to-pink-500" />
                    
                    {isLoading ? (
                      <div className="relative flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Inscription...</span>
                      </div>
                    ) : (
                      <span className="relative flex items-center justify-center gap-2">
                        S'inscrire
                        <CheckCircle className="w-5 h-5" />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-300 text-sm">
              Déjà inscrit ?{' '}
              <button
                onClick={() => window.location.href = '/login'}
                className="text-pink-400 hover:text-pink-300 font-semibold hover:underline transition-colors duration-300"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
};

export default Register;