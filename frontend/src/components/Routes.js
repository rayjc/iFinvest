import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Auth from './Auth';
import Profile from './Profile';
import Home from './Home';
import PortfolioDetail from './PortfolioDetail';


const Routes = () => (
  <Switch>
    <PrivateRoute path="/portfolios/:id">
      <PortfolioDetail />
    </PrivateRoute>
    <Route exact path="/auth" >
      <Auth />
    </Route>
    <PrivateRoute exact path="/profile">
      <Profile />
    </PrivateRoute>
    <Route exact path="/">
      <Home />
    </Route>
    <Redirect to="/" />
  </Switch>
);


export default Routes;