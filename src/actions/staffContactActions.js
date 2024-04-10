import {
    FETCH_CONTACTS_BEGIN,
    FETCH_CONTACTS_SUCCESS,
    FETCH_CONTACTS_FAILURE,
    ADD_CONTACT_SUCCESS,
    UPDATE_CONTACT_SUCCESS,
    DELETE_CONTACT_SUCCESS
} from './types';
  import { fetchContactsApi, createContactApi, updateContactApi, deleteContactApi } from '../services/api';
  
  export const fetchContactsBegin = () => ({
    type: FETCH_CONTACTS_BEGIN
  });
  
  export const fetchContactsSuccess = contacts => ({
    type: FETCH_CONTACTS_SUCCESS,
    payload: { contacts }
  });
  
  export const fetchContactsFailure = error => ({
    type: FETCH_CONTACTS_FAILURE,
    payload: { error }
  });
  
  export const addContactSuccess = contact => ({
    type: ADD_CONTACT_SUCCESS,
    payload: { contact }
  });
  
  export const updateContactSuccess = contact => ({
    type: UPDATE_CONTACT_SUCCESS,
    payload: { contact }
  });
  
  export const deleteContactSuccess = id => ({
    type: DELETE_CONTACT_SUCCESS,
    payload: { id }
  });
  
  // Async action creators
  
  export const fetchContacts = () => {
    return dispatch => {
      dispatch(fetchContactsBegin());
      return fetchContactsApi()
        .then(res => dispatch(fetchContactsSuccess(res.data)))
        .catch(error => dispatch(fetchContactsFailure(error)));
    };
  };
  
  export const addContact = contactData => {
    return dispatch => {
      return createContactApi(contactData)
        .then(res => dispatch(addContactSuccess(res.data)))
        .then(() => dispatch(fetchContacts()))
        .catch(error => dispatch(fetchContactsFailure(error)));
    };
  };
  
  export const updateContact = (id, contactData) => {
    return dispatch => {
      return updateContactApi(id, contactData)
        .then(res => dispatch(updateContactSuccess(res.data)))
        .then(() => dispatch(fetchContacts()))
        .catch(error => dispatch(fetchContactsFailure(error)));
    };
  };
  
  export const deleteContact = id => {
    return dispatch => {
      return deleteContactApi(id)
        .then(() => dispatch(deleteContactSuccess(id)))
        .then(() => dispatch(fetchContacts()))
        .catch(error => dispatch(fetchContactsFailure(error)));
    };
  };
  