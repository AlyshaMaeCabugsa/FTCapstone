// AnnualRecordForm.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { AnnualRecordContext } from './context/AnnualRecordContext';
import EstablishmentSearch from './EstablishmentSearch'; // Assuming this is your custom component

const AnnualRecordForm = ({ open, onClose, editMode, recordData, currentListType }) => {
  const { setAnnualRecords } = useContext(AnnualRecordContext);
  const [formData, setFormData] = useState({
    establishment: '',
    year: new Date().getFullYear(),
    listType: currentListType || 'Positive', // Use currentListType if provided
    inspectionDate: '',
    registrationDate: '',
    orNumber: '',
    certificationAmount: '',
    releaseDate: '',
    certificationStatus: '',
    defectsDeficiencies: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // If the form is opened and we have a current list type, set it.
    // Otherwise, if we are editing, use the record data.
    const initialFormData = editMode && recordData
      ? { ...recordData }
      : {
          establishment: '',
          year: new Date().getFullYear(),
          listType: currentListType,
          inspectionDate: '',
          registrationDate: '',
          orNumber: '',
          certificationAmount: '',
          releaseDate: '',
          certificationStatus: '',
          defectsDeficiencies: ''
        };

        setFormData(initialFormData);
      }, [editMode, recordData, currentListType, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const endpoint = editMode ? `/api/annualrecords/${recordData._id}` : '/api/annualrecords';
    const method = editMode ? 'put' : 'post';

    try {
      const response = await axios[method](endpoint, formData);
      setAnnualRecords(prevRecords => {
        if (editMode) {
          return prevRecords.map((rec) => (rec._id === response.data._id ? response.data : rec));
        }
        return [...prevRecords, response.data];
      });
      onClose();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred while saving the record.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editMode ? 'Edit Record' : 'Add New Record'}</DialogTitle>
      <DialogContent>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {isSubmitting && <CircularProgress />}
        <FormControl fullWidth margin="normal">
          <EstablishmentSearch
            onSelect={(est) => {
              setFormData({ ...formData, establishment: est._id });
            }}
            // Placeholder for the actual component
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            name="year"
            label="Year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="list-type-label">List Type</InputLabel>
          <Select
            labelId="list-type-label"
            name="listType"
            value={formData.listType}
            onChange={handleChange}
            label="List Type"
            required
          >
            <MenuItem value="Positive">Positive</MenuItem>
            <MenuItem value="Negative">Negative</MenuItem>
          </Select>
        </FormControl>
        {/* Conditional fields based on List Type */}
        {formData.listType === 'Positive' && (
          <>
            <FormControl fullWidth margin="normal">
              <TextField
                name="inspectionDate"
                label="Inspection Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.inspectionDate}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                name="registrationDate"
                label="Registration Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.registrationDate}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                name="orNumber"
                label="OR Number"
                value={formData.orNumber}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                name="certificationAmount"
                label="Certification Amount"
                type="number"
                value={formData.certificationAmount}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                name="releaseDate"
                label="Release Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.releaseDate}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                name="certificationStatus"
                label="Certification Status"
                value={formData.certificationStatus}
                onChange={handleChange}
                required
              />
            </FormControl>
          </>
        )}
        {formData.listType === 'Negative' && (
          <>
            <FormControl fullWidth margin="normal">
              <TextField
                name="defectsDeficiencies"
                label="Defects and Deficiencies"
                multiline
                rows={4}
                value={formData.defectsDeficiencies}
                onChange={handleChange}
                required
              />
            </FormControl>
            {/* Additional field for Inspection Date for Negative List */}
            <FormControl fullWidth margin="normal">
              <TextField
                name="inspectionDate"
                label="Inspection Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.inspectionDate}
                onChange={handleChange}
                required
              />
            </FormControl>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained" disabled={isSubmitting}>
          {editMode ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnnualRecordForm;




