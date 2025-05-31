import React, { useState, useEffect } from 'react';
import api from '../services/Api';
import { useAuth } from '../Contexts/AuthContext';
import { FaUser } from 'react-icons/fa';
import { 
  User, 
  Activity, 
  Target, 
  TrendingUp, 
  Calendar, 
  Apple, 
  Droplets, 
  Scale, 
  Heart,
  Bell,
  Plus,
  ChevronRight,
  Award,
  User2
} from 'lucide-react';



// Simuler l'API
const Api = {
  get: (endpoint) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = {
          '/api/meal-plans': {
            data: [
              { id: 1, meal: { nom: 'Salade méditerranéenne' }, date: '2025-05-30', type_repas: 'Déjeuner', calories: 450 },
              { id: 2, meal: { nom: 'Saumon grillé aux légumes' }, date: '2025-05-30', type_repas: 'Dîner', calories: 520 },
              { id: 3, meal: { nom: 'Bowl petit-déjeuner' }, date: '2025-05-31', type_repas: 'Petit-déjeuner', calories: 380 }
            ]
          },
          '/api/health-parameters': {
            data: [
              { id: 1, poids: 72.5, date_enregistrement: '2025-05-28', imc: 22.1, masse_grasse: 18.5 },
              { id: 2, poids: 72.2, date_enregistrement: '2025-05-25', imc: 22.0, masse_grasse: 18.2 },
              { id: 3, poids: 73.0, date_enregistrement: '2025-05-22', imc: 22.3, masse_grasse: 19.1 }
            ]
          },
          '/api/notifications': {
            data: [
              { id: 1, message: 'Nouveau patient inscrit - Jean Martin', lu: false, type: 'info' },
              { id: 2, message: 'Objectif hebdomadaire atteint!', lu: false, type: 'success' },
              { id: 3, message: 'Rappel: Consultation à 14h', lu: false, type: 'warning' }
            ]
          },
          '/api/patients-stats': {
            data: {
              total: 42,
              nouveaux: 3,
              objectifs_atteints: 28,
              consultations_semaine: 15
            }
          }
        };
        resolve(mockData[endpoint] || { data: [] });
      }, 100);
    });
  }
};

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [mealPlans, setMealPlans] = useState([]);
  const [healthParams, setHealthParams] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [patientsStats, setPatientsStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const [mealsRes, healthRes, notifsRes, statsRes] = await Promise.all([
          api.get('/api/meal-plans'),
          api.get('/api/health-parameters'),
          Api.get('/api/notifications'),
          Api.get('/api/patients-stats')
        ]);

        setMealPlans(mealsRes.data);
        setHealthParams(healthRes.data);
        setNotifications(notifsRes.data.filter(n => !n.lu));
        setPatientsStats(statsRes.data);
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Connexion requise</h3>
        <p className="text-gray-600">Veuillez vous connecter pour accéder au tableau de bord nutritionniste.</p>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 mt-16">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  NutriDash Pro
                </h1>
                <p className="text-sm text-gray-600">Tableau de bord nutritionniste</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-emerald-600 transition-colors" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{user.nom}</p>
                  <p className="text-sm text-gray-600">{profile?.spécialité}</p>
                </div>
                <img 
                  src={ <User />}
                  alt="icon" 
                  className="w-10 h-10 rounded-full border-2 border-emerald-200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-xl">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Patients Total"
            value={patientsStats.total || 0}
            icon={<User className="w-6 h-6" />}
            color="from-blue-400 to-blue-600"
            change="+2 ce mois"
          />
          <StatCard
            title="Nouveaux Patients"
            value={patientsStats.nouveaux || 0}
            icon={<Plus className="w-6 h-6" />}
            color="from-emerald-400 to-emerald-600"
            change="Cette semaine"
          />
          <StatCard
            title="Objectifs Atteints"
            value={patientsStats.objectifs_atteints || 0}
            icon={<Target className="w-6 h-6" />}
            color="from-amber-400 to-amber-600"
            change="66% de réussite"
          />
          <StatCard
            title="Consultations"
            value={patientsStats.consultations_semaine || 0}
            icon={<Calendar className="w-6 h-6" />}
            color="from-purple-400 to-purple-600"
            change="Cette semaine"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Plans de Repas */}
            <Card title="Plans de Repas Récents" icon={<Apple className="w-5 h-5" />}>
              <div className="space-y-4">
                {mealPlans.length > 0 ? (
                  mealPlans.slice(0, 4).map(plan => (
                    <div key={plan.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Apple className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{plan.meal.nom}</h4>
                          <p className="text-sm text-gray-600">{plan.type_repas} • {plan.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-600">{plan.calories} kcal</p>
                        <ChevronRight className="w-4 h-4 text-gray-400 ml-auto mt-1" />
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState message="Aucun plan de repas disponible" />
                )}
              </div>
            </Card>

            {/* Paramètres de Santé */}
            <Card title="Évolution des Paramètres" icon={<Activity className="w-5 h-5" />}>
              <div className="space-y-4">
                {healthParams.length > 0 ? (
                  healthParams.slice(0, 3).map(param => (
                    <div key={param.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Scale className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">Suivi du {param.date_enregistrement}</h4>
                          <p className="text-sm text-gray-600">IMC: {param.imc} • Masse grasse: {param.masse_grasse}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-600">{param.poids} kg</p>
                        <TrendingUp className="w-4 h-4 text-green-500 ml-auto mt-1" />
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState message="Aucun paramètre de santé enregistré" />
                )}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Notifications */}
            <Card title="Notifications" icon={<Bell className="w-5 h-5" />}>
              <div className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map(notif => (
                    <div key={notif.id} className="p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-100">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notif.type === 'success' ? 'bg-green-400' : 
                          notif.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                        }`}></div>
                        <p className="text-sm text-gray-700 flex-1">{notif.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState message="Aucune notification" />
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card title="Actions Rapides" icon={<Plus className="w-5 h-5" />}>
              <div className="space-y-3">
                <ActionButton 
                  icon={<User className="w-4 h-4" />}
                  text="Nouveau Patient"
                  color="bg-emerald-500 hover:bg-emerald-600"
                />
                <ActionButton 
                  icon={<Apple className="w-4 h-4" />}
                  text="Créer un Plan Repas"
                  color="bg-blue-500 hover:bg-blue-600"
                />
                <ActionButton 
                  icon={<Calendar className="w-4 h-4" />}
                  text="Planifier Consultation"
                  color="bg-purple-500 hover:bg-purple-600"
                />
                <ActionButton 
                  icon={<Activity className="w-4 h-4" />}
                  text="Suivi Paramètres"
                  color="bg-amber-500 hover:bg-amber-600"
                />
              </div>
            </Card>

            {/* Achievements */}
            <Card title="Réalisations" icon={<Award className="w-5 h-5" />}>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Expert Nutrition</p>
                    <p className="text-xs text-gray-600">100+ patients suivis</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Satisfaction Client</p>
                    <p className="text-xs text-gray-600">98% de satisfaction</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, change }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
        {icon}
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500">{change}</p>
      </div>
    </div>
    <h3 className="font-semibold text-gray-700">{title}</h3>
  </div>
);

const Card = ({ title, children, icon }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
          <div className="text-emerald-600">{icon}</div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const ActionButton = ({ icon, text, color }) => (
  <button className={`w-full ${color} text-white p-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-3 hover:scale-105 hover:shadow-lg`}>
    {icon}
    <span>{text}</span>
  </button>
);

const EmptyState = ({ message }) => (
  <div className="text-center py-8">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Droplets className="w-8 h-8 text-gray-400" />
    </div>
    <p className="text-gray-500">{message}</p>
  </div>
);

export default Dashboard;