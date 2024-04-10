import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { addContact, deleteContact, fetchContacts, updateContact } from '../actions/staffContactActions';

const ManageStaffContactsModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { contacts } = useSelector((state) => state.staffContacts);
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [editContactId, setEditContactId] = useState(null);


  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const handleAddContact = () => {
    const contactData = { name: contactName, phoneNumber: contactNumber };
    if (editContactId) {
        dispatch(updateContact(editContactId, contactData));
    } else {
        dispatch(addContact(contactData));
    }
    setContactName('');
    setContactNumber('');
    setEditContactId(null);
};

  const handleEdit = (contact) => {
    setContactName(contact.name);
    setContactNumber(contact.number);
    setEditContactId(contact._id);
  };

  const handleDelete = (id) => {
    dispatch(deleteContact(id));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" marginBottom={2}>
          Manage Staff Contacts
        </Typography>
        <TextField
          label="Contact Name"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Contact Number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={handleAddContact} fullWidth>
          {editContactId ? 'Update Contact' : 'Add Contact'}
        </Button>
        <List>
        {contacts.map((contact) => (
            <ListItem key={contact._id}>
                <ListItemText primary={contact.name} secondary={contact.phoneNumber} />
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(contact)}>
                        <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(contact._id)}>
                            <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        ))}
        </List>
      </Box>
    </Modal>
  );
};

export default ManageStaffContactsModal;

