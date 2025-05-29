import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Contexts/AuthContext';

const ProgressReport = () => {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:8000/api/health-progress');
        setReport(res.data);
      } catch (err) {
        console.error('Failed to fetch progress report', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReport();
  }, [user]);

  if (!user) return <div>Veuillez vous connecter</div>;
  
  if (loading) return <div>Chargement du rapport...</div>;
  
  if (!report) return <div>Aucun rapport disponible</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Votre rapport hebdomadaire</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Poids</h3>
          <p className="text-3xl font-bold">{report.weight.current} kg</p>
          <p className={`${report.weight.trend === 'down' ? 'text-green-600' : 'text-red-600'}`}>
            {report.weight.trend === 'down' ? '↓' : '↑'} {report.weight.change} kg depuis la semaine dernière
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800 mb-2">Tension artérielle</h3>
          <p className="text-3xl font-bold">{report.blood_pressure.current}</p>
          <p>{report.blood_pressure.assessment}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Régime alimentaire</h3>
          <p className="text-3xl font-bold">{report.diet.compliance}%</p>
          <p>Conformité avec vos recommandations</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Analyse de votre progression</h3>
        <p className="text-gray-700">{report.analysis}</p>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">Recommandations</h3>
        <ul className="list-disc pl-5 space-y-1">
          {report.recommendations.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      
      {report.encouragement && (
        <div className="mt-6 p-4 bg-blue-100 rounded-lg text-center">
          <p className="text-blue-800 font-medium">{report.encouragement}</p>
        </div>
      )}
    </div>
  );
};

export default ProgressReport;