import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Button, Modal, Box, Snackbar, Alert } from '@mui/material';
import EstablishmentForm from './EstablishmentForm';
import EstablishmentTable from './EstablishmentTable';
import { fetchEstablishments, addEstablishment, updateEstablishment, deleteEstablishment } from '../actions/establishmentsActions';

// Style for the modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const Establishments = () => {
  const [showEstablishmentForm, setShowEstablishmentForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState(null);
  const dispatch = useDispatch();
  const { data: establishments, loading, error } = useSelector((state) => state.establishments);

  useEffect(() => {
    dispatch(fetchEstablishments());
  }, [dispatch]);

  const handleEstablishmentSubmit = (establishmentData) => {
    if (editMode) {
      dispatch(updateEstablishment(selectedEstablishment._id, establishmentData));
      setSuccessMessage('Establishment updated successfully!');
    } else {
      dispatch(addEstablishment(establishmentData));
      setSuccessMessage('Establishment added successfully!');
    }
    setShowEstablishmentForm(false);
    setEditMode(false);
    setSelectedEstablishment(null);
  };

  const handleEditClick = (establishment) => {
    setEditMode(true);
    setSelectedEstablishment(establishment);
    setShowEstablishmentForm(true);
  };

  const handleDeleteClick = (establishmentId) => {
    dispatch(deleteEstablishment(establishmentId));
    setSuccessMessage('Establishment deleted successfully!');
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessMessage('');
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" my={4}>
        <Typography variant="h4" component="h1">
          Opol Establishments
        </Typography>
        {!showEstablishmentForm && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowEstablishmentForm(true)}
          >
            Add New Establishment
          </Button>
        )}
      </Box>

      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Modal
        open={showEstablishmentForm}
        onClose={() => setShowEstablishmentForm(false)}
        aria-labelledby="modal-establishment-form-title"
        aria-describedby="modal-establishment-form-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-establishment-form-title" variant="h6" component="h2">
            {editMode ? 'Edit Establishment' : 'Add New Establishment'}
          </Typography>
          <Box mt={2}>
            <EstablishmentForm
              onEstablishmentSubmit={handleEstablishmentSubmit}
              onCancel={() => setShowEstablishmentForm(false)}
              establishment={selectedEstablishment}
              editMode={editMode}
            />
          </Box>
        </Box>
      </Modal>

      {loading ? (
        // Add a loading spinner or some placeholder content
        <Typography>Loading...</Typography>
      ) : error ? (
        // Show an error message or some error content
        <Alert severity="error">{error}</Alert>
      ) : (
        <EstablishmentTable
          establishments={establishments}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}
    </Container>
  );
};

export default Establishments;
