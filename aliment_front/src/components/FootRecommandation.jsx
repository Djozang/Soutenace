import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Contexts/AuthContext';

const FoodRecommendation = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.healthConditions?.length) return;
    
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const promises = user.healthConditions.map(conditionId => 
          axios.get(`http://localhost:8000/api/food-recommendations/${conditionId}`)
        );
        const responses = await Promise.all(promises);
        setRecommendations(responses.map(res => res.data));
      } catch (err) {
        console.error('Failed to fetch recommendations', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [user]);

  if (!user?.healthConditions?.length) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-800 rounded">
        Veuillez configurer votre profil santé pour voir les recommandations personnalisées.
      </div>
    );
  }

  if (loading) {
    return <div>Chargement des recommandations...</div>;
  }

  return (
    <div className="space-y-6">
      {recommendations.map((rec, index) => (
        <div key={index} className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-xl font-bold mb-2">{rec.condition.name}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded">
              <h4 className="font-semibold text-green-800 mb-2">Aliments recommandés</h4>
              <ul className="list-disc pl-5">
                {JSON.parse(rec.recommended_foods).map((food, i) => (
                  <li key={i}>{food}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-red-50 p-3 rounded">
              <h4 className="font-semibold text-red-800 mb-2">Aliments à éviter</h4>
              <ul className="list-disc pl-5">
                {JSON.parse(rec.avoid_foods).map((food, i) => (
                  <li key={i}>{food}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {rec.additional_advice && (
            <div className="mt-3 p-3 bg-blue-50 rounded">
              <h4 className="font-semibold text-blue-800 mb-1">Conseils supplémentaires</h4>
              <p>{rec.additional_advice}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FoodRecommendation;