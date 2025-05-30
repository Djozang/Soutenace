"use client"

import { useState, useEffect } from "react"
import {
  Mail,
  Lock,
  User,
  Shield,
  Heart,
  AlertTriangle,
  Eye,
  EyeOff,
  ArrowRight,
  ChefHat,
  Sparkles,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { useAuth } from "../Contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const Register = () => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    password: "",
    role: "patient",
    état_santé: "sain",
    maladie: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [step, setStep] = useState(1)

  const { register, loading, error, clearError } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (clearError) clearError()
  }

  const handleSubmit = async () => {
    try {
      // Validation des champs
      if (!formData.nom || !formData.email || !formData.password) {
        return
      }

      if (formData.password.length < 6) {
        return
      }

      // Préparer les données pour l'API Laravel
      const registrationData = {
        name: formData.nom, // Laravel attend 'name' pas 'nom'
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password, // Laravel Sanctum peut exiger ceci
        role: formData.role,
        état_santé: formData.état_santé,
        ...(formData.état_santé === "malade" && formData.maladie && { maladie: formData.maladie }),
      }

      const result = await register(registrationData)

      if (result?.success) {
        navigate("/dashboard")
      }
    } catch (err) {
      console.error("Erreur:", err)
    }
  }

  const nextStep = () => {
    if (step === 1 && formData.nom && formData.email && formData.password) {
      if (formData.password.length < 6) {
        return
      }
      setStep(2)
      if (clearError) clearError()
    }
  }

  const prevStep = () => {
    setStep(1)
    if (clearError) clearError()
  }

  // Fonction pour afficher les erreurs de validation
  const getFieldError = (fieldName) => {
    if (error && typeof error === "object" && error[fieldName]) {
      return error[fieldName][0] // Laravel retourne un tableau d'erreurs
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background animation */}
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
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Form container */}
      <div
        className={`relative z-10 w-full max-w-md transform transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full opacity-20 blur-xl animate-pulse" />
            <ChefHat className="w-16 h-16 text-white mx-auto relative animate-bounce" />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-spin" />
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-2">
            Rejoignez-nous !
          </h1>
          <p className="text-gray-300 font-light">Créez votre compte et commencez votre transformation</p>
          <div className="flex justify-center mt-6 space-x-2">
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${step >= 1 ? "bg-pink-400" : "bg-white/20"}`}
            />
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${step >= 2 ? "bg-pink-400" : "bg-white/20"}`}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-200 animate-pulse">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">
                {typeof error === "string" ? error : error.message || "Une erreur est survenue"}
              </span>
            </div>
          )}

          {/* Step 1 : Informations de base */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Champ Nom */}
              <div className="group">
                <label className="block text-white/80 text-sm font-medium mb-3 group-focus-within:text-pink-400 transition-colors duration-200">
                  Nom complet *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-pink-400 transition-colors duration-200" />
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-2xl text-white placeholder-white/40 focus:outline-none focus:bg-white/10 transition-all duration-300 backdrop-blur-sm ${
                      getFieldError("name")
                        ? "border-red-400 focus:border-red-400"
                        : "border-white/20 focus:border-pink-400"
                    }`}
                    placeholder="Votre nom complet"
                    required
                  />
                </div>
                {getFieldError("name") && <p className="text-red-400 text-xs mt-2">{getFieldError("name")}</p>}
              </div>

              {/* Champ Email */}
              <div className="group">
                <label className="block text-white/80 text-sm font-medium mb-3 group-focus-within:text-pink-400 transition-colors duration-200">
                  Adresse email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-pink-400 transition-colors duration-200" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-2xl text-white placeholder-white/40 focus:outline-none focus:bg-white/10 transition-all duration-300 backdrop-blur-sm ${
                      getFieldError("email")
                        ? "border-red-400 focus:border-red-400"
                        : "border-white/20 focus:border-pink-400"
                    }`}
                    placeholder="votre@email.com"
                    required
                  />
                </div>
                {getFieldError("email") && <p className="text-red-400 text-xs mt-2">{getFieldError("email")}</p>}
              </div>

              {/* Champ Mot de passe */}
              <div className="group">
                <label className="block text-white/80 text-sm font-medium mb-3 group-focus-within:text-pink-400 transition-colors duration-200">
                  Mot de passe *
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-pink-400 transition-colors duration-200" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-4 bg-white/5 border rounded-2xl text-white placeholder-white/40 focus:outline-none focus:bg-white/10 transition-all duration-300 backdrop-blur-sm ${
                      getFieldError("password")
                        ? "border-red-400 focus:border-red-400"
                        : "border-white/20 focus:border-pink-400"
                    }`}
                    placeholder="Minimum 6 caractères"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-pink-400 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {getFieldError("password") && <p className="text-red-400 text-xs mt-2">{getFieldError("password")}</p>}
                {!getFieldError("password") && (
                  <p className="text-white/50 text-xs mt-2">Le mot de passe doit contenir au moins 6 caractères</p>
                )}
              </div>

              {/* Bouton continuer */}
              <button
                onClick={nextStep}
                disabled={!formData.nom || !formData.email || !formData.password || formData.password.length < 6}
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

          {/* Step 2 : Rôle et santé */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Choix du rôle */}
              <div className="group">
                <label className="block text-white/80 text-sm font-medium mb-3">Vous êtes un(e) *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "patient" })}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                      formData.role === "patient"
                        ? "border-pink-400 bg-pink-400/20 text-pink-400"
                        : "border-white/20 bg-white/5 text-white/80 hover:border-white/40"
                    }`}
                  >
                    <Heart className="w-6 h-6" />
                    <span className="font-medium">Patient</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "nutritionniste" })}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                      formData.role === "nutritionniste"
                        ? "border-pink-400 bg-pink-400/20 text-pink-400"
                        : "border-white/20 bg-white/5 text-white/80 hover:border-white/40"
                    }`}
                  >
                    <Shield className="w-6 h-6" />
                    <span className="font-medium">Nutritionniste</span>
                  </button>
                </div>
              </div>

              {/* État de santé */}
              <div className="group">
                <label className="block text-white/80 text-sm font-medium mb-3">État de santé *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, état_santé: "sain" })}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                      formData.état_santé === "sain"
                        ? "border-green-400 bg-green-400/20 text-green-400"
                        : "border-white/20 bg-white/5 text-white/80 hover:border-white/40"
                    }`}
                  >
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-medium">Sain</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, état_santé: "malade" })}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                      formData.état_santé === "malade"
                        ? "border-orange-400 bg-orange-400/20 text-orange-400"
                        : "border-white/20 bg-white/5 text-white/80 hover:border-white/40"
                    }`}
                  >
                    <AlertTriangle className="w-6 h-6" />
                    <span className="font-medium">Problème de santé</span>
                  </button>
                </div>
              </div>

              {/* Champ maladie (conditionnel) */}
              {formData.état_santé === "malade" && (
                <div className="group animate-fadeIn">
                  <label className="block text-white/80 text-sm font-medium mb-3">
                    Précisez votre condition médicale
                  </label>
                  <div className="relative">
                    <AlertTriangle className="absolute left-4 top-4 w-5 h-5 text-orange-400" />
                    <textarea
                      name="maladie"
                      value={formData.maladie}
                      onChange={handleChange}
                      rows="3"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-orange-400 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm resize-none"
                      placeholder="Décrivez brièvement votre condition (diabète, hypertension, allergies, etc.)"
                    />
                  </div>
                </div>
              )}

              {/* Boutons retour / inscription */}
              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  disabled={loading.action}
                  className="flex-1 py-4 text-lg font-bold text-white rounded-2xl border-2 border-white/30 hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
                >
                  Retour
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading.action}
                  className="flex-1 group relative py-4 text-lg font-bold text-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-300 group-hover:from-purple-400 group-hover:to-pink-500" />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading.action ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Inscription...
                      </>
                    ) : (
                      <>
                        S'inscrire
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Lien de connexion */}
          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm">
              Vous avez déjà un compte ?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-pink-400 hover:text-pink-300 font-medium transition-colors duration-200"
              >
                Connectez-vous
              </button>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default Register
