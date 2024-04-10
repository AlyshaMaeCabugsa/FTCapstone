import {
    FETCH_CONTACTS_BEGIN,
    FETCH_CONTACTS_SUCCESS,
    FETCH_CONTACTS_FAILURE,
    ADD_CONTACT_SUCCESS,
    UPDATE_CONTACT_SUCCESS,
    DELETE_CONTACT_SUCCESS
} from '../actions/types';
  
  const initialState = {
    contacts: [],
    loading: false,
    error: null
  };
  
  export default function staffContactReducer(state = initialState, action) {
    switch (action.type) {
      case FETCH_CONTACTS_BEGIN:
        return {
          ...state,
          loading: true,
          error: null
        };
      case FETCH_CONTACTS_SUCCESS:
        return {
          ...state,
          loading: false,
          contacts: action.payload.contacts
        };
      case FETCH_CONTACTS_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload.error,
          contacts: []
        };
      case ADD_CONTACT_SUCCESS:
        return {
          ...state,
          contacts: [...state.contacts, action.payload.contact]
        };
      case UPDATE_CONTACT_SUCCESS:
        return {
          ...state,
          contacts: state.contacts.map(contact =>
            contact._id === action.payload.contact._id ? action.payload.contact : contact
          )
        };
      case DELETE_CONTACT_SUCCESS:
        return {
          ...state,
          contacts: state.contacts.filter(contact => contact._id !== action.payload.id)
        };
      default:
        return state;
    }
  }
  