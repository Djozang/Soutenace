import React, { useState, useEffect } from 'react';
import Api from '../services/Api';
import { useAuth } from '../Contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [mealPlans, setMealPlans] = useState([]);
  const [healthParams, setHealthParams] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    Api.get('/api/meal-plans')
      .then(res => setMealPlans(res.data))
      .catch(() => setError('Erreur lors du chargement des plans'));

    Api.get('/api/health-parameters')
      .then(res => setHealthParams(res.data))
      .catch(() => setError('Erreur lors du chargement des paramètres santé'));

    Api.get('/api/notifications')
      .then(res => setNotifications(res.data.filter(n => !n.lu)))
      .catch(() => setError('Erreur lors du chargement des notifications'));
  }, [user]);

  if (!user) return (
    <div className="p-6 text-center text-orange-800 bg-orange-50 rounded shadow mt-6 max-w-md mx-auto">
      Veuillez vous connecter pour accéder au tableau de bord.
    </div>
  );

  return (
    <div className="p-6 bg-[#f5f9f5] min-h-screen">
      <h2 className="text-3xl font-bold text-green-800 mb-6">Mon Tableau de Bord</h2>
      {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Plans de repas" color="bg-green-100" textColor="text-green-800">
          {mealPlans.length ? (
            <ul className="list-disc pl-5">
              {mealPlans.slice(0, 3).map(plan => (
                <li key={plan.id}>
                  {plan.meal.nom} – {plan.date} ({plan.type_repas})
                </li>
              ))}
            </ul>
          ) : <p>Aucun plan disponible.</p>}
        </Card>

        <Card title="Paramètres santé" color="bg-yellow-100" textColor="text-yellow-800">
          {healthParams.length ? (
            <ul className="list-disc pl-5">
              {healthParams.slice(0, 3).map(param => (
                <li key={param.id}>
                  Poids : {param.poids} kg – {param.date_enregistrement}
                </li>
              ))}
            </ul>
          ) : <p>Aucun paramètre enregistré.</p>}
        </Card>

        <Card title="Notifications" color="bg-red-100" textColor="text-red-800">
          {notifications.length ? (
            <ul className="list-disc pl-5">
              {notifications.slice(0, 3).map(notif => (
                <li key={notif.id}>{notif.message}</li>
              ))}
            </ul>
          ) : <p>Aucune notification.</p>}
        </Card>
      </div>
    </div>
  );
};

const Card = ({ title, children, color = 'bg-white', textColor = 'text-black' }) => (
  <div className={`${color} ${textColor} p-5 rounded-xl shadow transition hover:shadow-lg`}>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

export default Dashboard;
