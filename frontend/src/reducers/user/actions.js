import {
  LOAD_USER_FAILURE, LOAD_USER_REQUEST, LOAD_USER_SUCCESS,
  RESET_USER
} from './actionTypes';
import { decode } from "jsonwebtoken";
import UserApi from '../../api/userApi';


function loadUserRequest() {
  return { type: LOAD_USER_REQUEST };
}

function loadUserFailure(error) {
  return {
    type: LOAD_USER_FAILURE,
    error,
  };
}

function loadUserSuccess(user) {
  return {
    type: LOAD_USER_SUCCESS,
    user,
  };
}

function loadUser(token) {
  return async function(dispatch) {
    dispatch(loadUserRequest());

    try {
      const { id } = decode(token);
      const user = await UserApi.getUser(id);
      dispatch(loadUserSuccess(user));
    } catch (error) {
      console.error(error);
      dispatch(loadUserFailure("Failed to get user info from backend."));
    }

  };
}

function resetUser() {
  return { type: RESET_USER };
}


export { loadUser, resetUser };