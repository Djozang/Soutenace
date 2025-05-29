import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Contexts/AuthContext';
import { HeartIcon } from '@heroicons/react/24/solid';

const Recipes = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState({
    meals: false,
    recipes: false,
    submitting: false
  });
  const [formData, setFormData] = useState({
    repas_id: '',  // Corrigé: était meal_id
    type_contenu: 'texte',
    contenu: '',
    url_média: ''
  });
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState('');

  // Fonction pour charger les recettes
  const fetchRecipes = async () => {
    try {
      setLoading(prev => ({ ...prev, recipes: true }));
      const res = await axios.get('http://localhost:8000/api/recuperer/recette');
      console.log('Recettes récupérées:', res.data);
      
      // Adapter selon la structure de votre API
      const recipesData = Array.isArray(res.data) ? res.data : res.data.recipes || [];
      setRecipes(recipesData);
    } catch (err) {
      setError('Erreur lors du chargement des recettes');
      console.error('Erreur fetchRecipes:', err);
    } finally {
      setLoading(prev => ({ ...prev, recipes: false }));
    }
  };

  // Fonction pour charger les repas
  const fetchMeals = async () => {
    try {
      setLoading(prev => ({ ...prev, meals: true }));
      const res = await axios.get('http://localhost:8000/api/recuperer/repas');
      console.log('Repas récupérés:', res.data);
      
      // Adapter selon la structure de votre API (comme dans votre autre composant)
      let mealsData;
      if (res.data.repas && Array.isArray(res.data.repas)) {
        mealsData = res.data.repas;
      } else if (Array.isArray(res.data)) {
        mealsData = res.data;
      } else {
        mealsData = [];
      }
      
      setMeals(mealsData);
    } catch (err) {
      setError('Erreur lors du chargement des repas');
      console.error('Erreur fetchMeals:', err);
    } finally {
      setLoading(prev => ({ ...prev, meals: false }));
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchRecipes();
    fetchMeals();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.repas_id) {
      setError('Veuillez sélectionner un repas');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, submitting: true }));
      setError('');
      
      // Adapter les données pour votre API
      const requestData = {
        repas_id: parseInt(formData.repas_id),
        type_contenu: formData.type_contenu,
        contenu: formData.contenu,
        url_média: formData.url_média || null,
        validé: false // Par défaut, en attente de validation
      };

      console.log('Données envoyées:', requestData);
      
      await axios.post('http://localhost:8000/api/ajouter/recette', requestData);
      
      // Réinitialiser le formulaire
      setFormData({
        repas_id: '',
        type_contenu: 'texte',
        contenu: '',
        url_média: ''
      });
      
      // Recharger les recettes
      await fetchRecipes();
      
      alert('Recette soumise avec succès ! En attente de validation.');
      
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                         err.response?.data?.message || 
                         'Erreur lors de la soumission';
      setError(errorMessage);
      console.error('Erreur handleSubmit:', err);
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  const handleLike = async (recipeId) => {
    try {
      await axios.post(`http://localhost:8000/api/recipes/${recipeId}/like`);
      await fetchRecipes();
    } catch (err) {
      setError('Erreur lors du like');
      console.error('Erreur like:', err);
    }
  };

  const handleComment = async (recipeId, comment) => {
    if (!comment.trim()) return;
    
    try {
      await axios.post(`http://localhost:8000/api/recipes/${recipeId}/comment`, { 
        comment: comment.trim() 
      });
      await fetchRecipes();
    } catch (err) {
      setError('Erreur lors du commentaire');
      console.error('Erreur comment:', err);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 text-center bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800">
            Veuillez vous connecter pour accéder aux recettes
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Communauté des recettes</h2>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={() => setError('')} 
              className="text-red-700 hover:text-red-900"
              aria-label="Fermer l'erreur"
            >
              &times;
            </button>
          </div>
        )}
        
        {/* Formulaire de soumission */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Soumettre une recette</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Repas</label>
                <select
                  name="repas_id"
                  value={formData.repas_id}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading.meals}
                  required
                >
                  <option value="">Sélectionner un repas</option>
                  {meals.map(meal => (
                    <option key={meal.id} value={meal.id}>
                      {meal.nom}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de contenu</label>
                <select
                  name="type_contenu"
                  value={formData.type_contenu}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="texte">Texte</option>
                  <option value="vidéo">Vidéo</option>
                  <option value="audio">Audio</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                <textarea
                  name="contenu"
                  value={formData.contenu}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  placeholder="Instructions de la recette..."
                  required
                />
              </div>
              
              {(formData.type_contenu === 'vidéo' || formData.type_contenu === 'audio') && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Média ({formData.type_contenu})
                  </label>
                  <input
                    type="url"
                    name="url_média"
                    value={formData.url_média}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://exemple.com/votre-media"
                  />
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading.submitting}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading.submitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi en cours...
                </span>
              ) : 'Soumettre'}
            </button>
          </form>
        </div>
        
        {/* Liste des recettes */}
        <div className="space-y-4">
          {loading.recipes ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : recipes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">Aucune recette disponible pour le moment.</p>
            </div>
          ) : (
            recipes.map(recipe => (
              <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 md:p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {recipe.repas?.nom || recipe.meal?.nom || 'Recette'}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      recipe.validé 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {recipe.validé ? 'Validée' : 'En attente'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    Type: <span className="capitalize">{recipe.type_contenu}</span>
                  </p>
                  
                  {recipe.contenu && (
                    <p className="text-gray-800 mb-3 whitespace-pre-wrap">{recipe.contenu}</p>
                  )}
                  
                  {recipe.url_média && (
                    <div className="mb-3">
                      <a 
                        href={recipe.url_média} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        🔗 Voir le média ({recipe.type_contenu})
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleLike(recipe.id)}
                      className="flex items-center space-x-1 text-red-500 hover:text-red-600"
                    >
                      <HeartIcon className="h-5 w-5" />
                      <span>{recipe.likes_count || 0}</span>
                    </button>
                    
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Ajouter un commentaire..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            handleComment(recipe.id, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  {recipe.comments && recipe.comments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      {recipe.comments.map(comment => (
                        <p key={comment.id} className="text-sm text-gray-600 mb-1">
                          💬 {comment.comment}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Recipes;