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
  
  // États communs
  const [loading, setLoading] = useState({
    profile: false,
    conditions: false,
    patients: false,
    stats: false,
    users: false
  });
  
  // États pour patient
  const [conditions, setConditions] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  
  // États pour nutritionniste
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour admin
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user?.healthConditions) {
      setSelectedConditions(user.healthConditions);
    }
    
    fetchConditions();
    
    if (user?.role === 'nutritionniste') {
      fetchPatients();
    } else if (user?.role === 'admin') {
      fetchStats();
      fetchAllUsers();
    }
  }, [user]);

  // Fonctions API communes
  const fetchConditions = async () => {
    try {
      setLoading(prev => ({ ...prev, conditions: true }));
      const response = await Api.get('/api/health-conditions');
      setConditions(response.data.data || response.data);
    } catch (error) {
      handleApiError(error, 'le chargement des conditions');
    } finally {
      setLoading(prev => ({ ...prev, conditions: false }));
    }
  };

  // Fonctions pour patient
  const handleConditionToggle = (conditionId) => {
    setSelectedConditions(prev => 
      prev.includes(conditionId)
        ? prev.filter(id => id !== conditionId)
        : [...prev, conditionId]
    );
  };

  // Fonctions pour nutritionniste
  const fetchPatients = async () => {
    try {
      setLoading(prev => ({ ...prev, patients: true }));
      const response = await Api.get('/api/patients');
      setPatients(response.data.data || response.data);
    } catch (error) {
      handleApiError(error, 'le chargement des patients');
    } finally {
      setLoading(prev => ({ ...prev, patients: false }));
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonctions pour admin
  const fetchStats = async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      const response = await Api.get('/admin/stats');
      setStats(response.data.data || response.data);
    } catch (error) {
      handleApiError(error, 'le chargement des statistiques');
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  const fetchAllUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const response = await Api.get('/admin/users');
      setUsers(response.data.data || response.data);
    } catch (error) {
      handleApiError(error, 'le chargement des utilisateurs');
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  // Gestion des erreurs
  const handleUnauthorized = () => {
    logout();
    toast.error('Votre session a expiré, veuillez vous reconnecter');
    navigate('/login', { state: { from: location }, replace: true });
  };

  const handleApiError = (error, context) => {
    console.error(`Erreur lors de ${context}:`, error);
    
    let errorMessage = "Une erreur est survenue";
    if (error.response) {
      if (error.response.status === 401) {
        handleUnauthorized();
        return;
      }
      errorMessage = error.response.data?.message || errorMessage;
    }

    toast.error(`${errorMessage} (${context})`);
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (user?.role === 'patient' && selectedConditions.length === 0) {
      toast.warn('Veuillez sélectionner au moins une condition');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, profile: true }));
      
      const response = await Api.put('/profile', {
        health_conditions: selectedConditions,
        // Autres champs selon le rôle
      });

      updateProfile(response.data.user);
      toast.success('Profil mis à jour avec succès!');
    } catch (error) {
      handleApiError(error, 'la mise à jour du profil');
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  // Affichage du loading
  if (loading.conditions && user?.role === 'patient') {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 mt-16">
      {/* Section commune à tous */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <UserHeader user={user} />
        
        {user?.role === 'patient' && (
          <PatientForm
            conditions={conditions}
            selectedConditions={selectedConditions}
            handleConditionToggle={handleConditionToggle}
            handleSubmit={handleSubmit}
            loading={loading.profile}
          />
        )}
      </div>

      {/* Section nutritionniste */}
      {user?.role === 'nutritionniste' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Mes patients</h2>
            <input
              type="text"
              placeholder="Rechercher un patient..."
              className="px-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {loading.patients ? (
            <LoadingSpinner />
          ) : (
            <PatientTable patients={filteredPatients} />
          )}
        </div>
      )}

      {/* Section admin */}
      {user?.role === 'admin' && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Statistiques</h2>
            <AdminStats stats={stats} loading={loading.stats} />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Utilisateurs</h2>
            {loading.users ? (
              <LoadingSpinner />
            ) : (
              <UserManagement users={users} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Composants enfants
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const UserHeader = ({ user }) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
    <div className="flex items-center space-x-4 mb-4 md:mb-0">
      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
        {user?.name?.charAt(0) || 'U'}
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-800">{user?.name}</h3>
        <p className="text-gray-600">{user?.email}</p>
        <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {user?.role === 'admin' ? 'Administrateur' : 
           user?.role === 'nutritionniste' ? 'Nutritionniste' : 'Patient'}
        </span>
      </div>
    </div>
    <div className="flex space-x-2">
      <button className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200">
        Modifier le profil
      </button>
      {user?.role !== 'patient' && (
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {user?.role === 'nutritionniste' ? 'Ajouter un patient' : 'Ajouter un utilisateur'}
        </button>
      )}
    </div>
  </div>
);

const PatientForm = ({ 
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
    <button
      type="submit"
      disabled={loading}
      className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
        loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {loading ? 'Enregistrement...' : 'Mettre à jour mon profil'}
    </button>
  </form>
);

const PatientTable = ({ patients }) => (
  <div className="overflow-x-auto">
    {patients.length > 0 ? (
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière consultation</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progression</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {patients.map(patient => (
            <tr key={patient.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    {patient.nom?.charAt(0) || 'P'}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{patient.nom || 'Non renseigné'}</div>
                    <div className="text-sm text-gray-500">{patient.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {patient.updated_at ? new Date(patient.updated_at).toLocaleDateString() : 'Jamais'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${patient.progress || 0}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 mt-1">{patient.progress || 0}%</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 mr-4">Voir</button>
                <button className="text-green-600 hover:text-green-900">Message</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div className="bg-gray-50 p-8 text-center rounded-lg">
        <p className="text-gray-500">Aucun patient trouvé</p>
      </div>
    )}
  </div>
);

const AdminStats = ({ stats, loading }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {loading ? (
      <LoadingSpinner />
    ) : (
      <>
        <StatCard 
          title="Utilisateurs" 
          value={stats?.total_users} 
          icon="👥"
          trend={stats?.user_growth}
        />
        <StatCard 
          title="Nutritionnistes" 
          value={stats?.total_nutritionists} 
          icon="👩‍⚕️"
          trend={stats?.nutritionist_growth}
        />
        <StatCard 
          title="Consultations" 
          value={stats?.total_consultations} 
          icon="📅"
          trend={stats?.consultation_growth}
        />
      </>
    )}
  </div>
);

const StatCard = ({ title, value, icon, trend }) => (
  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
    <div className="flex justify-between">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <span className="text-2xl">{icon}</span>
    </div>
    <div className="mt-2 flex items-baseline">
      <span className="text-3xl font-bold text-gray-900">{value || '0'}</span>
      {trend !== undefined && (
        <span className={`ml-2 text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
  </div>
);

const UserManagement = ({ users }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {users.map(user => (
          <tr key={user.id}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                user.role === 'nutritionniste' ? 'bg-green-100 text-green-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {user.role === 'admin' ? 'Admin' : 
                 user.role === 'nutritionniste' ? 'Nutritionniste' : 'Patient'}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.is_active ? 'Actif' : 'Inactif'}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button className="text-indigo-600 hover:text-indigo-900 mr-3">Éditer</button>
              <button className="text-red-600 hover:text-red-900">Supprimer</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Profile;