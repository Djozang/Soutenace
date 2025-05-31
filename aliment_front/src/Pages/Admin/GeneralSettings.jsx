export const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    appName: 'NutriTrack Pro',
    defaultLanguage: 'fr',
    timezone: 'Europe/Paris',
    maintenanceMode: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      await Api.put('/api/settings/general', settings);
      alert('Paramètres enregistrés avec succès');
    } catch (error) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Application</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nom de l'application</label>
            <input
              name="appName"
              value={settings.appName}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label className="ml-2 text-sm text-slate-300">Mode maintenance</label>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Préférences régionales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Langue par défaut</label>
            <select
              name="defaultLanguage"
              value={settings.defaultLanguage}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Fuseau horaire</label>
            <select
              name="timezone"
              value={settings.timezone}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="Europe/Paris">Paris (UTC+2)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">New York (UTC-5)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
};