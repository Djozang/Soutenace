import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  User,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Api from "../services/Api";
import { useAuth } from "../Contexts/AuthContext";

const PatientsPage = () => {
    const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    nom: "",
    email: "",
    état_santé: "",
    maladie: "null",
    status: "active",
  });

  // Récupération des patients depuis l'API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await Api.get("/api/patients");
        setPatients(response.data);
      } catch (error) {
        toast.error("Erreur lors du chargement des patients");
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Fonction pour ajouter un nouveau patient
  const addPatient = async () => {
    try {
      const response = await Api.post("/api/patients", newPatient);
      setPatients([...patients, response.data]);
      setShowAddModal(false);
      setNewPatient({
        nom: "",
        email: "",
        état_santé: "",
        maladie: "null",
        // status: "active",
      });
      toast.success("Patient ajouté avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du patient");
      console.error("Error adding patient:", error);
    }
  };

  // Fonction pour mettre à jour un patient
  const updatePatient = async (patientId, updatedData) => {
    try {
      const response = await Api.put(`/api/patients/${patientId}`, updatedData);
      setPatients(
        patients.map((p) => (p.id === patientId ? response.data : p))
      );
      toast.success("Patient mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du patient");
      console.error("Error updating patient:", error);
    }
  };

  // Fonction pour supprimer un patient
  const deletePatient = async (patientId) => {
    try {
      await Api.delete(`/api/patients/${patientId}`);
      setPatients(patients.filter((p) => p.id !== patientId));
      toast.success("Patient supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du patient");
      console.error("Error deleting patient:", error);
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = `${patient.user?.nom}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 mt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Patients</h1>
        <p className="text-gray-600">Gérez et suivez vos patients</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Patients
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {patients.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>


        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Progression Moyenne
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {patients.length > 0
                  ? Math.round(
                      patients.reduce((acc, p) => acc + (p.progress || 0), 0) /
                        patients.length
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
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
                placeholder="Rechercher un patient..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

         
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Nouveau Patient
          </button>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                
           
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progression
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière Visite
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {patient.user?.nom}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {patient.état_santé} 
                          </div>
                          <div className="text-sm text-gray-500">
                            {patient.maladie} 
                          </div>
                        </div>
                      </div>
                    </td>
                   
                
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(
                              patient.progress || 0
                            )}`}
                            style={{ width: `${patient.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">
                          {patient.progress || 0}%
                        </span>
                      </div>
                      {patient.currentWeight && patient.targetWeight && (
                        <div className="text-xs text-gray-500">
                          {patient.currentWeight}kg → {patient.targetWeight}kg
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {patient.updated_at
                          ? new Date(patient.updated_at).toLocaleDateString(
                              "fr-FR"
                            )
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          to={`/patients/${patient.id}`}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedPatient(patient);
                            setNewPatient({
                              nom: user.nom,
                              email: patient.email,
                                état_santé: patient.état_santé,
                                maladie: patient.maladie || "null",
                              status: patient.status,
                            });
                            setShowAddModal(true);
                          }}
                          className="text-gray-600 hover:text-gray-900 p-1 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deletePatient(patient.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="text-center py-12">
                      <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Aucun patient trouvé
                      </h3>
                      <p className="text-gray-500">
                        Essayez de modifier vos critères de recherche
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedPatient ? "Modifier Patient" : "Nouveau Patient"}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                
                  
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={newPatient.nom}
                    onChange={handleInputChange}
                    placeholder="Nom"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={newPatient.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    État de santé
                </label>
                <input
                  type="text"
                  name="état_santé"
                  value={newPatient.état_santé}
                  onChange={handleInputChange}
                  placeholder="sain ou malade"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maladie
                </label>
                <input
                  type="text"
                  name="maladie"
                  value={newPatient.maladie}
                  onChange={handleInputChange}
                  placeholder="maladie"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
           
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedPatient(null);
                  setNewPatient({
                    nom: "",
                    email: "",
                    état_santé: "",
                    maladie: "null",
                    status: "active",
                  });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (selectedPatient) {
                    updatePatient(selectedPatient.id, newPatient);
                  } else {
                    addPatient();
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {selectedPatient ? "Mettre à jour" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsPage;
