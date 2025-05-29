import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Configuration Axios globale
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [conditions, setConditions] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [loading, setLoading] = useState({
    conditions: false,
    profile: false
  });

  // Fonction pour récupérer le token
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || 
           document.cookie.split('; ')
             .find(row => row.startsWith('token='))
             ?.split('=')[1];
  };

  // Intercepteur Axios pour gérer les erreurs globales
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(config => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    if (user?.healthConditions) {
      setSelectedConditions(user.healthConditions);
    }
    fetchConditions();
  }, [user]);

  const fetchConditions = async () => {
    try {
      setLoading(prev => ({ ...prev, conditions: true }));
      
      const response = await axios.get('/api/health-conditions', {
        headers: {
          'Accept': 'application/json'
        }
      });

      setConditions(response.data.data || response.data);
    } catch (error) {
      handleApiError(error, 'le chargement des conditions');
    } finally {
      setLoading(prev => ({ ...prev, conditions: false }));
    }
  };

  const handleUnauthorized = () => {
    logout();
    toast.error('Votre session a expiré, veuillez vous reconnecter', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    navigate('/login', { state: { from: location }, replace: true });
  };

  const handleApiError = (error, context) => {
    console.error(`Erreur lors de ${context}:`, error);
    
    let errorMessage = "Une erreur est survenue";
    if (error.response) {
      if (error.response.data?.errors) {
        errorMessage = Object.values(error.response.data.errors).flat().join(', ');
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
    }

    toast.error(`${errorMessage} (${context})`, {
      position: "top-right",
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleConditionToggle = (conditionId) => {
    setSelectedConditions(prev => 
      prev.includes(conditionId)
        ? prev.filter(id => id !== conditionId)
        : [...prev, conditionId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedConditions.length === 0) {
      toast.warn('Veuillez sélectionner au moins une condition', {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    try {
      setLoading(prev => ({ ...prev, profile: true }));
      
      const response = await axios.put('/api/profile', {
        health_conditions: selectedConditions
      });

      updateProfile({
        ...user,
        healthConditions: selectedConditions,
        updatedAt: new Date().toISOString()
      });

      toast.success('Profil mis à jour avec succès!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      handleApiError(error, 'la mise à jour du profil');
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  if (loading.conditions) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profil Santé</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Conditions médicales
          </h2>
          
          {conditions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-2">
              {conditions.map(condition => (
                <div key={condition.id} className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id={`condition-${condition.id}`}
                    checked={selectedConditions.includes(condition.id)}
                    onChange={() => handleConditionToggle(condition.id)}
                    className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`condition-${condition.id}`} className="flex-1">
                    <span className="block font-medium text-gray-800">{condition.name}</span>
                    {condition.description && (
                      <span className="block text-sm text-gray-600 mt-1">
                        {condition.description}
                      </span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-500">Aucune condition disponible</p>
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading.profile}
            className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
              loading.profile
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
            }`}
          >
            {loading.profile ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </span>
            ) : (
              'Mettre à jour mon profil'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;