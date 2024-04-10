import {
    FETCH_REPORTS_REQUEST,
    FETCH_REPORTS_SUCCESS,
    FETCH_REPORTS_FAILURE,
    UPDATE_REPORTS,
    CLEAR_REPORTS_ERROR,
    ADD_REPORT,
    UPDATE_REPORT,
    REMOVE_REPORT,
    FETCH_ESTABLISHMENT_HISTORY_REQUEST,
    FETCH_ESTABLISHMENT_HISTORY_SUCCESS,
    FETCH_ESTABLISHMENT_HISTORY_FAILURE,
    FETCH_SEARCH_SUGGESTIONS_REQUEST, 
    FETCH_SEARCH_SUGGESTIONS_SUCCESS, 
    FETCH_SEARCH_SUGGESTIONS_FAILURE,
  } from '../actions/types';
  
  const initialState = {
    data: [],
    loading: false,
    error: null,
    // Add new state for establishment history
    establishmentHistory: [],
    establishmentHistoryLoading: false,
    establishmentHistoryError: null,

    suggestions: [], // New state property for search suggestions
    suggestionsLoading: false,
    suggestionsError: null,
  };
  
  const reportsReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_REPORTS_REQUEST:
        return { ...state, loading: true };
      case FETCH_REPORTS_SUCCESS:
        return { ...state, loading: false, data: action.payload };
      case FETCH_REPORTS_FAILURE:
        return { ...state, loading: false, error: action.payload };
      case UPDATE_REPORTS:
        return { ...state, data: action.payload };
      case CLEAR_REPORTS_ERROR:
        return { ...state, error: null };
      case ADD_REPORT:
        return { ...state, data: [...state.data, action.payload] };
      case UPDATE_REPORT:
        return {
          ...state,
          data: state.data.map(report =>
            report._id === action.payload._id ? action.payload : report
          ),
        };
      case REMOVE_REPORT:
        return {
          ...state,
          data: state.data.filter(report => report._id !== action.payload),
        };
      // Handle the new actions for fetching establishment history
      case FETCH_ESTABLISHMENT_HISTORY_REQUEST:
        return { ...state, establishmentHistoryLoading: true };
      case FETCH_ESTABLISHMENT_HISTORY_SUCCESS:
        return { 
          ...state, 
          establishmentHistoryLoading: false, 
          establishmentHistory: action.payload 
        };
      case FETCH_ESTABLISHMENT_HISTORY_FAILURE:
        return { 
          ...state, 
          establishmentHistoryLoading: false, 
          establishmentHistoryError: action.payload 
        };
        case FETCH_SEARCH_SUGGESTIONS_REQUEST:
          return { ...state, suggestionsLoading: true };
        case FETCH_SEARCH_SUGGESTIONS_SUCCESS:
          return { ...state, suggestionsLoading: false, suggestions: action.payload };
        case FETCH_SEARCH_SUGGESTIONS_FAILURE:
          return { ...state, suggestionsLoading: false, suggestionsError: action.payload };
          
      default:
        return state;
      
    }
  };
  
  export default reportsReducer;
  
  