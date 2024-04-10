import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Grid, Autocomplete } from '@mui/material';

const CertificateForm = ({ activeTemplate, formData, setFormData, handleChange, handleSubmit }) => {

  const [tradeNameOptions, setTradeNameOptions] = useState([]);
  
  if (!activeTemplate) return null;

  const handleSearchChange = async (event) => {
    const tradeName = event.target.value;
    if (tradeName.length < 2) { // Consider making the request after 2 or more characters have been typed
      setTradeNameOptions([]);
      return;
    }

    try {
      const response = await fetch(`/api/establishments/search?tradeName=${encodeURIComponent(tradeName)}`);
      if (response.ok) {
        const establishments = await response.json();
        setTradeNameOptions(establishments);
      }
    } catch (error) {
      console.error('Error fetching establishments:', error);
      setTradeNameOptions([]);
    }
  };

  const handleAutoCompleteChange = (event, value) => {
    setFormData({
      ...formData,
      address: value?.address || '',
      ownerName: value?.ownerRepresentative || '',
      // ...populate other fields as needed
    });
  };

  // Dynamically generate the form fields based on activeTemplate.fields
  const formFields = activeTemplate.fields.map((fieldName) => (
    <Grid item xs={12} sm={6} key={fieldName}>
      <TextField
        name={fieldName}
        label={fieldName.replaceAll('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
        value={formData[fieldName] || ''}
        onChange={handleChange}
        margin="normal"
        fullWidth
      />
    </Grid>
  ));

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      sx={{
        // Adjust the modal width for a medium size
        width: '60vw', // Takes up 60% of the view width for medium size
        maxWidth: '800px', // Maximum width of the modal for medium size
        maxHeight: '80vh', // Maximum height of the modal
        overflowY: 'auto', // Allows scrolling if the content is too tall
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
    
        // Positioning styles for the modal
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        {activeTemplate.title}
      </Typography>

      {/* Autocomplete for Trade Name */}
      <Autocomplete
        freeSolo
        options={tradeNameOptions}
        getOptionLabel={(option) => option.tradeName || ''} // Adjust based on your data structure
        onChange={handleAutoCompleteChange}
        onInputChange={handleSearchChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Trade Name"
            margin="normal"
            fullWidth
          />
        )}
      />

      <Grid container spacing={2}>
        {formFields}
      </Grid>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 3, alignSelf: 'center' }}
      >
        Generate PDF
      </Button>
    </Box>
  );
};

export default CertificateForm;


