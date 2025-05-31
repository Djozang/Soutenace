import React, { useState } from 'react';
export const SystemSettings = () => {
  const [system, setSystem] = useState({
    cacheEnabled: true,
    cacheDuration: 3600,
    backupFrequency: 'daily',
    backupTime: '02:00'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSystem(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleClearCache = () => {
    // Implémentez la logique de vidage du cache
    alert('Cache vidé avec succès');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="cacheEnabled"
                checked={system.cacheEnabled}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <label className="ml-2 text-sm text-slate-300">Activer le cache</label>
            </div>
            <button 
              onClick={handleClearCache}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Vider le cache
            </button>
          </div>
          
          {system.cacheEnabled && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Durée du cache (secondes)
              </label>
              <input
                type="number"
                name="cacheDuration"
                min="60"
                max="86400"
                value={system.cacheDuration}
                onChange={handleChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Sauvegarde</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Fréquence</label>
            <select
              name="backupFrequency"
              value={system.backupFrequency}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="daily">Quotidienne</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuelle</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Heure de sauvegarde</label>
            <input
              type="time"
              name="backupTime"
              value={system.backupTime}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};