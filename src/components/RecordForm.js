import React, { useState, useEffect } from 'react';

const RecordForm = ({ record, onFormSubmit }) => {
  // Initialize form fields with values for new record or empty strings
  const [formData, setFormData] = useState({
    year: record?.year || '',
    uniqueNumber: record?.uniqueNumber || '',
    tradeName: record?.tradeName || '',
    ownerRepresentative: record?.ownerRepresentative || '',
    address: record?.address || '',
    typeOfOccupancy: record?.typeOfOccupancy || '',
    inspectionDate: record?.inspectionDate || '',
    listType: record?.listType || 'Positive',
    // Fields for the 'Positive' list type
    registrationDate: record?.listType === 'Positive' ? record.registrationDate : '',
    orNumber: record?.listType === 'Positive' ? record.orNumber : '',
    certificationAmount: record?.listType === 'Positive' ? record.certificationAmount : '',
    releaseDate: record?.listType === 'Positive' ? record.releaseDate : '',
    certificationStatus: record?.listType === 'Positive' ? record.certificationStatus : '',
    // Field for the 'Negative' list type
    defectsDeficiencies: record?.listType === 'Negative' ? record.defectsDeficiencies : '',
  });

  useEffect(() => {
    // If there's an existing record, populate the form with its data
    if (record) {
      setFormData({ ...record });
    }
  }, [record]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onFormSubmit(formData);
    // Optionally clear the form or provide feedback to the user
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Example form fields based on your model */}
      <input
        type="number"
        name="year"
        value={formData.year}
        onChange={handleChange}
        placeholder="Year"
        required
      />
      {/* Add all other input fields similarly */}
      <button type="submit">{record ? 'Update' : 'Create'} Record</button>
    </form>
  );
};

export default RecordForm;
