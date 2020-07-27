import {
  ADD_PORTFOLIO_FAILURE, ADD_PORTFOLIO_REQUEST, ADD_PORTFOLIO_SUCCESS,
  UPDATE_PORTFOLIO_FAILURE, UPDATE_PORTFOLIO_REQUEST, UPDATE_PORTFOLIO_SUCCESS,
  REMOVE_PORTFOLIO_FAILURE, REMOVE_PORTFOLIO_REQUEST, REMOVE_PORTFOLIO_SUCCESS,
  LOAD_PORTFOLIOS_FAILURE, LOAD_PORTFOLIOS_REQUEST, LOAD_PORTFOLIOS_SUCCESS,
  ADD_PORTFOLIO_INVESTMENT,
} from './actionTypes';


const INIT_STATE = { portfolios: [], error: null, isFetching: false };

function portfoliosReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case ADD_PORTFOLIO_REQUEST:
    case UPDATE_PORTFOLIO_REQUEST:
    case REMOVE_PORTFOLIO_REQUEST:
    case LOAD_PORTFOLIOS_REQUEST:
      return { ...state, error: null, isFetching: true };

    case ADD_PORTFOLIO_FAILURE:
    case UPDATE_PORTFOLIO_FAILURE:
    case REMOVE_PORTFOLIO_FAILURE:
    case LOAD_PORTFOLIOS_FAILURE:
      return { ...state, error: action.error, isFetching: false };

    case ADD_PORTFOLIO_SUCCESS:
      return {
        ...state,
        portfolios: [...state.portfolios, action.portfolio],
        isFetching: false
      };

    case UPDATE_PORTFOLIO_SUCCESS:
      return {
        ...state,
        portfolios: state.portfolios.map(
          portfolio => portfolio.id === action.id ? { ...portfolio, name: action.name } : portfolio
        ),
        isFetching: false
      };

    case REMOVE_PORTFOLIO_SUCCESS:
      return {
        ...state,
        portfolios: state.portfolios.filter(portfolio => portfolio.id !== action.id),
        isFetching: false
      };

    case LOAD_PORTFOLIOS_SUCCESS:
      return { ...state, portfolios: action.portfolios, isFetching: false };


    case ADD_PORTFOLIO_INVESTMENT:
      return {
        ...state,
        portfolios: state.portfolios.map(
          portfolio => portfolio.id === action.portfolioId
            ? {
              ...portfolio,
              investments: [
                ...portfolio.investments,
                { id: action.investmentId, symbol: action.symbol }
              ]
            }
            : portfolio
        ),
        isFetching: false
      };

    default:
      return state;
  }
}


export default portfoliosReducer;