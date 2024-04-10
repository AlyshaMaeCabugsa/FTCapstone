// NotificationIcon.js
import React, { useState, useEffect } from 'react';
import { Badge, IconButton, Menu, MenuItem } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNotifications } from './context/NotificationContext';
import socket from '../services/socket'; // Ensure this import is correct



const NotificationIcon = () => {
  const { notifications, addNotification } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const handleNewNotification = (data) => {
      addNotification(data.message);
    };

    socket.on('notifyAdmin', handleNewNotification);

    return () => {
      socket.off('notifyAdmin', handleNewNotification);
    };
  }, [addNotification]);

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleNotificationClick}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        id="notification-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {notifications.length === 0 ? (
          <MenuItem onClick={handleClose}>No Notifications</MenuItem>
        ) : (
          notifications.map((notification, index) => (
            <MenuItem key={index} onClick={handleClose}>
              {notification}
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationIcon;



