import React, { useState, useEffect } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import Api from '../services/Api';

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
          Api.get(`/api/food-recommendations/${conditionId}`)
        );
        const responses = await Promise.all(promises);
        setRecommendations(responses.map(res => res.data));
      } catch (err) {
        console.error('Erreur lors de la récupération des recommandations', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  if (!user?.healthConditions?.length) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-800 rounded shadow mt-6 max-w-md mx-auto">
        Veuillez configurer votre profil santé pour voir les recommandations personnalisées.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center p-6 text-green-700 font-medium">
        Chargement des recommandations...
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f5f9f5] min-h-screen space-y-6">
      {recommendations.map((rec, index) => (
        <div key={index} className="p-6 bg-white rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-2xl font-bold text-green-700 mb-4">
            Recommandations pour {rec.condition.name}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-100 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Aliments recommandés</h4>
              <ul className="list-disc pl-5 text-green-900">
                {JSON.parse(rec.recommended_foods).map((food, i) => (
                  <li key={i}>{food}</li>
                ))}
              </ul>
            </div>

            <div className="bg-red-100 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">Aliments à éviter</h4>
              <ul className="list-disc pl-5 text-red-900">
                {JSON.parse(rec.avoid_foods).map((food, i) => (
                  <li key={i}>{food}</li>
                ))}
              </ul>
            </div>
          </div>

          {rec.additional_advice && (
            <div className="mt-4 bg-blue-100 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Conseils supplémentaires</h4>
              <p className="text-blue-900">{rec.additional_advice}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FoodRecommendation;
