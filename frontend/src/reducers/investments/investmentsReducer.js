import {
  ADD_INVESTMENT_FAILURE, ADD_INVESTMENT_REQUEST, ADD_INVESTMENT_SUCCESS,
  UPDATE_INVESTMENT_FAILURE, UPDATE_INVESTMENT_REQUEST, UPDATE_INVESTMENT_SUCCESS,
  REMOVE_INVESTMENT_FAILURE, REMOVE_INVESTMENT_REQUEST, REMOVE_INVESTMENT_SUCCESS,
  LOAD_INVESTMENT_FAILURE, LOAD_INVESTMENT_REQUEST, LOAD_INVESTMENT_SUCCESS,
} from './actionTypes';


const INIT_STATE = { investments: {}, error: null, isFetching: false };

function investmentsReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case ADD_INVESTMENT_REQUEST:
    case UPDATE_INVESTMENT_REQUEST:
    case REMOVE_INVESTMENT_REQUEST:
    case LOAD_INVESTMENT_REQUEST:
      return { ...state, error: null, isFetching: true };

    case ADD_INVESTMENT_FAILURE:
    case UPDATE_INVESTMENT_FAILURE:
    case REMOVE_INVESTMENT_FAILURE:
    case LOAD_INVESTMENT_FAILURE:
      return { ...state, error: action.error, isFetching: false };

    case ADD_INVESTMENT_SUCCESS:
    case UPDATE_INVESTMENT_SUCCESS:
    case LOAD_INVESTMENT_SUCCESS:
      return {
        ...state,
        investments: {
          ...state.investments, [action.investment.id]: action.investment
        },
        isFetching: false
      };

    case REMOVE_INVESTMENT_SUCCESS:
      const { [action.id]: tobeRemoved, ...remainingInvestments } = state.investments;
      return {
        ...state, investments: { ...remainingInvestments }, isFetching: false
      };

    default:
      return state;
  }
}


export default investmentsReducer;