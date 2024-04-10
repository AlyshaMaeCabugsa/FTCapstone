import {
  FETCH_INSPECTIONS_BEGIN,
  FETCH_INSPECTIONS_SUCCESS,
  FETCH_INSPECTIONS_FAILURE,
  ADD_INSPECTION_SUCCESS,
  ADD_INSPECTION_FAILURE,
  UPDATE_INSPECTION_SUCCESS,
  DELETE_INSPECTION_SUCCESS,
} from '../actions/inspectionScheduleActions'; // Adjusted import path

const initialState = {
  inspections: [],
  loading: false,
  error: null,
};

export default function inspectionScheduleReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_INSPECTIONS_BEGIN:
      return { ...state, loading: true, error: null };
    case FETCH_INSPECTIONS_SUCCESS:
      return { ...state, loading: false, inspections: action.payload, error: null };
    case FETCH_INSPECTIONS_FAILURE:
      return { ...state, loading: false, error: action.payload.error };
    case ADD_INSPECTION_SUCCESS:
      return { ...state, inspections: [...state.inspections, action.payload] };
    case ADD_INSPECTION_FAILURE:
      return { ...state, loading: false, error: action.payload.error };
    case UPDATE_INSPECTION_SUCCESS:
      return {
        ...state,
        inspections: state.inspections.map(inspection =>
          inspection._id === action.payload._id ? action.payload : inspection
        ),
      };
    case DELETE_INSPECTION_SUCCESS:
      return {
        ...state,
        inspections: state.inspections.filter(inspection => inspection._id !== action.payload),
      };
    default:
      return state;
  }
}


  