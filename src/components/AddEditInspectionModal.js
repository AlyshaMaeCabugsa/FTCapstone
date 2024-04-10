import React, { useState, useEffect } from 'react';
import { Box, Modal, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Autocomplete } from '@mui/material';
import { fetchEstablishments } from '../services/api'; // Replace with the correct path to your api calls

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  width: 400,
};

const AddEditInspectionModal = ({ open, onClose, onSave, currentInspection }) => {
  const [formState, setFormState] = useState({
    date: '',
    time: '',
    inspector: { name: '' }, // Initialize as an object with a name property
    status: '',
    notes: '',
    establishmentId: '',
  });
  const [establishments, setEstablishments] = useState([]);

  useEffect(() => {
    fetchEstablishments()
      .then(({ data }) => setEstablishments(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (currentInspection) {
      // When there's an existing inspection to edit, populate the form with its data
      setFormState({
        date: currentInspection.date || '',
        time: currentInspection.time || '',
        inspector: currentInspection.inspector || { name: '' }, // Ensure inspector object is properly initialized
        status: currentInspection.status || 'Scheduled', // Set a default status if none is provided
        notes: currentInspection.notes || '',
        establishmentId: currentInspection.establishment?._id || '',
      });
    } else {
      // For adding a new inspection, initialize all fields to defaults
      setFormState({
        date: '',
        time: '',
        inspector: { name: '' }, // Start with an empty name for the inspector
        status: 'Scheduled', // Consider setting a default status like 'Scheduled'
        notes: '',
        establishmentId: '',
      });
    }
  }, [currentInspection]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'inspector') {
      setFormState(prev => ({ ...prev, inspector: { ...prev.inspector, name: value } }));
    } else {
      setFormState(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEstablishmentChange = (_, newValue) => {
    setFormState(prev => ({ ...prev, establishmentId: newValue?._id || '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const isNew = !currentInspection || !currentInspection._id;
    onSave({ ...formState, establishment: formState.establishmentId }, isNew); // Pass establishment as an ID and isNew flag to onSave
  };


  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title">
      <Box sx={style}>
        <Typography id="modal-title" variant="h6" component="h2">
          {currentInspection ? 'Edit' : 'Add'} Inspection Schedule
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Date"
            type="date"
            name="date"
            value={formState.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Time"
            type="time"
            name="time"
            value={formState.time}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <Autocomplete
            options={establishments}
            getOptionLabel={option => option.tradeName || ""}
            value={establishments.find(est => est._id === formState.establishmentId) || null}
            onChange={handleEstablishmentChange}
            renderInput={params => (
              <TextField {...params} label="Establishment" margin="normal" fullWidth required />
            )}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Inspector Name"
            type="text"
            // The name attribute here should be fine as is since we handle it in handleChange
            name="inspector"
            value={formState.inspector.name} // Access the name property of the inspector object
            onChange={handleChange}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={formState.status}
              onChange={handleChange}
              required
            >
              <MenuItem value="Scheduled">Scheduled</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Notes"
            type="text"
            name="notes"
            value={formState.notes}
            onChange={handleChange}
            multiline
            rows={4}
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddEditInspectionModal;
