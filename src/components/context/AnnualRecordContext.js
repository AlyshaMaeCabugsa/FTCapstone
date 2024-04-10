import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AnnualRecordContext = createContext();

export const AnnualRecordProvider = ({ children }) => {
  const [annualRecords, setAnnualRecords] = useState([]);
  const [establishments, setEstablishments] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentFormType, setCurrentFormType] = useState('Positive');

  // Function to fetch annual records based on list type
  const fetchRecords = async (listType) => {
    try {
      const response = await axios.get(`/api/annualrecords?type=${listType}&year=${selectedYear}`);
      setAnnualRecords(response.data);
    } catch (error) {
      console.error('Error fetching annual records:', error);
    }
  };

  // Fetch records initially and on form type or selected year change
  useEffect(() => {
    fetchRecords(currentFormType);
  }, [currentFormType, selectedYear]);

  const value = {
    annualRecords,
    setAnnualRecords,
    establishments,
    setEstablishments,
    selectedYear,
    setSelectedYear,
    currentFormType,
    setCurrentFormType,
    fetchRecords,
    // ... other shared state and handlers
  };

  return (
    <AnnualRecordContext.Provider value={value}>
      {children}
    </AnnualRecordContext.Provider>
  );
};

  