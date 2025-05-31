import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Calendar, Clock, Users, ChefHat, Apple, Zap, Heart, Shield, Edit, Trash2, Copy, Eye, X } from 'lucide-react';

const MealPlansPage = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // États pour les modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [newPlanData, setNewPlanData] = useState({
    name: '',
    category: '',
    duration: '',
    description: '',
    calories: '',
    meals: '3',
    difficulty: 'Facile',
    macros: { proteins: 25, carbs: 45, fats: 30 }
  });

  // Données d'exemple
  useEffect(() => {
    const mockMealPlans = [
      {
        id: 1,
        name: 'Plan Perte de Poids - Modéré',
        category: 'weight-loss',
        description: 'Plan équilibré pour une perte de poids progressive et durable',
        duration: '4 semaines',
        calories: 1500,
        assignedPatients: 8,
        creationDate: '2024-04-15',
        lastModified: '2024-05-20',
        status: 'active',
        macros: { proteins: 25, carbs: 45, fats: 30 },
        meals: 5,
        difficulty: 'Facile'
      },
      {
        id: 2,
        name: 'Plan Diabétique Type 2',
        category: 'medical',
        description: 'Plan spécialisé pour le contrôle glycémique',
        duration: '8 semaines',
        calories: 1800,
        assignedPatients: 5,
        creationDate: '2024-03-10',
        lastModified: '2024-05-18',
        status: 'active',
        macros: { proteins: 30, carbs: 40, fats: 30 },
        meals: 6,
        difficulty: 'Modéré'
      },
      {
        id: 3,
        name: 'Plan Sportif - Prise de Masse',
        category: 'sports',
        description: 'Plan hyperprotéiné pour les athlètes en prise de masse',
        duration: '6 semaines',
        calories: 2500,
        assignedPatients: 12,
        creationDate: '2024-02-20',
        lastModified: '2024-05-15',
        status: 'active',
        macros: { proteins: 35, carbs: 45, fats: 20 },
        meals: 6,
        difficulty: 'Difficile'
      },
      {
        id: 4,
        name: 'Plan Végétarien Équilibré',
        category: 'vegetarian',
        description: 'Plan végétarien complet avec tous les nutriments essentiels',
        duration: '4 semaines',
        calories: 1700,
        assignedPatients: 3,
        creationDate: '2024-01-25',
        lastModified: '2024-04-30',
        status: 'draft',
        macros: { proteins: 20, carbs: 55, fats: 25 },
        meals: 5,
        difficulty: 'Facile'
      }
    ];
    setMealPlans(mockMealPlans);
  }, []);

  const filteredPlans = mealPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || plan.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const getCategoryIcon = (category) => {
    const icons = {
      'weight-loss': <Zap className="h-5 w-5" />,
      'medical': <Heart className="h-5 w-5" />,
      'sports': <Shield className="h-5 w-5" />,
      'vegetarian': <Apple className="h-5 w-5" />
    };
    return icons[category] || <ChefHat className="h-5 w-5" />;
  };

  const getCategoryName = (category) => {
    const names = {
      'weight-loss': 'Perte de Poids',
      'medical': 'Médical',
      'sports': 'Sportif',
      'vegetarian': 'Végétarien'
    };
    return names[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'weight-loss': 'bg-orange-100 text-orange-800',
      'medical': 'bg-red-100 text-red-800',
      'sports': 'bg-blue-100 text-blue-800',
      'vegetarian': 'bg-green-100 text-green-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Facile': 'text-green-600',
      'Modéré': 'text-yellow-600',
      'Difficile': 'text-red-600'
    };
    return colors[difficulty] || 'text-gray-600';
  };

  // Fonctions pour gérer les actions
  const handleViewPlan = (plan) => {
    setSelectedPlan(plan);
    setShowViewModal(true);
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setNewPlanData({
      name: plan.name,
      category: plan.category,
      duration: plan.duration,
      description: plan.description,
      calories: plan.calories,
      meals: plan.meals.toString(),
      difficulty: plan.difficulty,
      macros: { ...plan.macros }
    });
    setShowEditModal(true);
  };

  const handleDeletePlan = (plan) => {
    setSelectedPlan(plan);
    setShowDeleteModal(true);
  };

  const handleDuplicatePlan = (plan) => {
    setSelectedPlan(plan);
    setNewPlanData({
      name: `Copie de ${plan.name}`,
      category: plan.category,
      duration: plan.duration,
      description: plan.description,
      calories: plan.calories,
      meals: plan.meals.toString(),
      difficulty: plan.difficulty,
      macros: { ...plan.macros }
    });
    setShowDuplicateModal(true);
  };

  const confirmDeletePlan = () => {
    setMealPlans(mealPlans.filter(p => p.id !== selectedPlan.id));
    setShowDeleteModal(false);
    setSelectedPlan(null);
  };

  const handleCreatePlan = () => {
    const newPlan = {
      id: Math.max(...mealPlans.map(p => p.id)) + 1,
      name: newPlanData.name,
      category: newPlanData.category,
      description: newPlanData.description,
      duration: newPlanData.duration,
      calories: parseInt(newPlanData.calories),
      assignedPatients: 0,
      creationDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      status: 'active',
      macros: newPlanData.macros,
      meals: parseInt(newPlanData.meals),
      difficulty: newPlanData.difficulty
    };
    setMealPlans([...mealPlans, newPlan]);
    setShowCreateModal(false);
    setNewPlanData({
      name: '',
      category: '',
      duration: '',
      description: '',
      calories: '',
      meals: '3',
      difficulty: 'Facile',
      macros: { proteins: 25, carbs: 45, fats: 30 }
    });
  };

  const handleUpdatePlan = () => {
    const updatedPlans = mealPlans.map(p => 
      p.id === selectedPlan.id ? { 
        ...p, 
        ...newPlanData,
        calories: parseInt(newPlanData.calories),
        meals: parseInt(newPlanData.meals),
        lastModified: new Date().toISOString().split('T')[0]
      } : p
    );
    setMealPlans(updatedPlans);
    setShowEditModal(false);
    setSelectedPlan(null);
  };

  const handleDuplicateConfirm = () => {
    const duplicatedPlan = {
      id: Math.max(...mealPlans.map(p => p.id)) + 1,
      name: newPlanData.name,
      category: newPlanData.category,
      description: newPlanData.description,
      duration: newPlanData.duration,
      calories: parseInt(newPlanData.calories),
      assignedPatients: 0,
      creationDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      status: 'draft',
      macros: newPlanData.macros,
      meals: parseInt(newPlanData.meals),
      difficulty: newPlanData.difficulty
    };
    setMealPlans([...mealPlans, duplicatedPlan]);
    setShowDuplicateModal(false);
    setSelectedPlan(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlanData(prev => ({ ...prev, [name]: value }));
  };

  const handleMacroChange = (e) => {
    const { name, value } = e.target;
    setNewPlanData(prev => ({
      ...prev,
      macros: {
        ...prev.macros,
        [name]: parseInt(value)
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Plans Nutritionnels</h1>
        <p className="text-gray-600">Créez et gérez vos plans alimentaires personnalisés</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Plans</p>
              <p className="text-2xl font-bold text-gray-900">{mealPlans.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <ChefHat className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Plans Actifs</p>
              <p className="text-2xl font-bold text-green-600">
                {mealPlans.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Patients Assignés</p>
              <p className="text-2xl font-bold text-blue-600">
                {mealPlans.reduce((acc, p) => acc + p.assignedPatients, 0)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Calories Moyenne</p>
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(mealPlans.reduce((acc, p) => acc + p.calories, 0) / mealPlans.length || 0)}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un plan..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">Toutes catégories</option>
                <option value="weight-loss">Perte de Poids</option>
                <option value="medical">Médical</option>
                <option value="sports">Sportif</option>
                <option value="vegetarian">Végétarien</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Nouveau Plan
          </button>
        </div>
      </div>

      {/* Meal Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getCategoryColor(plan.category).replace('text-', 'bg-').replace('800', '100')}`}>
                    {getCategoryIcon(plan.category)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg leading-tight">{plan.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(plan.category)} mt-1`}>
                      {getCategoryName(plan.category)}
                    </span>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(plan.status)}`}>
                  {plan.status === 'active' ? 'Actif' : 'Brouillon'}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plan.description}</p>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-xs font-medium text-gray-600">Patients</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{plan.assignedPatients}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-orange-500" />
                    <span className="text-xs font-medium text-gray-600">Calories</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{plan.calories}</p>
                </div>
              </div>

              {/* Macros */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Macronutriments</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Protéines</span>
                    <span className="text-xs font-medium text-blue-600">{plan.macros.proteins}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${plan.macros.proteins}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Glucides</span>
                    <span className="text-xs font-medium text-green-600">{plan.macros.carbs}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${plan.macros.carbs}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Lipides</span>
                    <span className="text-xs font-medium text-yellow-600">{plan.macros.fats}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: `${plan.macros.fats}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Plan Details */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{plan.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChefHat className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{plan.meals} repas/j</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Créé le {new Date(plan.creationDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getDifficultyColor(plan.difficulty)}`}>
                    {plan.difficulty}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleViewPlan(plan)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleEditPlan(plan)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDuplicatePlan(plan)}
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeletePlan(plan)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <button 
                  onClick={() => handleViewPlan(plan)}
                  className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
                >
                  Voir détails →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPlans.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun plan trouvé</h3>
          <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
        </div>
      )}

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Nouveau Plan Nutritionnel</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom du plan</label>
                  <input
                    type="text"
                    name="name"
                    value={newPlanData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Plan Perte de Poids - Débutant"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                  <select 
                    name="category"
                    value={newPlanData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="weight-loss">Perte de Poids</option>
                    <option value="medical">Médical</option>
                    <option value="sports">Sportif</option>
                    <option value="vegetarian">Végétarien</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durée</label>
                  <select
                    name="duration"
                    value={newPlanData.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner la durée</option>
                    <option value="2 semaines">2 semaines</option>
                    <option value="4 semaines">4 semaines</option>
                    <option value="6 semaines">6 semaines</option>
                    <option value="8 semaines">8 semaines</option>
                    <option value="12 semaines">12 semaines</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={newPlanData.description}
                  onChange={handleInputChange}
                  placeholder="Décrivez l'objectif et les spécificités de ce plan nutritionnel..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                ></textarea>
              </div>

              {/* Nutrition Info */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Informations Nutritionnelles</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Calories/jour</label>
                    <input
                      type="number"
                      name="calories"
                      value={newPlanData.calories}
                      onChange={handleInputChange}
                      placeholder="1500"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de repas</label>
                    <select
                      name="meals"
                      value={newPlanData.meals}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="3">3 repas</option>
                      <option value="4">4 repas</option>
                      <option value="5">5 repas</option>
                      <option value="6">6 repas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulté</label>
                    <select
                      name="difficulty"
                      value={newPlanData.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Facile">Facile</option>
                      <option value="Modéré">Modéré</option>
                      <option value="Difficile">Difficile</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Macronutrients */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Répartition des Macronutriments (%)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Protéines</label>
                    <input
                      type="number"
                      name="proteins"
                      value={newPlanData.macros.proteins}
                      onChange={handleMacroChange}
                      placeholder="25"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Glucides</label>
                    <input
                      type="number"
                      name="carbs"
                      value={newPlanData.macros.carbs}
                      onChange={handleMacroChange}
                      placeholder="45"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lipides</label>
                    <input
                      type="number"
                      name="fats"
                      value={newPlanData.macros.fats}
                      onChange={handleMacroChange}
                      placeholder="30"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Le total doit égaler 100%</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={handleCreatePlan}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Créer le plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Plan Modal */}
      {showViewModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedPlan.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(selectedPlan.category)} mt-2`}>
                    {getCategoryName(selectedPlan.category)}
                  </span>
                </div>
                <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-gray-600 mb-4">{selectedPlan.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Détails du plan</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Durée:</span>
                          <span className="font-medium">{selectedPlan.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nombre de repas:</span>
                          <span className="font-medium">{selectedPlan.meals} par jour</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Calories quotidiennes:</span>
                          <span className="font-medium">{selectedPlan.calories} kcal</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Difficulté:</span>
                          <span className={`font-medium ${getDifficultyColor(selectedPlan.difficulty)}`}>
                            {selectedPlan.difficulty}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Statut:</span>
                          <span className={`font-medium ${selectedPlan.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {selectedPlan.status === 'active' ? 'Actif' : 'Brouillon'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Répartition nutritionnelle</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Protéines</span>
                          <span className="text-sm font-medium text-blue-600">{selectedPlan.macros.proteins}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${selectedPlan.macros.proteins}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Glucides</span>
                          <span className="text-sm font-medium text-green-600">{selectedPlan.macros.carbs}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${selectedPlan.macros.carbs}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Lipides</span>
                          <span className="text-sm font-medium text-yellow-600">{selectedPlan.macros.fats}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${selectedPlan.macros.fats}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Historique</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Créé le:</span>
                      <span className="font-medium">{new Date(selectedPlan.creationDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dernière modification:</span>
                      <span className="font-medium">{new Date(selectedPlan.lastModified).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Patients assignés:</span>
                      <span className="font-medium">{selectedPlan.assignedPatients}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                >
                  Fermer
                </button>
                <button 
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditPlan(selectedPlan);
                  }}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {showEditModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Modifier le plan</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom du plan</label>
                  <input
                    type="text"
                    name="name"
                    value={newPlanData.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Plan Perte de Poids - Débutant"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                  <select 
                    name="category"
                    value={newPlanData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="weight-loss">Perte de Poids</option>
                    <option value="medical">Médical</option>
                    <option value="sports">Sportif</option>
                    <option value="vegetarian">Végétarien</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Durée</label>
                  <select
                    name="duration"
                    value={newPlanData.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner la durée</option>
                    <option value="2 semaines">2 semaines</option>
                    <option value="4 semaines">4 semaines</option>
                    <option value="6 semaines">6 semaines</option>
                    <option value="8 semaines">8 semaines</option>
                    <option value="12 semaines">12 semaines</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={newPlanData.description}
                  onChange={handleInputChange}
                  placeholder="Décrivez l'objectif et les spécificités de ce plan nutritionnel..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                ></textarea>
              </div>

              {/* Nutrition Info */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Informations Nutritionnelles</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Calories/jour</label>
                    <input
                      type="number"
                      name="calories"
                      value={newPlanData.calories}
                      onChange={handleInputChange}
                      placeholder="1500"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de repas</label>
                    <select
                      name="meals"
                      value={newPlanData.meals}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="3">3 repas</option>
                      <option value="4">4 repas</option>
                      <option value="5">5 repas</option>
                      <option value="6">6 repas</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulté</label>
                    <select
                      name="difficulty"
                      value={newPlanData.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="Facile">Facile</option>
                      <option value="Modéré">Modéré</option>
                      <option value="Difficile">Difficile</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Macronutrients */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Répartition des Macronutriments (%)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Protéines</label>
                    <input
                      type="number"
                      name="proteins"
                      value={newPlanData.macros.proteins}
                      onChange={handleMacroChange}
                      placeholder="25"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Glucides</label>
                    <input
                      type="number"
                      name="carbs"
                      value={newPlanData.macros.carbs}
                      onChange={handleMacroChange}
                      placeholder="45"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lipides</label>
                    <input
                      type="number"
                      name="fats"
                      value={newPlanData.macros.fats}
                      onChange={handleMacroChange}
                      placeholder="30"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Le total doit égaler 100%</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={handleUpdatePlan}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Plan Modal */}
      {showDeleteModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Supprimer le plan</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir supprimer le plan "{selectedPlan.name}" ? Cette action est irréversible.</p>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={confirmDeletePlan}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Plan Modal */}
      {showDuplicateModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Dupliquer le plan</h3>
              <button onClick={() => setShowDuplicateModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau nom</label>
                <input
                  type="text"
                  name="name"
                  value={newPlanData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  name="status"
                  value={newPlanData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="draft">Brouillon</option>
                  <option value="active">Actif</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setShowDuplicateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleDuplicateConfirm}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Dupliquer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlansPage;