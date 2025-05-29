import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Contexts/AuthContext';



const Dashboard = () => {
  const { user } = useAuth();
  const [mealPlans, setMealPlans] = useState([]);
  const [healthParams, setHealthParams] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    // Fetch meal plans
    axios.get('http://localhost:8000/api/meal-plans')
      .then(res => setMealPlans(res.data))
      .catch(() => setError('Erreur lors du chargement des plans'));

    // Fetch health parameters
    axios.get('http://localhost:8000/api/health-parameters')
      .then(res => setHealthParams(res.data))
      .catch(() => setError('Erreur lors du chargement des paramètres santé'));

    // Fetch notifications
    axios.get('http://localhost:8000/api/notifications')
      .then(res => setNotifications(res.data.filter(n => !n.lu)))
      .catch(() => setError('Erreur lors du chargement des notifications'));
  }, [user]);

  if (!user) return <div className="p-6 text-center">Veuillez vous connecter.</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Tableau de bord</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Plans de repas</h3>
          {mealPlans.length ? (
            <ul className="list-disc pl-5">
              {mealPlans.slice(0, 3).map(plan => (
                <li key={plan.id}>{plan.meal.nom} - {plan.date} ({plan.type_repas})</li>
              ))}
            </ul>
          ) : (
            <p>Aucun plan pour le moment.</p>
          )}
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Paramètres santé</h3>
          {healthParams.length ? (
            <ul className="list-disc pl-5">
              {healthParams.slice(0, 3).map(param => (
                <li key={param.id}>Poids: {param.poids}kg, {param.date_enregistrement}</li>
              ))}
            </ul>
          ) : (
            <p>Aucun paramètre enregistré.</p>
          )}
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
          {notifications.length ? (
            <ul className="list-disc pl-5">
              {notifications.slice(0, 3).map(notif => (
                <li key={notif.id}>{notif.message}</li>
              ))}
            </ul>
          ) : (
            <p>Aucune notification.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;