import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Container, Box, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#003366', // dark blue color
    },
    background: {
      default: '#f4f5f7', // a shade of white for the background
    },
  },
});

const EstablishmentForm = ({
  onEstablishmentSubmit,
  editMode,
  establishment,
  onCancel
}) => {
  const initialFormState = {
    uniqueNumber: '',
    tradeName: '',
    ownerRepresentative: '',
    address: '',
    typeOfOccupancy: ''
  };
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (editMode && establishment) {
      setFormData({ ...establishment });
    } else {
      setFormData({ ...initialFormState });
    }
  }, [editMode, establishment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = editMode
        ? await axios.put(`http://localhost:5000/api/establishments/${establishment._id}`, formData)
        : await axios.post('http://localhost:5000/api/establishments', formData);
      onEstablishmentSubmit(response.data); // Assuming onEstablishmentSubmit is a function
      onCancel(); // Reset form or close it
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {errorMessage && (
            <Typography component="p" color="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}
          <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
            {editMode ? 'Edit Establishment' : 'Create Establishment'}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="uniqueNumber"
              label="Unique Number"
              name="uniqueNumber"
              autoComplete="unique-number"
              autoFocus
              value={formData.uniqueNumber}
              onChange={handleChange}
            />
            {/* Repeat TextField components for each input */}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="tradeName"
              label="Trade Name"
              name="tradeName"
              value={formData.tradeName}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="ownerRepresentative"
              label="Owner Representative"
              name="ownerRepresentative"
              value={formData.ownerRepresentative}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="address"
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="typeOfOccupancy"
              label="Type of Occupancy"
              name="typeOfOccupancy"
              value={formData.typeOfOccupancy}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              sx={{ mt: 3, mb: 2 }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : (editMode ? 'Update' : 'Create')}
            </Button>
            <Button
              type="button"
              fullWidth
              variant="text"
              color="primary"
              onClick={onCancel}
              sx={{ mt: 3, mb: 2 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default EstablishmentForm;
