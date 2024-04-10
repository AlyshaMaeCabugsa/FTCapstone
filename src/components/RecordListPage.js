import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Modal,
  Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { fetchRecords, deleteRecord } from '../actions/record'; // Adjusted import path
import AnnualRecordForm from './AnnualRecordForm';

const RecordListPage = () => {
  const records = useSelector(state => state.records.data);
  const dispatch = useDispatch();
  const [listType, setListType] = useState('Positive');
  const [openForm, setOpenForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    dispatch(fetchRecords(listType));
  }, [dispatch, listType]);

  const filteredRecords = records.filter(record => {
    const matchesListType = record.listType === listType;
    const searchLower = searchTerm.toLowerCase();
    // Check that record.establishment exists before trying to access tradeName
    return matchesListType && record.establishment && record.establishment.tradeName.toLowerCase().includes(searchLower);
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleListTypeChange = (event) => {
    setListType(event.target.value);
  };

  const handleAddNew = () => {
    setIsEditMode(false);
    setCurrentRecord({ listType });
    setOpenForm(true);
  };

  const handleOpenForm = (record) => {
    setCurrentRecord(record);
    setIsEditMode(true);
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteRecord(id));
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setIsEditMode(false);
    setCurrentRecord(null);
  };



  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            FSIC Tracking: {listType} List
          </Typography>

          <Select
            value={listType}
            onChange={handleListTypeChange}
            sx={{ height: '40px' }}
          >
            <MenuItem value="Positive">Positive</MenuItem>
            <MenuItem value="Negative">Negative</MenuItem>
          </Select>

          <IconButton color="primary" onClick={handleAddNew} sx={{ ml: 2 }}>
            <AddIcon />
          </IconButton>
        </Box>

        <TextField
          placeholder="Search by Unique Number or Trade Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: '400px' }}
        />
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ mt: 3 }}>
        <Table sx={{ minWidth: 750 }} aria-label="customized table">
        <TableHead>
            <TableRow sx={{ backgroundColor: theme => theme.palette.primary.main }}>
              <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>Unique Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>Trade Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>Owner Representative</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>Address</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>Type of Occupancy</TableCell>
              {/* Conditional columns based on list type */}
              {listType === 'Positive' && <>
                <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>Inspection Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>Registration Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>OR Number</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>Certification Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>Release Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>Certification Status</TableCell>
              </>}
              {listType === 'Negative' && <>
                <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>Inspection Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'common.white' }}>Defects and Deficiencies</TableCell>
              </>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecords.map((record) => (
            record.establishment ? ( // Check if establishment is not null
              <TableRow key={record._id}>
                <TableCell>{record.establishment.uniqueNumber}</TableCell>
                <TableCell>{record.establishment.tradeName}</TableCell>
                <TableCell>{record.establishment.ownerRepresentative}</TableCell>
                <TableCell>{record.establishment.address}</TableCell>
                <TableCell>{record.establishment.typeOfOccupancy}</TableCell>
        {/* Conditional cells based on list type */}
        {listType === 'Positive' && (
          <> 
          <TableCell>{formatDate(record.inspectionDate)}</TableCell>
          <TableCell>{formatDate(record.registrationDate)}</TableCell>
          <TableCell>{record.orNumber}</TableCell>
          <TableCell>{record.certificationAmount}</TableCell>
          <TableCell>{formatDate(record.releaseDate)}</TableCell>
          <TableCell>{record.certificationStatus}</TableCell>
        </>
      )}
        {listType === 'Negative' && (
          <>
            <TableCell>{formatDate(record.inspectionDate)}</TableCell>
            <TableCell>{record.defectsDeficiencies}</TableCell>
          </>
        )}
        <TableCell>
          <IconButton onClick={() => handleOpenForm(record)}>
            <EditIcon color="primary" />
          </IconButton>
          <IconButton onClick={() => handleDelete(record._id)}>
            <DeleteIcon color="secondary" />
          </IconButton>
        </TableCell>
      </TableRow>
    ) : null // Render nothing if establishment is null
  ))}
  {records.length === 0 && (
    <TableRow>
      <TableCell colSpan={listType === 'Positive' ? 13 : 9} align="center">No Records Found</TableCell>
    </TableRow>
  )}
</TableBody>

        </Table>
      </TableContainer>
      
      <Modal
        open={openForm}
        onClose={handleCloseForm}
        aria-labelledby="annual-record-form-modal"
        aria-describedby="annual-record-form"
        closeAfterTransition 
        BackdropProps={{
        timeout: 500, 
        style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }, 
      }}
      sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute', 
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'auto', 
          maxHeight: '90vh', 
          overflowY: 'auto', 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4, 
          outline: 'none', 
          borderRadius: '8px', 
        }}
      >
      <AnnualRecordForm
        open={openForm}
        onClose={handleCloseForm}
        editMode={isEditMode}
        recordData={currentRecord}
        currentListType={listType}
      />
  </Box>
</Modal>
    </Container>
  );
};


export default RecordListPage;