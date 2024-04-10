import { fetchInspectionsApi, createInspectionApi, updateInspectionApi, deleteInspectionApi } from '../services/api';

export const FETCH_INSPECTIONS_BEGIN = 'FETCH_INSPECTIONS_BEGIN';
export const FETCH_INSPECTIONS_SUCCESS = 'FETCH_INSPECTIONS_SUCCESS';
export const FETCH_INSPECTIONS_FAILURE = 'FETCH_INSPECTIONS_FAILURE';
export const ADD_INSPECTION_SUCCESS = 'ADD_INSPECTION_SUCCESS';
export const UPDATE_INSPECTION_SUCCESS = 'UPDATE_INSPECTION_SUCCESS';
export const DELETE_INSPECTION_SUCCESS = 'DELETE_INSPECTION_SUCCESS';
export const ADD_INSPECTION_FAILURE = 'ADD_INSPECTION_FAILURE';

// Async action creators
export const fetchInspections = (status = 'all') => async dispatch => {
  dispatch({ type: FETCH_INSPECTIONS_BEGIN });
  try {
    const response = await fetchInspectionsApi(status !== 'all' ? { status } : {});
    dispatch({ type: FETCH_INSPECTIONS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_INSPECTIONS_FAILURE, payload: { error } });
  }
};

export const addInspection = (inspectionData) => async (dispatch) => {
  dispatch({ type: FETCH_INSPECTIONS_BEGIN });
  try {
    const response = await createInspectionApi(inspectionData);
    if (response && response.data) {
      dispatch({ type: ADD_INSPECTION_SUCCESS, payload: response.data });
      return { success: true, data: response.data }; // Resolve with success data
    } else {
      throw new Error('Failed to receive valid response from the server.');
    }
  } catch (error) {
    const errorMessage = error?.response?.data?.message || 'An unknown error occurred';
    dispatch({ type: ADD_INSPECTION_FAILURE, payload: { error: errorMessage } });
    return { success: false, error: errorMessage }; // Resolve with error data
  }
};

export const updateInspection = (id, inspectionData) => async dispatch => {
  try {
    const response = await updateInspectionApi(id, inspectionData);
    dispatch({ type: UPDATE_INSPECTION_SUCCESS, payload: response.data });
    dispatch(fetchInspections());
  } catch (error) {
    dispatch({ type: FETCH_INSPECTIONS_FAILURE, payload: { error } });
  }
};

export const deleteInspection = (id) => async dispatch => {
  try {
    await deleteInspectionApi(id);
    dispatch({ type: DELETE_INSPECTION_SUCCESS, payload: id });
    return { success: true }; // Resolve with a success object
  } catch (error) {
    dispatch({ type: FETCH_INSPECTIONS_FAILURE, payload: { error } });
    return { success: false, error: error.toString() }; // Resolve with an error object
  }
};
