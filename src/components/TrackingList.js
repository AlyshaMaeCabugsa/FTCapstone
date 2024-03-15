import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is installed
import RecordForm from './RecordForm'; // Assuming you have this component ready

const TrackingList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editRecord, setEditRecord] = useState(null); // To track the record being edited

  useEffect(() => {
    setLoading(true);
    axios.get('/api/annualrecords')
      .then(response => {
        setRecords(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleEditClick = (record) => {
    setEditRecord(record);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setLoading(true);
      axios.delete(`/api/annualrecords/${id}`)
        .then(() => {
          setRecords(records.filter((record) => record._id !== id));
          setLoading(false);
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
        });
    }
  };

  const handleFormSubmit = (formData) => {
    if (editRecord) {
      // Update existing record
      axios.put(`/api/annualrecords/${editRecord._id}`, formData)
        .then(response => {
          setRecords(records.map((record) => record._id === editRecord._id ? response.data : record));
          setEditRecord(null); // Clear the editRecord state
        })
        .catch(error => setError(error.message));
    } else {
      // Create new record
      axios.post('/api/annualrecords', formData)
        .then(response => {
          setRecords([...records, response.data]);
        })
        .catch(error => setError(error.message));
    }
  };

  return (
    <div>
      {loading && <p>Loading records...</p>}
      {error && <p>Error fetching records: {error}</p>}
      
      {/* Record Form for adding/updating records */}
      <RecordForm record={editRecord} onFormSubmit={handleFormSubmit} />

      <h2>Tracking List</h2>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Establishment</th>
            <th>List Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record._id}>
              <td>{record.year}</td>
              <td>{record.establishment}</td>
              <td>{record.listType}</td>
              <td>
                <button onClick={() => handleEditClick(record)}>Edit</button>
                <button onClick={() => handleDelete(record._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrackingList;
