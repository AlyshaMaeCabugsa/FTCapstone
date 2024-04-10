// NotificationBar.js
import React, { useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useNotifications } from './context/NotificationContext';

const NotificationBar = () => {
  const { notifications, clearNotifications } = useNotifications();
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (notifications.length > 0) {
      setOpen(true);
    }
  }, [notifications]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    clearNotifications();
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      {notifications.map((message, index) => (
        <Alert key={index} onClose={handleClose} severity="info" sx={{ width: '100%' }}>
          {message}
        </Alert>
      ))}
    </Snackbar>
  );
};

export default NotificationBar;


