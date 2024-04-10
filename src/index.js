// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './store'; // Adjust if necessary to point to your Redux store configuration
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { NotificationProvider } from './components/context/NotificationContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <NotificationProvider> {/* Add the NotificationProvider here */}
          <Router>
            <App />
          </Router>
        </NotificationProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);






