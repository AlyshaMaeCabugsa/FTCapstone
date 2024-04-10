import axios from 'axios';
import {
  FETCH_RECORDS_REQUEST,
  FETCH_RECORDS_SUCCESS,
  FETCH_RECORDS_FAILURE,
  ADD_RECORD,
  ADD_RECORD_FAILURE,
  UPDATE_RECORD,
  UPDATE_RECORD_FAILURE,
  DELETE_RECORD,
  DELETE_RECORD_FAILURE
} from './types';

export const fetchRecords = (listType) => async (dispatch) => {
  dispatch({ type: FETCH_RECORDS_REQUEST });
  try {
    const response = await axios.get(`/api/annualrecords`, { params: { listType } });
    dispatch({ type: FETCH_RECORDS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_RECORDS_FAILURE, payload: error.message });
  }
};

export const addRecord = (recordData) => async (dispatch) => {
    try {
      const response = await axios.post('/api/annualrecords', recordData);
      dispatch({ type: ADD_RECORD, payload: response.data });
    } catch (error) {
      dispatch({ type: ADD_RECORD_FAILURE, payload: error.message });
      console.error('Error adding record:', error);
    }
  };
  
export const updateRecord = (id, recordData) => async (dispatch) => {
    try {
      const response = await axios.put(`/api/annualrecords/${id}`, recordData);
      dispatch({ type: UPDATE_RECORD, payload: response.data });
    } catch (error) {
      dispatch({ type: UPDATE_RECORD_FAILURE, payload: error.message });
      console.error('Error updating record:', error);
    }
  };

export const deleteRecord = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/annualrecords/${id}`);
    dispatch({ type: DELETE_RECORD, payload: id });
  } catch (error) {
    dispatch({ type: DELETE_RECORD_FAILURE, payload: error.message });
    console.error('Error deleting record:', error);
  }
};
