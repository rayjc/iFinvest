import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Auth from './Auth';
import Profile from './Profile';


const Routes = () => (
  <Switch>
    <PrivateRoute path="/portfolios/:id">
      <p>Investment forms and chart under this portfolio</p>
    </PrivateRoute>
    <Route exact path="/auth" >
      <Auth />
    </Route>
    <PrivateRoute exact path="/profile">
      <Profile />
    </PrivateRoute>
    <Route exact path="/">
      {/* <Home /> */}
      <p>Home page</p>
    </Route>
    <Redirect to="/" />
  </Switch>
);


export default Routes;