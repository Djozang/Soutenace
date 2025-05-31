import React, { useState, useEffect } from 'react';
import Api from '../../services/Api';
import icon from '../../assets/icons.png';
import { 
  Shield, 
  Users, 
  Settings, 
  BarChart3, 
  Database, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Activity,
  Server,
  Globe,
  Lock,
  UserCheck,
  Trash2,
  Edit3,
  Eye,
  TrendingUp,
  TrendingDown,
  Clock,
  Mail,
  FileText,
  Zap
} from 'lucide-react';

import { useAuth } from '../../Contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState({});
  const [securityAlerts, setSecurityAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const [statsRes, usersRes, activitiesRes, systemRes, securityRes] = await Promise.all([
          Api.get('/api/admin/stats'),
          Api.get('/api/admin/users'),
          Api.get('/api/admin/activities'),
          Api.get('/api/admin/system'),
        //   Api.get('/api/admin/security')
        ]);

        setStats(statsRes.data);
        setUsers(usersRes.data);
        setActivities(activitiesRes.data);
        setSystemMetrics(systemRes.data);
        setSecurityAlerts(securityRes?.data || []);
      } catch (err) {
        setError('Erreur lors du chargement des données administrateur');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Accès Administrateur Requis</h3>
        <p className="text-gray-600">Connexion avec privilèges administrateur nécessaire.</p>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-300">Chargement du panneau administrateur...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 mt-16">
      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AdminPanel Pro
                </h1>
                <p className="text-sm text-slate-400">Panneau de contrôle système</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-green-900/50 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">Système OK</span>
                </div>
                <div className="text-slate-400 text-sm">
                  Uptime: {stats.server_uptime}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="font-semibold text-white">{user.nom}</p>
                  <p className="text-sm text-slate-400">{user.role}</p>
                </div>
                <img 
                  src={icon} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full border-2 border-blue-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="bg-red-900/50 border border-red-500 p-4 mb-6 rounded-xl">
            <p className="text-red-300 font-medium">{error}</p>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-800/50 p-1 rounded-xl">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'users', label: 'Utilisateurs', icon: <Users className="w-4 h-4" /> },
            { id: 'system', label: 'Système', icon: <Server className="w-4 h-4" /> },
            { id: 'security', label: 'Sécurité', icon: <Lock className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AdminStatCard
                title="Utilisateurs Total"
                value={stats.total_users?.toLocaleString() || '0'}
                icon={<Users className="w-6 h-6" />}
                color="from-blue-500 to-blue-600"
                trend={`+${stats.new_users_today || 0} aujourd'hui`}
                trendUp={true}
              />
              <AdminStatCard
                title="Sessions Actives"
                value={stats.active_sessions || 0}
                icon={<Activity className="w-6 h-6" />}
                color="from-green-500 to-green-600"
                trend="En temps réel"
                trendUp={true}
              />
              <AdminStatCard
                title="Nutritionnistes"
                value={stats.total_nutritionnistes || 0}
                icon={<UserCheck className="w-6 h-6" />}
                color="from-purple-500 to-purple-600"
                trend="Professionnels actifs"
                trendUp={true}
              />
              <AdminStatCard
                title="Stockage Utilisé"
                value={`${stats.storage_used || 0}%`}
                icon={<Database className="w-6 h-6" />}
                color="from-orange-500 to-orange-600"
                trend="Capacité disponible"
                trendUp={false}
              />
            </div>

            {/* Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activities */}
              <AdminCard title="Activités Récentes" icon={<Clock className="w-5 h-5" />}>
                <div className="space-y-3">
                  {activities.slice(0, 6).map((activity, index) => (
                    <div 
                      key={activity.id || `activity-${index}`} 
                      className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600"
                    >
                      <div className={`w-3 h-3 rounded-full ${
                        activity.type === 'success' ? 'bg-green-400' :
                        activity.type === 'warning' ? 'bg-yellow-400' :
                        activity.type === 'danger' ? 'bg-red-400' : 'bg-blue-400'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.action}</p>
                        <p className="text-slate-400 text-sm">{activity.user} • {activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AdminCard>

              {/* System Health */}
              <AdminCard title="État du Système" icon={<Server className="w-5 h-5" />}>
                <div className="space-y-4">
                  <MetricBar label="CPU" value={systemMetrics.cpu_usage || 0} color="blue" />
                  <MetricBar label="Mémoire" value={systemMetrics.memory_usage || 0} color="green" />
                  <MetricBar label="Disque" value={systemMetrics.disk_usage || 0} color="purple" />
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-600">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">{systemMetrics.active_connections || 0}</p>
                      <p className="text-slate-400 text-sm">Connexions actives</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-400">{systemMetrics.response_time || 0}ms</p>
                      <p className="text-slate-400 text-sm">Temps de réponse</p>
                    </div>
                  </div>
                </div>
              </AdminCard>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <AdminCard title="Gestion des Utilisateurs" icon={<Users className="w-5 h-5" />}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Ajouter Utilisateur
                  </button>
                  <button className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Exporter
                  </button>
                </div>
                <div className="text-slate-400">
                  {users.length} utilisateurs au total
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="text-left py-3 px-4 text-slate-300 font-medium">Utilisateur</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-medium">Rôle</th>

                      <th className="text-left py-3 px-4 text-slate-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr 
                        key={user.id || `user-${index}`} 
                        className="border-b border-slate-700 hover:bg-slate-700/30"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-white font-medium">{user.nom}</p>
                            <p className="text-slate-400 text-sm">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'Nutritionniste' ? 'bg-purple-900/50 text-purple-300' : 'bg-blue-900/50 text-blue-300'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-400 hover:text-blue-300 p-1">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-400 hover:text-green-300 p-1">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button className="text-red-400 hover:text-red-300 p-1">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AdminCard>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AdminCard title="Métriques Système" icon={<Server className="w-5 h-5" />}>
              <div className="space-y-6">
                <MetricBar label="Utilisation CPU" value={systemMetrics.cpu_usage || 0} color="blue" showValue />
                <MetricBar label="Utilisation Mémoire" value={systemMetrics.memory_usage || 0} color="green" showValue />
                <MetricBar label="Utilisation Disque" value={systemMetrics.disk_usage || 0} color="purple" showValue />
                
                <div className="pt-4 border-t border-slate-600">
                  <h4 className="text-white font-medium mb-4">Réseau</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <p className="text-slate-400 text-sm">Entrant</p>
                      <p className="text-green-400 font-bold">{systemMetrics.network_in || 0} MB/s</p>
                    </div>
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <p className="text-slate-400 text-sm">Sortant</p>
                      <p className="text-blue-400 font-bold">{systemMetrics.network_out || 0} MB/s</p>
                    </div>
                  </div>
                </div>
              </div>
            </AdminCard>

            <AdminCard title="Actions Système" icon={<Settings className="w-5 h-5" />}>
              <div className="space-y-3">
                <ActionButton 
                  icon={<Database className="w-4 h-4" />}
                  text="Sauvegarder Base de Données"
                  color="bg-blue-600 hover:bg-blue-700"
                />
                <ActionButton 
                  icon={<Zap className="w-4 h-4" />}
                  text="Redémarrer Services"
                  color="bg-yellow-600 hover:bg-yellow-700"
                />
                <ActionButton 
                  icon={<FileText className="w-4 h-4" />}
                  text="Générer Rapport"
                  color="bg-green-600 hover:bg-green-700"
                />
                <ActionButton 
                  icon={<Settings className="w-4 h-4" />}
                  text="Configuration Système"
                  color="bg-purple-600 hover:bg-purple-700"
                />
                <ActionButton 
                  icon={<Mail className="w-4 h-4" />}
                  text="Test Notifications"
                  color="bg-indigo-600 hover:bg-indigo-700"
                />
              </div>
            </AdminCard>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-8">
            {/* Security Alerts */}
            <AdminCard title="Alertes de Sécurité" icon={<AlertTriangle className="w-5 h-5" />}>
              <div className="space-y-3">
                {securityAlerts.map((alert, index) => (
                  <div 
                    key={alert.id || `alert-${index}`}
                    className={`p-4 rounded-lg border ${
                      alert.severity === 'high' ? 'bg-red-900/20 border-red-500/50' :
                      alert.severity === 'medium' ? 'bg-yellow-900/20 border-yellow-500/50' :
                      'bg-blue-900/20 border-blue-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className={`w-5 h-5 ${
                          alert.severity === 'high' ? 'text-red-400' :
                          alert.severity === 'medium' ? 'text-yellow-400' :
                          'text-blue-400'
                        }`} />
                        <div>
                          <p className="text-white font-medium">{alert.type}</p>
                          <p className="text-slate-400 text-sm">IP: {alert.ip} • {alert.timestamp}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.severity === 'high' ? 'bg-red-900/50 text-red-300' :
                        alert.severity === 'medium' ? 'bg-yellow-900/50 text-yellow-300' :
                        'bg-blue-900/50 text-blue-300'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>

            {/* Security Actions */}
            <AdminCard title="Actions de Sécurité" icon={<Lock className="w-5 h-5" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ActionButton 
                  icon={<Shield className="w-4 h-4" />}
                  text="Scanner Vulnérabilités"
                  color="bg-red-600 hover:bg-red-700"
                />
                <ActionButton 
                  icon={<Lock className="w-4 h-4" />}
                  text="Bloquer IP Suspectes"
                  color="bg-orange-600 hover:bg-orange-700"
                />
                <ActionButton 
                  icon={<FileText className="w-4 h-4" />}
                  text="Audit de Sécurité"
                  color="bg-purple-600 hover:bg-purple-700"
                />
                <ActionButton 
                  icon={<Settings className="w-4 h-4" />}
                  text="Configurer Firewall"
                  color="bg-slate-600 hover:bg-slate-700"
                />
              </div>
            </AdminCard>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminStatCard = ({ title, value, icon, color, trend, trendUp }) => (
  <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
        {icon}
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-white">{value}</p>
        <div className="flex items-center justify-end space-x-1 mt-1">
          {trendUp ? (
            <TrendingUp className="w-3 h-3 text-green-400" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red-400" />
          )}
          <p className="text-xs text-slate-400">{trend}</p>
        </div>
      </div>
    </div>
    <h3 className="font-semibold text-slate-300">{title}</h3>
  </div>
);

const AdminCard = ({ title, children, icon }) => (
  <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700 hover:border-slate-600 transition-all duration-300">
    <div className="p-6 border-b border-slate-700">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-900/50 rounded-lg flex items-center justify-center">
          <div className="text-blue-400">{icon}</div>
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const MetricBar = ({ label, value, color, showValue = false }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <span className="text-slate-300 font-medium">{label}</span>
      {showValue && <span className="text-slate-400">{value}%</span>}
    </div>
    <div className="w-full bg-slate-700 rounded-full h-2">
      <div 
        className={`h-2 rounded-full bg-gradient-to-r ${
          color === 'blue' ? 'from-blue-500 to-blue-400' :
          color === 'green' ? 'from-green-500 to-green-400' :
          color === 'purple' ? 'from-purple-500 to-purple-400' :
          'from-gray-500 to-gray-400'
        }`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

const ActionButton = ({ icon, text, color }) => (
  <button className={`w-full ${color} text-white p-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-3 hover:scale-105 hover:shadow-lg`}>
    {icon}
    <span>{text}</span>
  </button>
);

export default AdminDashboard;