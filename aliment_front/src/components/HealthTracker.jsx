import React, { useState, useEffect } from 'react';
import Api from '../services/Api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../Contexts/AuthContext';

const HealthTracker = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    poids: '',
    tension: '',
    temperature: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    if (!user) return;
    
    const fetchHealthData = async () => {
      setLoading(true);
      try {
        const res = await Api.get('/api/health-parameters', {
          params: { range: timeRange }
        });
        setHealthData(res.data);
      } catch (err) {
        console.error('Failed to fetch health data', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHealthData();
  }, [user, timeRange]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Api.post('/api/health-parameters', formData);
      const res = await Api.get('/api/health-parameters');
      setHealthData(res.data);
      setFormData({
        poids: '',
        tension: '',
        temperature: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      console.error('Failed to save health data', err);
    }
  };

  if (!user) return <div>Veuillez vous connecter</div>;

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto mt-16">
        <h2 className="text-2xl font-bold mb-6">Suivi de votre santé</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire de saisie */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Ajouter des mesures</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Poids (kg)</label>
                <input
                  type="number"
                  name="poids"
                  value={formData.poids}
                  onChange={(e) => setFormData({...formData, poids: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Tension artérielle</label>
                <input
                  type="text"
                  name="tension"
                  value={formData.tension}
                  onChange={(e) => setFormData({...formData, tension: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 12/8"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Température (°C)</label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  step="0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Enregistrer
              </button>
            </form>
          </div>
          
          {/* Graphiques et historique */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Évolution de votre santé</h3>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1"
                >
                  <option value="week">7 derniers jours</option>
                  <option value="month">30 derniers jours</option>
                  <option value="year">12 derniers mois</option>
                </select>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" orientation="left" domain={['dataMin - 5', 'dataMax + 5']} />
                      <YAxis yAxisId="right" orientation="right" domain={[35, 40]} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="poids" stroke="#8884d8" name="Poids (kg)" />
                      <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#82ca9d" name="Température (°C)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Historique complet</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poids (kg)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tension</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Température (°C)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {healthData.map((entry, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.poids || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.tension || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.temperature || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTracker;