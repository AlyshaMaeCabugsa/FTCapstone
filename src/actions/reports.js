import {
  FETCH_REPORTS_REQUEST,
  FETCH_REPORTS_SUCCESS,
  FETCH_REPORTS_FAILURE,
  ADD_REPORT,
  UPDATE_REPORT,
  REMOVE_REPORT,
  UPDATE_REPORTS,
  CLEAR_REPORTS_ERROR,
  FETCH_ESTABLISHMENT_HISTORY_REQUEST, 
  FETCH_ESTABLISHMENT_HISTORY_SUCCESS, 
  FETCH_ESTABLISHMENT_HISTORY_FAILURE,
  FETCH_SEARCH_SUGGESTIONS_REQUEST, 
  FETCH_SEARCH_SUGGESTIONS_SUCCESS, 
  FETCH_SEARCH_SUGGESTIONS_FAILURE,
} from './types';
import { fetchAnnualRecords, fetchEstablishmentHistoryApi, fetchSearchSuggestionsApi } from '../services/api';

// Action to fetch reports based on listType and year
export const fetchReports = (listType, year) => async (dispatch) => {
  dispatch({ type: FETCH_REPORTS_REQUEST });
  try {
    const response = await fetchAnnualRecords(listType, year); 
    dispatch({ type: FETCH_REPORTS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_REPORTS_FAILURE, payload: error.message });
  }
};

// Action to add a report
export const addReport = (report) => ({
  type: ADD_REPORT,
  payload: report,
});

// Action to update a report
export const updateReport = (report) => ({
  type: UPDATE_REPORT,
  payload: report,
});

// Action to remove a report by ID
export const removeReport = (reportId) => ({
  type: REMOVE_REPORT,
  payload: reportId,
});

// Action to update reports via WebSocket or other asynchronous sources
export const updateReports = (reports) => ({
  type: UPDATE_REPORTS,
  payload: Array.isArray(reports) ? reports : [reports]
});

// Action to clear any errors related to reports fetching or processing
export const clearReportsError = () => ({
  type: CLEAR_REPORTS_ERROR
});

export const fetchEstablishmentHistoryRequest = () => ({
  type: FETCH_ESTABLISHMENT_HISTORY_REQUEST,
});

export const fetchEstablishmentHistorySuccess = (historyData) => ({
  type: FETCH_ESTABLISHMENT_HISTORY_SUCCESS,
  payload: historyData,
});

export const fetchEstablishmentHistoryFailure = (error) => ({
  type: FETCH_ESTABLISHMENT_HISTORY_FAILURE,
  payload: error,
});

export const fetchEstablishmentHistory = (searchTerm) => async (dispatch) => {
  dispatch(fetchEstablishmentHistoryRequest());
  try {
    const response = await fetchEstablishmentHistoryApi(searchTerm);
    dispatch(fetchEstablishmentHistorySuccess(response.data));
  } catch (error) {
    dispatch(fetchEstablishmentHistoryFailure(error.toString()));
  }
};


// New action creators for fetching search suggestions
export const fetchSearchSuggestionsRequest = () => ({
  type: FETCH_SEARCH_SUGGESTIONS_REQUEST,
});

export const fetchSearchSuggestionsSuccess = (suggestions) => ({
  type: FETCH_SEARCH_SUGGESTIONS_SUCCESS,
  payload: suggestions,
});

export const fetchSearchSuggestionsFailure = (error) => ({
  type: FETCH_SEARCH_SUGGESTIONS_FAILURE,
  payload: error,
});

export const fetchSearchSuggestions = (searchTerm) => async (dispatch) => {
  dispatch(fetchSearchSuggestionsRequest());
  try {
    const response = await fetchSearchSuggestionsApi(searchTerm);
    dispatch(fetchSearchSuggestionsSuccess(response.data));
  } catch (error) {
    dispatch(fetchSearchSuggestionsFailure(error.toString()));
  }
};