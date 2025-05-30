import React, { useState, useEffect } from 'react';
import Api from '../services/Api';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../Contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Configuration de moment pour le français
moment.locale('fr');
const localizer = momentLocalizer(moment);

const MealPlanner = () => {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState({
    meals: false,
    plans: false,
    submitting: false
  });
  const [formData, setFormData] = useState({
    repas_id: '',
    date: new Date(),
    type_de_repas: 'petit_dejeuner'
  });

  // Configuration des toasts
  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  // Fonction pour charger les repas
  const fetchMeals = async () => {
    try {
      setLoading(prev => ({ ...prev, meals: true }));
      const res = await Api.get('/api/recuperer/repas');
      
      let mealsData;
      if (res.data.repas && Array.isArray(res.data.repas)) {
        mealsData = res.data.repas;
      } else if (Array.isArray(res.data)) {
        mealsData = res.data;
      } else {
        mealsData = [];
      }
      
      setMeals(mealsData);
      toast.success('Liste des repas chargée avec succès', toastConfig);
    } catch (err) {
      toast.error('Échec du chargement des repas', toastConfig);
      console.error('Erreur fetchMeals:', err);
      setMeals([]);
    } finally {
      setLoading(prev => ({ ...prev, meals: false }));
    }
  };

  // Fonction pour charger les plans de repas
  const fetchMealPlans = async () => {
    try {
      setLoading(prev => ({ ...prev, plans: true }));
      const res = await Api.get('/api/recuperer/plannification');
  
      console.log("Réponse complète de l'API:", res.data);
      
      // Extraction des données selon votre structure API
      const plansArray = res.data.plannifications || [];
      
      if (!plansArray.length) {
        toast.info('Aucune planification trouvée', toastConfig);
        setEvents([]);
        return;
      }
  
      // Transformation des données en événements calendrier
      const formattedEvents = plansArray
        .map(plan => {
          // Validation des données requises
          if (!plan?.id || !plan?.date || !plan?.type_de_repas) {
            console.warn('Planification incomplète:', plan);
            return null;
          }
  
          try {
            // Formatage et validation de la date
            const eventDate = new Date(plan.date);
            if (isNaN(eventDate.getTime())) {
              console.error('Date invalide:', plan.date);
              return null;
            }
  
            // Création du titre (à adapter si vous avez accès au nom du repas)
            const mealName = `Repas #${plan.repas_id}`; // Temporaire - voir note ci-dessous
            const mealType = plan.type_de_repas;
  
            return {
              id: plan.id.toString(),
              title: `${mealName} (${mealType})`, // Ex: "Repas #3 (souper)"
              start: eventDate,
              end: eventDate,
              allDay: true,
              extendedProps: {
                repasId: plan.repas_id,
                typeRepas: plan.type_de_repas,
                createdAt: plan.created_at
              }
            };
          } catch (error) {
            console.error('Erreur de transformation:', error, plan);
            return null;
          }
        })
        .filter(Boolean);
  
      console.log('Événements formatés:', formattedEvents);
      setEvents(formattedEvents);
      toast.success(`${formattedEvents.length} planifications chargées`, toastConfig);
  
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur de chargement';
      toast.error(errorMessage, toastConfig);
      console.error('Erreur fetchMealPlans:', {
        error: err,
        response: err.response?.data
      });
      setEvents([]);
    } finally {
      setLoading(prev => ({ ...prev, plans: false }));
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchMeals();
    fetchMealPlans();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectSlot = ({ start }) => {
    setFormData(prev => ({ ...prev, date: start }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.repas_id) {
      toast.warning('Veuillez sélectionner un repas', toastConfig);
      return;
    }

    try {
      setLoading(prev => ({ ...prev, submitting: true }));
      
      const requestData = {
        repas_id: formData.repas_id,
        date: moment(formData.date).format('YYYY-MM-DD'),
        type_de_repas: formData.type_de_repas,
        utilisateur_id: user.id
      };

      await Api.post('/api/ajouter/plannification', requestData);
      
      toast.success('Repas planifié avec succès !', {
        ...toastConfig,
        autoClose: 5000
      });
      
      await fetchMealPlans();
      setFormData(prev => ({ ...prev, repas_id: '' }));
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la planification';
      toast.error(errorMessage, {
        ...toastConfig,
        autoClose: 5000
      });
      console.error('Erreur handleSubmit:', err);
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 text-center bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800">
            Veuillez vous connecter pour accéder au planificateur de repas
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="max-w-7xl mx-auto mt-16">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Planificateur de repas</h2>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <form onSubmit={handleSubmit} className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de repas</label>
                <select
                  name="type_de_repas"
                  value={formData.type_de_repas}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="petit_dejeuner">Petit-déjeuner</option>
                  <option value="dejeuner">Déjeuner</option>
                  <option value="diner">Dîner</option>
                  <option value="souper">Souper</option>
                  <option value="collation">Collation</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={moment(formData.date).format('YYYY-MM-DD')}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: new Date(e.target.value) }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading.submitting}
                className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading.submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </span>
                ) : 'Planifier'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Calendrier des repas</h3>
          </div>
          
          {loading.plans ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="p-4">
              <div className="h-[600px]">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  onSelectSlot={handleSelectSlot}
                  selectable
                  defaultView="week"
                  views={['month', 'week', 'day']}
                  messages={{
                    today: "Aujourd'hui",
                    previous: 'Précédent',
                    next: 'Suivant',
                    month: 'Mois',
                    week: 'Semaine',
                    day: 'Jour',
                    agenda: 'Agenda',
                    noEventsInRange: "Aucun repas planifié pour cette période."
                  }}
                  eventPropGetter={(event) => ({
                    style: {
                      backgroundColor: getEventColor(event.mealData?.type_de_repas),
                      borderColor: '#2563eb',
                      color: '#fff'
                    }
                  })}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper pour les couleurs des événements
const getEventColor = (mealType) => {
  switch(mealType) {
    case 'petit_dejeuner':
      return '#3b82f6'; // blue-500
    case 'dejeuner':
      return '#10b981'; // emerald-500
    case 'diner':
      return '#8b5cf6'; // violet-500
    case 'collation':
      return '#f59e0b'; // amber-500
    default:
      return '#64748b'; // slate-500
  }
};

export default MealPlanner;