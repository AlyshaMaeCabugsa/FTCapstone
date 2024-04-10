import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchInspections,
  addInspection,
  updateInspection,
  deleteInspection,
} from '../actions/inspectionScheduleActions';
import InspectionScheduleTable from './InspectionScheduleTable';
import AddEditInspectionModal from './AddEditInspectionModal';
import ManageStaffContactsModal from './ManageStaffContactsModal';
import { Button, Snackbar, Alert, Box, Typography, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const socket = io('http://localhost:8080');

function Inspection() {
  const dispatch = useDispatch();
  const inspections = useSelector((state) => state.inspectionSchedule.inspections);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentInspection, setCurrentInspection] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');



  useEffect(() => {
    dispatch(fetchInspections(selectedStatus));
  
    // Handle the creation of a new inspection via WebSocket
    const handleInspectionCreated = (newInspection) => {
      if (selectedStatus === 'all' || newInspection.status === selectedStatus) {
        dispatch({ type: 'ADD_INSPECTION_SUCCESS', payload: newInspection });
      }
    };
  
    socket.on('inspectionCreated', newInspection => {
      // Dispatch only if the status matches the selectedStatus
      if (selectedStatus === 'all' || newInspection.status === selectedStatus) {
        dispatch({ type: 'ADD_INSPECTION_SUCCESS', payload: newInspection });
      }
    });
  
    // Handle inspection updates (similar logic to handleInspectionCreated)
    socket.on('inspectionUpdated', (updatedInspection) => {
      if (selectedStatus === 'all' || updatedInspection.status === selectedStatus) {
        dispatch({ type: 'UPDATE_INSPECTION_SUCCESS', payload: updatedInspection });
      }
    });
  
    // Handle inspection deletion (ensure the deleted inspection matches the filter)
    socket.on('inspectionDeleted', (deletedInspection) => {
      if (selectedStatus === 'all' || deletedInspection.status === selectedStatus) {
        dispatch({ type: 'DELETE_INSPECTION_SUCCESS', payload: deletedInspection.id });
      }
    });
  
    // Clean up on component unmount
    return () => {
      socket.off('inspectionCreated', handleInspectionCreated);
      socket.off('inspectionUpdated');
      socket.off('inspectionDeleted');
    };
  }, [dispatch, selectedStatus]);


  const handleOpenModal = (inspection = null) => {
    setCurrentInspection(inspection);
    setModalOpen(true);
  };

  const handleAddNewInspection = () => {
    setCurrentInspection(null); // Explicitly set to null for a new inspection
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentInspection(null);
  };

  const handleSave = async (inspectionData, isNew) => {
    try {
      let actionResult;
      if (isNew) {
        actionResult = await dispatch(addInspection(inspectionData));
      } else {
        if (!currentInspection || !currentInspection._id) {
          throw new Error("No inspection ID provided for update.");
        }
        actionResult = await dispatch(updateInspection(currentInspection._id, inspectionData));
      }
      
      if (actionResult.success) {
        setSnackbar({ open: true, message: 'Inspection saved successfully!', severity: 'success' });
      } else {
        throw new Error(actionResult.error);
      }
    } catch (error) {
      console.error("Error saving the inspection:", error);
      setSnackbar({ open: true, message: error.toString(), severity: 'error' });
    } finally {
      handleCloseModal();
    }
  };
  
  const handleDelete = async (id) => {
    try {
      const actionResult = await dispatch(deleteInspection(id));
      if (actionResult.success) {
        setSnackbar({ open: true, message: 'Inspection deleted successfully!', severity: 'success' });
      } else {
        throw new Error(actionResult.error);
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'An error occurred while deleting the inspection.', severity: 'error' });
      console.error("Error deleting the inspection:", error);
    }
  };


  return (
    <>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Opol Establishments Inspection Management
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddNewInspection}>
            Add New Inspection
          </Button>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ marginLeft: '10px' }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Scheduled">Scheduled</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </Box>
        <Button variant="contained" color="secondary" onClick={() => setIsContactModalOpen(true)}>
          Manage Staff Contacts
        </Button>
      </Box>
      <InspectionScheduleTable inspections={inspections} onEdit={handleOpenModal} onDelete={handleDelete} />
      <AddEditInspectionModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        currentInspection={currentInspection}
      />
      <ManageStaffContactsModal
        open={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ open: false })}>
        <Alert onClose={() => setSnackbar({ open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Inspection;



