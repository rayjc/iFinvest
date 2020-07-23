import { combineReducers } from 'redux';
import user from './user/userReducer';
import portfolios from './portfolios/portfoliosReducer';
import investments from './investments/investmentsReducer';


const rootReducer = combineReducers({ user, portfolios, investments });


export default rootReducer;