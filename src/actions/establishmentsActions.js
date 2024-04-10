import axios from 'axios';
import {
  FETCH_ESTABLISHMENTS_REQUEST,
  FETCH_ESTABLISHMENTS_SUCCESS,
  FETCH_ESTABLISHMENTS_FAILURE
} from './types';

export const fetchEstablishments = () => async (dispatch) => {
  dispatch({ type: FETCH_ESTABLISHMENTS_REQUEST });
  try {
    const { data } = await axios.get('/api/establishments');
    dispatch({ type: FETCH_ESTABLISHMENTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_ESTABLISHMENTS_FAILURE, payload: error.message });
  }
};

// Add a new establishment
export const addEstablishment = (establishmentData) => async (dispatch) => {
    try {
      const { data } = await axios.post('/api/establishments', establishmentData);
      // Dispatch a new action for ADD_ESTABLISHMENT_SUCCESS
    } catch (error) {
      // Dispatch a new action for ADD_ESTABLISHMENT_FAILURE
    }
  };
  
  // Update an establishment
  export const updateEstablishment = (id, establishmentData) => async (dispatch) => {
    try {
      const { data } = await axios.put(`/api/establishments/${id}`, establishmentData);
      // Dispatch a new action for UPDATE_ESTABLISHMENT_SUCCESS
    } catch (error) {
      // Dispatch a new action for UPDATE_ESTABLISHMENT_FAILURE
    }
  };
  
  // Delete an establishment
  export const deleteEstablishment = (id) => async (dispatch) => {
    try {
      await axios.delete(`/api/establishments/${id}`);
      // Dispatch a new action for DELETE_ESTABLISHMENT_SUCCESS
    } catch (error) {
      // Dispatch a new action for DELETE_ESTABLISHMENT_FAILURE
    }
  };