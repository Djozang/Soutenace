import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    role: 'patient',
    état_santé: 'sain',
    maladie: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/register', formData);
      alert('Inscription réussie !');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l’inscription');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Inscription</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Rôle</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="patient">Patient</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">État de santé</label>
            <select
              name="état_santé"
              value={formData.état_santé}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="sain">Sain</option>
              <option value="malade">Malade</option>
            </select>
          </div>
          {formData.état_santé === 'malade' && (
            <div className="mb-4">
              <label className="block text-gray-700">Pathologie</label>
              <input
                type="text"
                name="maladie"
                value={formData.maladie}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Ex. Diabète, Favisme"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            S’inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;