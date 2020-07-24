import {
  LOAD_USER_FAILURE, LOAD_USER_REQUEST, LOAD_USER_SUCCESS,
  RESET_USER, SET_USER,
} from './actionTypes';

const INIT_STATE = { user: null, error: null, isFetching: false };

function userReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case LOAD_USER_REQUEST:
      return { ...state, isFetching: true };

    case LOAD_USER_FAILURE:
      return { ...state, error: action.error, isFetching: false };

    case LOAD_USER_SUCCESS:
      return { ...state, user: action.user, isFetching: false };

    case SET_USER:
      return { ...state, user: action.user };


    case RESET_USER:
      return { ...state, user: null };

    default:
      return state;
  }
}


export default userReducer;