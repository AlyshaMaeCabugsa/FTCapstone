// EstablishmentTable.js
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const EstablishmentTable = ({ establishments, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" id="tableTitle" component="div" sx={{ p: 2 }}>
        Establishments List
      </Typography>
      <Table aria-label="establishments table">
        <TableHead>
          <TableRow>
            <TableCell>Trade Name</TableCell>
            <TableCell>Unique Number</TableCell>
            <TableCell>Owner Representative</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Type of Occupancy</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {establishments.map((establishment) => (
            <TableRow key={establishment._id}>
              <TableCell>{establishment.tradeName}</TableCell>
              <TableCell>{establishment.uniqueNumber}</TableCell>
              <TableCell>{establishment.ownerRepresentative}</TableCell>
              <TableCell>{establishment.address}</TableCell>
              <TableCell>{establishment.typeOfOccupancy}</TableCell>
              <TableCell align="center">
                <IconButton onClick={() => onEdit(establishment)}>
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton onClick={() => onDelete(establishment._id)}>
                  <DeleteIcon color="secondary" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EstablishmentTable;
