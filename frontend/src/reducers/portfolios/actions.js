import {
  ADD_PORTFOLIO_FAILURE, ADD_PORTFOLIO_REQUEST, ADD_PORTFOLIO_SUCCESS,
  UPDATE_PORTFOLIO_FAILURE, UPDATE_PORTFOLIO_REQUEST, UPDATE_PORTFOLIO_SUCCESS,
  REMOVE_PORTFOLIO_FAILURE, REMOVE_PORTFOLIO_REQUEST, REMOVE_PORTFOLIO_SUCCESS,
  LOAD_PORTFOLIOS_FAILURE, LOAD_PORTFOLIOS_REQUEST, LOAD_PORTFOLIOS_SUCCESS,
  ADD_PORTFOLIO_INVESTMENT, REMOVE_PORTFOLIO_INVESTMENT,
} from './actionTypes';
import PortfolioApi from '../../api/portfolioApi';


function addPortfolioRequest() {
  return {
    type: ADD_PORTFOLIO_REQUEST,
  };
}

function addPortfolioFailure(error) {
  return {
    type: ADD_PORTFOLIO_FAILURE,
    error,
  };
}

function addPortfolioSuccess(portfolio) {
  return {
    type: ADD_PORTFOLIO_SUCCESS,
    portfolio,
  };
}

/**
 * Create a new portfolio on backend and store to redux.
 * @param {Number} name 
 */
function addPortfolio(name) {
  return async function(dispatch) {
    dispatch(addPortfolioRequest());

    try {
      const portfolio = await PortfolioApi.createPortfolio(name);
      dispatch(addPortfolioSuccess(portfolio));
    } catch (error) {
      console.error(error);
      dispatch(addPortfolioFailure(`Failed to create ${name} via backend API.`));
    }

  };
}


function updatePortfolioRequest() {
  return {
    type: UPDATE_PORTFOLIO_REQUEST,
  };
}

function updatePortfolioFailure(error) {
  return {
    type: UPDATE_PORTFOLIO_FAILURE,
    error,
  };
}

function updatePortfolioSuccess(id, name) {
  return {
    type: UPDATE_PORTFOLIO_SUCCESS,
    id,
    name,
  };
}

/**
 * Update the name of a portfolio of given id.
 * @param {Number} id
 * @param {String} name
 */
function updatePortfolio(id, name) {
  return async function(dispatch) {
    dispatch(updatePortfolioRequest());

    try {
      const portfolio = await PortfolioApi.updatePortfolio(id, name);
      dispatch(updatePortfolioSuccess(portfolio));
    } catch (error) {
      console.error(error);
      dispatch(updatePortfolioFailure(
        `Failed to update name of portfolio:${id} to ${name} via backend API.`
      ));
    }

  };
}


function removePortfolioRequest() {
  return {
    type: REMOVE_PORTFOLIO_REQUEST,
  };
}

function removePortfolioFailure(error) {
  return {
    type: REMOVE_PORTFOLIO_FAILURE,
    error,
  };
}

function removePortfolioSuccess(id) {
  return {
    type: REMOVE_PORTFOLIO_SUCCESS,
    id,
  };
}

/**
 * Remove a portfolio from store given id.
 * @param {Number} id
 */
function removePortfolio(id) {
  return async function(dispatch) {
    dispatch(removePortfolioRequest());

    try {
      await PortfolioApi.removePortfolio(id);
      dispatch(removePortfolioSuccess(id));
    } catch (error) {
      console.error(error);
      dispatch(removePortfolioFailure(
        `Failed to remove portfolio:${id} via backend API.`
      ));
    }

  };
}


function loadPortfoliosRequest() {
  return {
    type: LOAD_PORTFOLIOS_REQUEST,
  };
}

function loadPortfoliosFailure(error) {
  return {
    type: LOAD_PORTFOLIOS_FAILURE,
    error,
  };
}

function loadPortfoliosSuccess(portfolios) {
  return {
    type: LOAD_PORTFOLIOS_SUCCESS,
    portfolios,
  };
}

/**
 * Load portfolios onto store by fetching from backend API.
 */
function loadPortfolios() {
  return async function(dispatch) {
    dispatch(loadPortfoliosRequest());

    try {
      // fetch portfolios from backend
      const portfolios = await PortfolioApi.getPortfolios();
      dispatch(loadPortfoliosSuccess(portfolios));
    } catch (error) {
      console.error(error);
      dispatch(loadPortfoliosFailure("Failed to fetch portfolio from backend API."));
    }

  };
}


function addPortfolioInvestment(portfolioId, investmentId, symbol) {
  return {
    type: ADD_PORTFOLIO_INVESTMENT,
    portfolioId,
    investmentId,
    symbol,
  };
}

function removePortfolioInvestment(portfolioId, investmentId) {
  return {
    type: REMOVE_PORTFOLIO_INVESTMENT,
    portfolioId,
    investmentId,
  };
}


export {
  addPortfolio, removePortfolio, updatePortfolio, loadPortfolios,
  addPortfolioInvestment, removePortfolioInvestment
};