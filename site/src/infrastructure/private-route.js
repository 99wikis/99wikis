import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import authService from '../services/auth.service';
import Topbar from '../components/Topbar';

const PrivateRoute = ({ component: Component, ...options }) => {
  const localSessionUser = authService.getLocalSession();

  return (
    <Route
      {...options}
      render={(props) => (
        localSessionUser
        ? <div>
            <Topbar {...props} sessionUser={localSessionUser} />
            <Component {...props } sessionUser={localSessionUser} />
          </div>
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