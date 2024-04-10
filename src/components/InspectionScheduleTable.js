import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInspections } from '../actions/inspectionScheduleActions';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, CircularProgress, Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { blue, grey } from '@mui/material/colors';
import moment from 'moment'; // Make sure you have moment installed via npm or yarn

function InspectionScheduleTable({ onEdit, onDelete }) {
  const dispatch = useDispatch();
  const { inspections = [], loading, error } = useSelector(state => state.inspectionSchedule || {});

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error fetching inspections: {error.message}</Typography>;

  // This check is safe due to the default empty array above
  if (inspections.length === 0) return <Typography>No inspections to display.</Typography>;

  const getStatusStyles = (status) => {
    switch (status) {
      case 'Scheduled':
        return { backgroundColor: blue[500], color: 'white' };
      case 'Completed':
        return { backgroundColor: grey[500], color: 'white' };
      case 'Cancelled':
        return { backgroundColor: grey[900], color: 'white' };
      default:
        return {};
    }
  };


  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="inspection schedule table">
        <TableHead>
          <TableRow>
            <TableCell>Trade Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Inspector</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Notes</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inspections.map((inspection) => (
            <TableRow key={inspection._id}>
              {/* Make sure the `establishment` object has `tradeName` and `address` properties */}
              <TableCell>{inspection.establishment.tradeName}</TableCell>
              <TableCell>{inspection.establishment.address}</TableCell>
              {/* Format the date and time using moment.js */}
              <TableCell>{moment(inspection.date).format('LL')}</TableCell>
              <TableCell>{moment(inspection.time, 'HH:mm:ss').format('LT')}</TableCell>
              {/* Access the `name` property of `inspector` object */}
              <TableCell>{inspection.inspector.name}</TableCell>
              {/* Apply status styles */}
              <TableCell sx={getStatusStyles(inspection.status)}>{inspection.status}</TableCell>
              <TableCell>{inspection.notes}</TableCell>
              <TableCell>
                <IconButton aria-label="edit" onClick={() => onEdit(inspection)}>
                  <EditIcon sx={{ color: blue[500] }} />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => onDelete(inspection._id)}>
                  <DeleteIcon sx={{ color: grey[900] }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default InspectionScheduleTable;





