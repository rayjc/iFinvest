import {
  ADD_INVESTMENT_FAILURE, ADD_INVESTMENT_REQUEST, ADD_INVESTMENT_SUCCESS,
  UPDATE_INVESTMENT_FAILURE, UPDATE_INVESTMENT_REQUEST, UPDATE_INVESTMENT_SUCCESS,
  REMOVE_INVESTMENT_FAILURE, REMOVE_INVESTMENT_REQUEST, REMOVE_INVESTMENT_SUCCESS,
  LOAD_INVESTMENT_FAILURE, LOAD_INVESTMENT_REQUEST, LOAD_INVESTMENT_SUCCESS,
} from './actionTypes';
import InvestmentApi from '../../api/investmentApi';
import { addPortfolioInvestment, removePortfolioInvestment } from '../portfolios/actions';


function addInvestmentRequest() {
  return { type: ADD_INVESTMENT_REQUEST };
}

function addInvestmentFailure(error) {
  return {
    type: ADD_INVESTMENT_FAILURE,
    error,
  };
}

function addInvestmentSuccess(investment) {
  return {
    type: ADD_INVESTMENT_SUCCESS,
    investment,
  };
}

/**
 * Create a new investment on backend and store to redux
 * @param {Object} newInvestment { initial_value, symbol, portfolio_id, 
 * start_date, end_date }
 */
function addInvestment(newInvestment) {
  return async function(dispatch) {
    dispatch(addInvestmentRequest());

    try {
      const investment = await InvestmentApi.createInvestment(newInvestment);
      const interest = await InvestmentApi.getInterest(investment.id);
      dispatch(addInvestmentSuccess({
        ...investment, ...interest, end_date: newInvestment.end_date
      }));
      // update investments in portfolios
      dispatch(addPortfolioInvestment(investment.portfolio_id, investment.id, investment.symbol));
    } catch (error) {
      console.error(error);
      dispatch(addInvestmentFailure("Failed to create a new investment via backend API."));
    }

  };
}


function updateInvestmentRequest() {
  return { type: UPDATE_INVESTMENT_REQUEST };
}

function updateInvestmentFailure(error) {
  return {
    type: UPDATE_INVESTMENT_FAILURE,
    error,
  };
}

function updateInvestmentSuccess(id, investment) {
  return {
    type: UPDATE_INVESTMENT_SUCCESS,
    id,
    investment,
  };
}

/**
 * Update an existing investment on backend and redux 
 * given an object with fields to be updated
 * @param {Number} id 
 * @param {Object} newInvestment 
 */
function updateInvestment(id, newInvestment) {
  return async function(dispatch) {
    dispatch(updateInvestmentRequest());

    try {
      const investment = await InvestmentApi.updateInvestment(id, newInvestment);
      const interest = await InvestmentApi.getInterest(investment.id);
      dispatch(updateInvestmentSuccess(
        id,
        { ...investment, ...interest, end_date: newInvestment.end_date }
      ));
    } catch (error) {
      console.error(error);
      dispatch(updateInvestmentFailure(`Failed to update investment:${id} via backend API.`));
    }

  };
}


function removeInvestmentRequest() {
  return { type: REMOVE_INVESTMENT_REQUEST };
}

function removeInvestmentFailure(error) {
  return {
    type: REMOVE_INVESTMENT_FAILURE,
    error,
  };
}

function removeInvestmentSuccess(id) {
  return {
    type: REMOVE_INVESTMENT_SUCCESS,
    id,
  };
}

/**
 * Remove an existing investment
 * @param {Number} id 
 * @param {Number} portfolioId 
 */
function removeInvestment(id, portfolioId) {
  return async function(dispatch) {
    dispatch(removeInvestmentRequest());

    try {
      dispatch(removePortfolioInvestment(portfolioId, id));
      await InvestmentApi.removeInvestment(id);
      dispatch(removeInvestmentSuccess(id));
    } catch (error) {
      console.error(error);
      dispatch(removeInvestmentFailure(`Failed to remove investment:${id} via backend API.`));
    }

  };
}


function loadInvestmentRequest() {
  return { type: LOAD_INVESTMENT_REQUEST };
}

function loadInvestmentFailure(error) {
  return {
    type: LOAD_INVESTMENT_FAILURE,
    error,
  };
}

function loadInvestmentSuccess(id, investment) {
  return {
    type: LOAD_INVESTMENT_SUCCESS,
    id,
    investment,
  };
}

/**
 * Fetch an investment from backend and store in redux
 * @param {Number} id 
 */
function loadInvestment(id) {
  return async function(dispatch) {
    dispatch(loadInvestmentRequest());

    try {
      const investment = await InvestmentApi.getInvestment(id);
      const interest = await InvestmentApi.getInterest(investment.id);
      dispatch(loadInvestmentSuccess(
        id,
        {
          ...investment, ...interest,
          end_date: investment.end_date ? investment.end_date.split('T')[0] : null
        }
      ));
    } catch (error) {
      console.error(error);
      dispatch(loadInvestmentFailure(`Failed to load investment:${id} via backend API.`));
    }

  };
}


export { addInvestment, updateInvestment, removeInvestment, loadInvestment };