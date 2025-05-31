import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Heart, Activity, AlertTriangle, FileText, Save, X, Upload, Camera } from 'lucide-react';

const AddPatientForm = ({ isOpen, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations personnelles
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    postalCode: '',
    emergencyContact: '',
    emergencyPhone: '',
    
    // Informations médicales
    height: '',
    currentWeight: '',
    targetWeight: '',
    activityLevel: '',
    medicalConditions: [],
    medications: '',
    allergies: '',
    dietaryRestrictions: [],
    smokingStatus: '',
    alcoholConsumption: '',
    
    // Objectifs et préférences
    primaryGoal: '',
    timeline: '',
    previousDiets: '',
    foodPreferences: [],
    dislikedFoods: '',
    cookingSkills: '',
    budgetRange: '',
    mealPrepTime: '',
    
    // Notes et observations
    initialConsultationNotes: '',
    specialRequirements: '',
    motivationLevel: '',
    supportSystem: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'Le prénom est requis';
      if (!formData.lastName) newErrors.lastName = 'Le nom est requis';
      if (!formData.email) newErrors.email = 'L\'email est requis';
      if (!formData.phone) newErrors.phone = 'Le téléphone est requis';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'La date de naissance est requise';
      if (!formData.gender) newErrors.gender = 'Le genre est requis';
    }
    
    if (step === 2) {
      if (!formData.height) newErrors.height = 'La taille est requise';
      if (!formData.currentWeight) newErrors.currentWeight = 'Le poids actuel est requis';
      if (!formData.activityLevel) newErrors.activityLevel = 'Le niveau d\'activité est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSave(formData);
      onClose();
    }
  };

  const medicalConditionOptions = [
    'Diabète Type 1', 'Diabète Type 2', 'Hypertension', 'Hypercholestérolémie',
    'Maladie cardiovasculaire', 'Troubles digestifs', 'Syndrome métabolique',
    'Hypothyroïdie', 'Hyperthyroïdie', 'Anémie', 'Ostéoporose'
  ];

  const dietaryRestrictionOptions = [
    'Végétarien', 'Végétalien', 'Sans gluten', 'Sans lactose',
    'Halal', 'Casher', 'Sans noix', 'Pauvre en sodium'
  ];

  const foodPreferenceOptions = [
    'Cuisine méditerranéenne', 'Cuisine asiatique', 'Cuisine française',
    'Aliments bio', 'Produits locaux', 'Plats préparés', 'Cuisine maison'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Nouveau Patient</h2>
            <p className="text-gray-600">Étape {currentStep} sur 4</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step < 4 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Infos personnelles</span>
            <span>Infos médicales</span>
            <span>Objectifs</span>
            <span>Notes</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Étape 1: Informations Personnelles */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Informations Personnelles</h3>
                  <p className="text-gray-600">Coordonnées et informations de base du patient</p>
                </div>
              </div>

              {/* Photo de profil */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Choisir une photo
                  </button>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG jusqu'à 5MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Prénom du patient"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nom du patient"
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="email@exemple.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.gender ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionner</option>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                    <option value="autre">Autre</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={2}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Adresse complète"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ville"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="12345"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Contact d'urgence</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du contact
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nom et relation (ex: Marie Dupont - Épouse)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone d'urgence
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Étape 2: Informations Médicales */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Informations Médicales</h3>
                  <p className="text-gray-600">État de santé et données corporelles</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taille (cm) *
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.height ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="170"
                  />
                  {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poids actuel (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.currentWeight}
                    onChange={(e) => handleInputChange('currentWeight', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.currentWeight ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="70.5"
                  />
                  {errors.currentWeight && <p className="text-red-500 text-xs mt-1">{errors.currentWeight}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poids objectif (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.targetWeight}
                    onChange={(e) => handleInputChange('targetWeight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="65.0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau d'activité physique *
                </label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.activityLevel ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionner le niveau d'activité</option>
                  <option value="sedentaire">Sédentaire (peu ou pas d'exercice)</option>
                  <option value="leger">Léger (exercice léger 1-3 jours/semaine)</option>
                  <option value="modere">Modéré (exercice modéré 3-5 jours/semaine)</option>
                  <option value="intense">Intense (exercice intense 6-7 jours/semaine)</option>
                  <option value="tres-intense">Très intense (exercice très intense, travail physique)</option>
                </select>
                {errors.activityLevel && <p className="text-red-500 text-xs mt-1">{errors.activityLevel}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Conditions médicales
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {medicalConditionOptions.map((condition) => (
                    <label key={condition} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.medicalConditions.includes(condition)}
                        onChange={(e) => handleArrayChange('medicalConditions', condition, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Médicaments actuels
                  </label>
                  <textarea
                    value={formData.medications}
                    onChange={(e) => handleInputChange('medications', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Liste des médicaments et dosages..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allergies alimentaires
                  </label>
                  <textarea
                    value={formData.allergies}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Allergies connues..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Restrictions alimentaires
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {dietaryRestrictionOptions.map((restriction) => (
                    <label key={restriction} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.dietaryRestrictions.includes(restriction)}
                        onChange={(e) => handleArrayChange('dietaryRestrictions', restriction, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{restriction}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut tabagique
                  </label>
                  <select
                    value={formData.smokingStatus}
                    onChange={(e) => handleInputChange('smokingStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    <option value="non-fumeur">Non-fumeur</option>
                    <option value="fumeur">Fumeur actuel</option>
                    <option value="ex-fumeur">Ex-fumeur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consommation d'alcool
                  </label>
                  <select
                    value={formData.alcoholConsumption}
                    onChange={(e) => handleInputChange('alcoholConsumption', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    <option value="jamais">Jamais</option>
                    <option value="occasionnel">Occasionnel</option>
                    <option value="modere">Modéré (1-2 verres/jour)</option>
                    <option value="important">Important (3+ verres/jour)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Étape 3: Objectifs et Préférences */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Objectifs et Préférences</h3>
                  <p className="text-gray-600">Définir les objectifs et préférences alimentaires</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objectif principal
                  </label>
                  <select
                    value={formData.primaryGoal}
                    onChange={(e) => handleInputChange('primaryGoal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un objectif</option>
                    <option value="perte-poids">Perte de poids</option>
                    <option value="prise-poids">Prise de poids</option>
                    <option value="maintien">Maintien du poids</option>
                    <option value="muscle">Prise de masse musculaire</option>
                    <option value="sante">Amélioration de la santé générale</option>
                    <option value="energie">Augmentation de l'énergie</option>
                    <option value="medical">Gestion condition médicale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Délai souhaité
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un délai</option>
                    <option value="1-mois">1 mois</option>
                    <option value="3-mois">3 mois</option>
                    <option value="6-mois">6 mois</option>
                    <option value="1-an">1 an</option>
                    <option value="plus-1-an">Plus d'1 an</option>
                    <option value="pas-delai">Pas de délai spécifique</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Régimes précédents
                </label>
                <textarea
                  value={formData.previousDiets}
                  onChange={(e) => handleInputChange('previousDiets', e.target.value)}                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Décrivez les régimes ou programmes alimentaires suivis dans le passé..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Préférences alimentaires
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {foodPreferenceOptions.map((preference) => (
                    <label key={preference} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.foodPreferences.includes(preference)}
                        onChange={(e) => handleArrayChange('foodPreferences', preference, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{preference}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aliments non appréciés
                </label>
                <textarea
                  value={formData.dislikedFoods}
                  onChange={(e) => handleInputChange('dislikedFoods', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Liste des aliments que le patient n'aime pas..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compétences en cuisine
                  </label>
                  <select
                    value={formData.cookingSkills}
                    onChange={(e) => handleInputChange('cookingSkills', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    <option value="debutant">Débutant (basiques)</option>
                    <option value="intermediaire">Intermédiaire (plats simples)</option>
                    <option value="avance">Avancé (plats complexes)</option>
                    <option value="expert">Expert (techniques avancées)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget alimentaire
                  </label>
                  <select
                    value={formData.budgetRange}
                    onChange={(e) => handleInputChange('budgetRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    <option value="economique">Économique</option>
                    <option value="moyen">Moyen</option>
                    <option value="comfortable">Confortable</option>
                    <option value="illimite">Illimité</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temps disponible pour la préparation
                  </label>
                  <select
                    value={formData.mealPrepTime}
                    onChange={(e) => handleInputChange('mealPrepTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    <option value="peu">Peu de temps (10-15 min)</option>
                    <option value="modere">Temps modéré (30 min)</option>
                    <option value="beaucoup">Beaucoup de temps (1h+)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Étape 4: Notes et Observations */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <FileText className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Notes et Observations</h3>
                  <p className="text-gray-600">Informations complémentaires pour le suivi</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes de consultation initiale
                </label>
                <textarea
                  value={formData.initialConsultationNotes}
                  onChange={(e) => handleInputChange('initialConsultationNotes', e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Notes importantes à retenir de la première consultation..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exigences particulières
                </label>
                <textarea
                  value={formData.specialRequirements}
                  onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Horaires particuliers, disponibilités, contraintes..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau de motivation
                  </label>
                  <select
                    value={formData.motivationLevel}
                    onChange={(e) => handleInputChange('motivationLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    <option value="faible">Faible</option>
                    <option value="moyen">Moyen</option>
                    <option value="eleve">Élevé</option>
                    <option value="tres-eleve">Très élevé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Système de soutien
                  </label>
                  <select
                    value={formData.supportSystem}
                    onChange={(e) => handleInputChange('supportSystem', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner</option>
                    <option value="familial">Soutien familial</option>
                    <option value="amis">Amis/proches</option>
                    <option value="professionnel">Soutien professionnel</option>
                    <option value="aucun">Aucun soutien particulier</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    Ces informations seront utilisées pour personnaliser le suivi nutritionnel du patient. 
                    Veillez à être aussi précis que possible pour offrir la meilleure expérience.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 border-t pt-6">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Précédent
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Suivant
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Save className="h-5 w-5 mr-2" />
                Enregistrer le patient
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPatientForm;