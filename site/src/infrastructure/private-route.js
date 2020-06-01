import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import authService from '../services/auth.service';

const PrivateRoute = ({ component: Component, ...options }) => {
  const localSessionUser = authService.getLocalSession();

  return (
    <Route
      {...options}
      render={(props) => (
        localSessionUser
        ? <Component {...props } sessionUser={localSessionUser} />
        : <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }} />
        )
      }
    />
  );
};

export default PrivateRoute;