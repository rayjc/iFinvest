import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";


function PrivateRoute({ exact, path, children, redirect = "/login" }) {
  const currUser = useSelector(state => state.user.user);

  if (!currUser) {
    return <Redirect to={redirect} />;
  }

  return (
    <Route exact={exact} path={path}>
      {children}
    </Route>
  );
}


export default PrivateRoute;