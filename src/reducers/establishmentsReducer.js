import {
    FETCH_ESTABLISHMENTS_REQUEST,
    FETCH_ESTABLISHMENTS_SUCCESS,
    FETCH_ESTABLISHMENTS_FAILURE
  } from '../actions/types';
  
  const initialState = {
    data: [],
    loading: false,
    error: null
  };
  
  export default function establishmentsReducer(state = initialState, action) {
    switch (action.type) {
      case FETCH_ESTABLISHMENTS_REQUEST:
        return { ...state, loading: true };
      case FETCH_ESTABLISHMENTS_SUCCESS:
        return { ...state, loading: false, data: action.payload };
      case FETCH_ESTABLISHMENTS_FAILURE:
        return { ...state, loading: false, error: action.payload };
      // Add other cases for CRUD operations
      default:
        return state;
    }
  }
  