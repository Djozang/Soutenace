export const SecuritySettings = () => {
  const [security, setSecurity] = useState({
    twoFactorAuth: true,
    passwordComplexity: 'medium',
    loginAttempts: 5,
    sessionTimeout: 30
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSecurity(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Authentification</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="twoFactorAuth"
              checked={security.twoFactorAuth}
              onChange={(e) => setSecurity(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label className="ml-2 text-sm text-slate-300">Authentification à deux facteurs requise</label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Complexité des mots de passe</label>
            <select
              name="passwordComplexity"
              value={security.passwordComplexity}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Élevée</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Sécurité des sessions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Tentatives de connexion avant blocage ({security.loginAttempts})
            </label>
            <input
              type="range"
              name="loginAttempts"
              min="1"
              max="10"
              value={security.loginAttempts}
              onChange={handleChange}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Délai d'expiration de session (minutes)
            </label>
            <input
              type="number"
              name="sessionTimeout"
              min="5"
              max="1440"
              value={security.sessionTimeout}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};