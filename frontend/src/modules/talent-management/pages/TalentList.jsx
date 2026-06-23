import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const TalentList = () => {
  const [talents, setTalents] = useState([]);

  useEffect(() => {
    // Fetch data example
    // api.get('/talent').then(res => setTalents(res.data.data)).catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Tim Ahli (Talent)</h1>
      <div className="bg-white rounded shadow p-4">
        <p className="text-gray-600">Modul Talent Management belum sepenuhnya diimplementasikan.</p>
      </div>
    </div>
  );
};

export default TalentList;
