// contexts/NotificationContext.js
import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  // Function to add a new notification
  const addNotification = (message) => {
    setNotifications((prevNotifications) => [...prevNotifications, message]);
    setNotificationCount((prevNotifications) => prevNotifications.length + 1);
  };

  // Function to clear notifications
  const clearNotifications = () => {
    setNotifications([]);
    setNotificationCount(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, notificationCount, addNotification, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
