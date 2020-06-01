import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PrivateRoute from './infrastructure/private-route';
import Pages from './pages';

// Every route should be registered here and on your specific router component (app, auth, etc...)
class Routes extends Component {
  
  render() {
    
    return (
      <BrowserRouter>
        <Switch>
          <PrivateRoute exact path='/' component={Pages.Home} />
          <Route exact path='/login' component={Pages.Login} />
          <Route exact path='/register' component={Pages.Register} />

          <Route exact path='/*' component={Pages.NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Routes;
