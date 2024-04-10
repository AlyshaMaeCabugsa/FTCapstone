// Inside useAuthTokenCheck.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/authUtils';

const useAuthTokenCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      localStorage.clear(); // Clear all localStorage items
      navigate('/sign-in'); // Navigate to sign-in
    }
  }, [navigate]);
};

export default useAuthTokenCheck;



