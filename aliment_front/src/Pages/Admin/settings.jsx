import React, { useState } from 'react';
import { 
  Settings, 
  Lock, 
  UserCog, 
  Server, 
  Mail, 
  Globe, 
  Database,
  Shield,
  Bell,
  FileText
} from 'lucide-react';
// import { UserManagement } from './UserManagement';
import { SystemSettings } from './SystemSettings';
import { NotificationSettings } from './NotificationSettings';

const AdminSettings = () => {
  const [activeSection, setActiveSection] = useState('general');

  const settingsSections = [
    {
      id: 'general',
      title: 'Paramètres Généraux',
      icon: <Settings className="w-5 h-5" />,
      content: <GeneralSettings />
    },
    {
      id: 'security',
      title: 'Sécurité',
      icon: <Lock className="w-5 h-5" />,
      content: <SecuritySettings />
    },
    // {
    //   id: 'users',
    //   title: 'Gestion des Utilisateurs',
    //   icon: <UserCog className="w-5 h-5" />,
    //   content: <UserManagement />
    // },
    {
      id: 'system',
      title: 'Configuration Système',
      icon: <Server className="w-5 h-5" />,
      content: <SystemSettings />
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      content: <NotificationSettings />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 rounded-xl bg-blue-900/30">
            <Settings className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Administration</h1>
            <p className="text-slate-400">Configuration du système et des paramètres avancés</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
            <div className="space-y-1">
              {settingsSections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <div className="text-blue-400">
                    {section.icon}
                  </div>
                  <span className="font-medium">{section.title}</span>
                </button>
              ))}
            </div>

            {/* System Status */}
            <div className="mt-8 p-4 bg-slate-800/30 rounded-xl border border-slate-700">
              <h3 className="text-sm font-semibold text-slate-400 mb-3">État du système</h3>
              <div className="space-y-3">
                <StatusItem 
                  icon={<Server className="w-4 h-4" />}
                  label="Serveur"
                  status="operational"
                  value="100%"
                />
                <StatusItem 
                  icon={<Database className="w-4 h-4" />}
                  label="Base de données"
                  status="operational"
                  value="Connecté"
                />
                <StatusItem 
                  icon={<Shield className="w-4 h-4" />}
                  label="Sécurité"
                  status="warning"
                  value="2 alertes"
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white flex items-center space-x-3">
                  {settingsSections.find(s => s.id === activeSection)?.icon}
                  <span>{settingsSections.find(s => s.id === activeSection)?.title}</span>
                </h2>
              </div>
              <div className="p-6">
                {settingsSections.find(s => s.id === activeSection)?.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Example Settings Components
const GeneralSettings = () => (
  <div className="space-y-6">
    <SettingCard 
      title="Paramètres de l'application"
      description="Configuration générale de l'application"
    >
      <div className="space-y-4">
        <InputField 
          label="Nom de l'application"
          value="Suivie Alimentaire"
          onChange={() => {}}
        />
        <InputField 
          label="URL de base"
          value="https://suivi-alimentaire.example.com"
          onChange={() => {}}
        />
        <ToggleField 
          label="Mode maintenance"
          description="Activer pour mettre l'application en maintenance"
          checked={false}
          onChange={() => {}}
        />
      </div>
    </SettingCard>

    <SettingCard 
      title="Paramètres régionaux"
      description="Langue et formats régionaux"
    >
      <div className="space-y-4">
        <SelectField 
          label="Langue par défaut"
          options={['Français', 'English', 'Español']}
          value="Français"
          onChange={() => {}}
        />
        <SelectField 
          label="Fuseau horaire"
          options={['UTC', 'Europe/Paris', 'America/New_York']}
          value="Europe/Paris"
          onChange={() => {}}
        />
      </div>
    </SettingCard>
  </div>
);

const SecuritySettings = () => (
  <div className="space-y-6">
    <SettingCard 
      title="Politique de sécurité"
      description="Configuration des paramètres de sécurité"
    >
      <div className="space-y-4">
        <ToggleField 
          label="Authentification à deux facteurs"
          description="Exiger 2FA pour tous les administrateurs"
          checked={true}
          onChange={() => {}}
        />
        <InputField 
          label="Durée de session (minutes)"
          type="number"
          value="30"
          onChange={() => {}}
        />
        <ToggleField 
          label="Protection contre les attaques par force brute"
          checked={true}
          onChange={() => {}}
        />
      </div>
    </SettingCard>

    <SettingCard 
      title="Liste blanche IP"
      description="Restreindre l'accès à certaines adresses IP"
    >
      <div className="space-y-4">
        <TextAreaField 
          label="Adresses IP autorisées"
          description="Une adresse IP par ligne"
          value="192.168.1.1\n10.0.0.1"
          onChange={() => {}}
        />
      </div>
    </SettingCard>
  </div>
);

// UI Components
const SettingCard = ({ title, description, children }) => (
  <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-5">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
    {children}
  </div>
);

const InputField = ({ label, value, onChange, type = 'text' }) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const SelectField = ({ label, options, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

const ToggleField = ({ label, description, checked, onChange }) => (
  <div className="flex items-start">
    <div className="flex items-center h-5">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-700"
      />
    </div>
    <div className="ml-3 text-sm">
      <label className="font-medium text-slate-300">{label}</label>
      {description && <p className="text-slate-400">{description}</p>}
    </div>
  </div>
);

const TextAreaField = ({ label, description, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
    {description && <p className="text-xs text-slate-400 mb-2">{description}</p>}
    <textarea
      value={value}
      onChange={onChange}
      rows={4}
      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const StatusItem = ({ icon, label, status, value }) => {
  const statusColors = {
    operational: 'text-green-400',
    warning: 'text-yellow-400',
    critical: 'text-red-400'
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${statusColors[status]}`}></div>
        <div className="text-slate-400">{icon}</div>
        <span className="text-slate-300 text-sm">{label}</span>
      </div>
      <span className={`text-xs font-medium ${statusColors[status]}`}>{value}</span>
    </div>
  );
};

export default AdminSettings;