// src/services/api.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchEstablishments = () => axios.get(`${API_BASE_URL}/establishments`);
export const createEstablishment = (data) => axios.post(`${API_BASE_URL}/establishments`, data);
export const updateEstablishment = (id, data) => axios.put(`${API_BASE_URL}/establishments/${id}`, data);
export const deleteEstablishment = (id) => axios.delete(`${API_BASE_URL}/establishments/${id}`);

//export const fetchAnnualRecords = () => axios.get(`${API_BASE_URL}/annualrecords`);
export const createAnnualRecord = (data) => axios.post(`${API_BASE_URL}/annualrecords`, data);
export const updateAnnualRecord = (id, data) => axios.put(`${API_BASE_URL}/annualrecords/${id}`, data);
export const deleteAnnualRecord = (id) => axios.delete(`${API_BASE_URL}/annualrecords/${id}`);

export const getEstablishmentById = async (id) => {
    return axios.get(`http://localhost:5000/api/establishments/${id}`);
  };

  export const fetchAnnualRecords = (listType, year) => {
    return axios.get(`${API_BASE_URL}/annualrecords`, {
      params: { listType, year } // Make sure the backend API supports this
    });
  };

  export const fetchEstablishmentHistoryApi = async (searchTerm) => {
    return axios.get(`${API_BASE_URL}/establishments/history/${searchTerm}`);
  };

  export const fetchSearchSuggestionsApi = async (searchTerm) => {
    return axios.get(`${API_BASE_URL}/establishments/search-suggestions`, {
      params: { term: searchTerm }
    });
  };

  export const fetchInspectionsApi = (queryParams) => {
    const query = queryParams ? new URLSearchParams(queryParams).toString() : '';
    return axios.get(`/api/inspections${query ? `?${query}` : ''}`);
  };
  export const createInspectionApi = (data) => axios.post(`${API_BASE_URL}/inspections`, data);
  export const updateInspectionApi = (id, data) => axios.put(`${API_BASE_URL}/inspections/${id}`, data);
  export const deleteInspectionApi = (id) => axios.delete(`${API_BASE_URL}/inspections/${id}`);

  // Contacts
  export const fetchContactsApi = () => axios.get(`${API_BASE_URL}/staffContacts`);
export const createContactApi = contactData => axios.post(`${API_BASE_URL}/staffContacts`, contactData);
export const updateContactApi = (id, contactData) => axios.put(`${API_BASE_URL}/staffContacts/${id}`, contactData);
export const deleteContactApi = id => axios.delete(`${API_BASE_URL}/staffContacts/${id}`);

