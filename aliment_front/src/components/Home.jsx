import React, { useState, useEffect } from "react";
import {
  Utensils,
  TrendingUp,
  Users,
  Calendar,
  Sparkles,
  ChefHat,
  Heart,
  Target,
} from "lucide-react";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Utensils className="w-6 h-6" />,
      title: "Suivi Intelligent",
      description: "Analysez votre alimentation avec des outils avancés",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Planification",
      description: "Organisez vos repas pour la semaine",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Progression",
      description: "Visualisez vos objectifs santé en temps réel",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Communauté",
      description: "Partagez et découvrez des recettes uniques",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden mt-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-10 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 20}px`,
              height: `${Math.random() * 100 + 20}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 py-12">
        {/* Hero Section */}
        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="mb-8 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full opacity-20 blur-xl animate-pulse" />
            <ChefHat className="w-16 h-16 text-white mx-auto relative animate-bounce" />
          </div>

          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight">
            Suivi
            <br />
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 drop-shadow-[0_2px_4px_rgba(192,132,252,0.5)]">
                Alimentaire
              </span>
              <Sparkles className="absolute -top-4 -right-10 w-10 h-10 text-amber-300 animate-pulse" />
              <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-400/70 via-blue-400/70 to-purple-400/70 rounded-full transform scale-x-90 group-hover:scale-x-100 transition-transform duration-300"></span>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl leading-relaxed font-light">
            Transformez votre relation avec la nourriture grâce à une expérience
            <span className="text-gradient bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-semibold">
              {" "}
              révolutionnaire
            </span>{" "}
            de suivi alimentaire
          </p>
        </div>

        {/* Features Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-6xl transform transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-2"
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="text-pink-400 mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {hoveredFeature === index && (
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl opacity-50 blur-sm animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-6 transform transition-all duration-1000 delay-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <button
            onClick={() => (window.location.href = "/login")}
            className="group relative px-12 py-4 text-lg font-bold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:from-blue-400 group-hover:to-purple-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 group-hover:animate-pulse" />
              Connexion
            </span>
          </button>

          <button
            onClick={() => (window.location.href = "/register")}
            className="group relative px-12 py-4 text-lg font-bold text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-pink-500 hover:border-pink-400 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 group-hover:from-pink-500 group-hover:to-purple-500 transition-all duration-300" />
            <span className="relative flex items-center justify-center gap-2">
              <Target className="w-5 h-5 group-hover:animate-spin" />
              Commencer Maintenant
            </span>
          </button>
        </div>

        {/* Stats Section */}
        <div
          className={`mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl transform transition-all duration-1000 delay-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {[
            { number: "10k+", label: "Utilisateurs actifs" },
            { number: "50k+", label: "Recettes partagées" },
            { number: "98%", label: "Satisfaction client" },
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-gray-300 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Floating action hint */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-white/60 text-sm font-medium">
            Découvrez votre potentiel santé ↓
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
