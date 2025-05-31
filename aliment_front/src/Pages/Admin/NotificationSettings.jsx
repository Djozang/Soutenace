import React, { useState } from 'react';
export const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    emailEnabled: true,
    pushEnabled: false,
    emailAddress: '',
    notifyNewUser: true,
    notifyError: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTestNotification = () => {
    // Implémentez l'envoi d'une notification de test
    alert('Notification de test envoyée');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Canaux de notification</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="emailEnabled"
              checked={notifications.emailEnabled}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label className="ml-2 text-sm text-slate-300">Notifications par email</label>
          </div>
          
          {notifications.emailEnabled && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email de notification</label>
              <input
                type="email"
                name="emailAddress"
                value={notifications.emailAddress}
                onChange={handleChange}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              />
            </div>
          )}
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="pushEnabled"
              checked={notifications.pushEnabled}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label className="ml-2 text-sm text-slate-300">Notifications push</label>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Préférences</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="notifyNewUser"
              checked={notifications.notifyNewUser}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label className="ml-2 text-sm text-slate-300">Me notifier lors de l'inscription d'un nouvel utilisateur</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="notifyError"
              checked={notifications.notifyError}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label className="ml-2 text-sm text-slate-300">Me notifier des erreurs système</label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleTestNotification}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Envoyer une notification de test
        </button>
      </div>
    </div>
  );
};