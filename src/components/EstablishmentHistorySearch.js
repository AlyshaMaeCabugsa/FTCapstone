import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEstablishmentHistory } from '../actions/reports';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

const EstablishmentHistorySearch = () => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();
  const establishmentHistory = useSelector((state) => state.reports.establishmentHistory);
  const establishmentHistoryLoading = useSelector((state) => state.reports.establishmentHistoryLoading);
  const establishmentHistoryError = useSelector((state) => state.reports.establishmentHistoryError);
  const loading = useSelector((state) => state.reports.loading);

  // Fetch establishment history when a suggestion is selected
  const handleFetchHistory = (event, newValue) => {
    if (newValue) {
      dispatch(fetchEstablishmentHistory(newValue));
      setOpen(true);
    }
  };

  const handleSuggestionSelect = (event, value) => {
    if (value) {
      dispatch(fetchEstablishmentHistory(value));
      setOpen(true);
    }
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  // Close the modal and reset the input value
  const handleClose = () => {
    setOpen(false);
    setInputValue('');
  };

  // Modal style
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };


  return (
    <>
      <Autocomplete
        freeSolo
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleSuggestionSelect}
        options={establishmentHistory} // Assuming this is an array of objects
        getOptionLabel={(option) => option.tradeName || ""} // Adjust this line based on your actual data structure
        renderInput={(params) => (
          <TextField {...params} label="Search Establishment" margin="normal" />
        )}
        noOptionsText="No establishments found"
      />
      <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Establishment History
          </Typography>
          {establishmentHistoryLoading ? (
            <CircularProgress />
          ) : establishmentHistoryError || (establishmentHistory && establishmentHistory.length === 0) ? (
            <Typography color="error">No Records Found</Typography>
          ) : (
            <List>
              {establishmentHistory.map((record, index) => (
                <ListItem key={index}>
                  {record.year}: {record.listType}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default EstablishmentHistorySearch;

