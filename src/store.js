import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk'; 
import establishmentsReducer from './reducers/establishmentsReducer';
import recordsReducer from './reducers/records'; // Updated import path
import reportsReducer from './reducers/reports'; // Updated import path
import inspectionScheduleReducer from './reducers/inspectionScheduleReducer';
import staffContactReducer from './reducers/staffContactReducer';


const rootReducer = combineReducers({
  establishments: establishmentsReducer,
  records: recordsReducer,
  reports: reportsReducer,
  inspectionSchedule: inspectionScheduleReducer,
  staffContacts: staffContactReducer,
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;



