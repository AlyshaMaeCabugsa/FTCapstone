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
  } from '../actions/types';
  
  const initialState = {
    data: [],
    loading: false,
    error: null
  };
  
  export default function recordsReducer(state = initialState, action) {
    switch (action.type) {
      case FETCH_RECORDS_REQUEST:
        return { ...state, loading: true };
      case FETCH_RECORDS_SUCCESS:
        return { ...state, loading: false, data: action.payload };
      case FETCH_RECORDS_FAILURE:
        return { ...state, loading: false, error: action.payload };
      case ADD_RECORD:
        return { ...state, data: [...state.data, action.payload], error: null };
      case ADD_RECORD_FAILURE:
        return { ...state, error: action.payload };
      case UPDATE_RECORD:
        return {
          ...state,
          data: state.data.map(record =>
            record._id === action.payload._id ? action.payload : record
          ),
          error: null
        };
      case UPDATE_RECORD_FAILURE:
        return { ...state, error: action.payload };
      case DELETE_RECORD:
        return { ...state, data: state.data.filter(record => record._id !== action.payload), error: null };
      case DELETE_RECORD_FAILURE:
        return { ...state, error: action.payload };
      default:
        return state;
    }
  }
  
  