import { combineReducers } from 'redux';
import recordsReducer from './recordsReducer';
import reportsReducer from './reportsReducer';
import staffContactReducer from './staffContactReducer';


// import other reducers here

const rootReducer = combineReducers({
  // Key names here should match the parts of state managed by each reducer.
  records: recordsReducer,
  reports: reportsReducer,
  staffContacts: staffContactReducer,
});

export default rootReducer;
