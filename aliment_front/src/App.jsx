import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Contexts/AuthContext';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import MealPlanner from './components/MealPlanner';
import HealthTracker from './components/HealthTracker';
import Recipes from './components/Recipes';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import ProfileCom from './nutritionniste/profil';
import PatientsPage from './nutritionniste/patients';
import MealPlansPage from './nutritionniste/plannernutri';
import AddPatientForm from './components/AjoutPatient';
import AdminDashboard from './Pages/Admin/dashboardAdmin';
import AdminSettings from './Pages/Admin/settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/meal-planner" element={<MealPlanner />} />
            <Route path="/health-tracker" element={<HealthTracker />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/nutritionistprofile" element={<ProfileCom />} />
            <Route path="/nutritionist/patients" element={<PatientsPage />} />
            <Route path="/nutritionist/meal-plans" element={<MealPlansPage />} />
            <Route path="/nutritionist/add-patient" element={<AddPatientForm />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            {/* Ajoutez d'autres routes ici si nécessaire */}
          </Routes>
        </div>
      </Router>
     </AuthProvider>
  );
}

export default App;