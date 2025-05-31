import React, { useState, useEffect } from 'react';
import Api from '../services/Api';
import { useAuth } from '../Contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [conditions, setConditions] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [loading, setLoading] = useState({
    conditions: false,
    profile: false,
    patients: false
  });
  const [patients, setPatients] = useState([]); // Pour nutritionniste
  const [stats, setStats] = useState(null); // Pour admin

  useEffect(() => {
    if (user?.healthConditions) {
      setSelectedConditions(user.healthConditions);
    }
    fetchConditions();
    
    // Chargements spécifiques selon le rôle
    if (user?.role === 'nutritionist') {
      fetchPatients();
    } else if (user?.role === 'admin') {
      fetchStats();
    }
  }, [user]);

  const fetchConditions = async () => {
    try {
      setLoading(prev => ({ ...prev, conditions: true }));
      const response = await Api.get('/health-conditions');
      setConditions(response.data.data || response.data);
    } catch (error) {
      handleApiError(error, 'le chargement des conditions');
    } finally {
      setLoading(prev => ({ ...prev, conditions: false }));
    }
  };

  const fetchPatients = async () => {
    try {
      setLoading(prev => ({ ...prev, patients: true }));
      const response = await Api.get('/nutritionist/patients');
      setPatients(response.data.data || response.data);
    } catch (error) {
      handleApiError(error, 'le chargement des patients');
    } finally {
      setLoading(prev => ({ ...prev, patients: false }));
    }
  };

  const fetchStats = async () => {
    try {
      const response = await Api.get('/admin/stats');
      setStats(response.data.data || response.data);
    } catch (error) {
      handleApiError(error, 'le chargement des statistiques');
    }
  };

  // ... (handleUnauthorized, handleApiError, handleConditionToggle restent identiques)

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedConditions.length === 0 && user?.role === 'patient') {
      toast.warn('Veuillez sélectionner au moins une condition');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, profile: true }));
      
      const response = await Api.put('/profile', {
        health_conditions: selectedConditions,
        nom: user.nom,
        email: user.email,
        
        
      });

      updateProfile(response.data.user);

      toast.success('Profil mis à jour avec succès!');
    } catch (error) {
      handleApiError(error, 'la mise à jour du profil');
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  if (loading.conditions) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Section commune à tous les rôles */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {user?.role === 'admin' ? 'Tableau de bord administrateur' : 
           user?.role === 'nutritionist' ? 'Espace professionnel' : 'Mon profil santé'}
        </h1>
        
        <UserInfoSection user={user} />
        
        {user?.role === 'patient' && (
          <PatientConditions 
            conditions={conditions}
            selectedConditions={selectedConditions}
            handleConditionToggle={handleConditionToggle}
            handleSubmit={handleSubmit}
            loading={loading.profile}
          />
        )}
      </div>

      {/* Section spécifique nutritionniste */}
      {user?.role === 'nutritionist' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Mes patients</h2>
          {loading.patients ? (
            <LoadingSpinner />
          ) : (
            <PatientList patients={patients} />
          )}
        </div>
      )}

      {/* Section spécifique admin */}
      {user?.role === 'admin' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistiques globales</h2>
          <AdminStats stats={stats} />
        </div>
      )}
    </div>
  );
};

// Composants séparés pour plus de clarté
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const UserInfoSection = ({ user }) => (
  <div className="mb-6">
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
        {user?.name?.charAt(0) || 'U'}
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-800">{user?.name}</h3>
        <p className="text-gray-600">{user?.email}</p>
        <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {user?.role === 'admin' ? 'Administrateur' : 
           user?.role === 'nutritionist' ? 'Nutritionniste' : 'Patient'}
        </span>
      </div>
    </div>
  </div>
);

const PatientConditions = ({ 
  conditions, 
  selectedConditions, 
  handleConditionToggle, 
  handleSubmit, 
  loading 
}) => (
  <form onSubmit={handleSubmit} className="space-y-6">
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Conditions médicales</h2>
      {conditions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-2">
          {conditions.map(condition => (
            <ConditionCheckbox 
              key={condition.id}
              condition={condition}
              checked={selectedConditions.includes(condition.id)}
              onChange={handleConditionToggle}
            />
          ))}
        </div>
      ) : (
        <EmptyState message="Aucune condition disponible" />
      )}
    </div>
    <SubmitButton loading={loading} text="Mettre à jour mon profil" />
  </form>
);

const ConditionCheckbox = ({ condition, checked, onChange }) => (
  <div className="flex items-start space-x-3">
    <input
      type="checkbox"
      id={`condition-${condition.id}`}
      checked={checked}
      onChange={() => onChange(condition.id)}
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
);

const PatientList = ({ patients }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière consultation</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progression</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {patients.map(patient => (
          <tr key={patient.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  {patient.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                  <div className="text-sm text-gray-500">{patient.email}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(patient.last_consultation).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${patient.progress}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 mt-1">{patient.progress}%</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {patients.length === 0 && <EmptyState message="Aucun patient suivi pour le moment" />}
  </div>
);

const AdminStats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <StatCard 
      title="Utilisateurs actifs" 
      value={stats?.active_users} 
      icon="👥" 
      trend={stats?.users_trend}
    />
    <StatCard 
      title="Nouveaux ce mois" 
      value={stats?.new_users} 
      icon="🆕" 
      trend={stats?.new_users_trend}
    />
    <StatCard 
      title="Consultations" 
      value={stats?.consultations} 
      icon="📅" 
      trend={stats?.consultations_trend}
    />
  </div>
);

const StatCard = ({ title, value, icon, trend }) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <div className="flex justify-between">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <span className="text-2xl">{icon}</span>
    </div>
    <div className="mt-2 flex items-baseline">
      <span className="text-3xl font-bold text-gray-900">{value || '-'}</span>
      {trend && (
        <span className={`ml-2 text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="bg-gray-50 p-4 rounded-lg text-center">
    <p className="text-gray-500">{message}</p>
  </div>
);

const SubmitButton = ({ loading, text }) => (
  <button
    type="submit"
    disabled={loading}
    className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
      loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
    }`}
  >
    {loading ? (
      <span className="flex items-center justify-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Enregistrement...
      </span>
    ) : (
      text
    )}
  </button>
);

export default Profile;