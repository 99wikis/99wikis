import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PrivateRoute from './infrastructure/private-route';
import Pages from './pages';
import { ToastProvider } from './infrastructure/toastr'


// Every route should be registered here and on your specific router component (app, auth, etc...)
class Routes extends Component {
  render() {
    return (
      <ToastProvider>
        <BrowserRouter>
          <Switch>
            <PrivateRoute exact path='/' component={Pages.Home} />
            <PrivateRoute exact path='/a/new' component={Pages.ArticleEdit} />
            <PrivateRoute exact path='/a/:id' component={Pages.Article} />
            <PrivateRoute exact path='/a/:id/edit' component={Pages.ArticleEdit} />
            <PrivateRoute exact path='/users' component={Pages.UserManagement} />

            <Route exact path='/login' component={Pages.Login} />
            <Route exact path='/register' component={Pages.Register} />

            <Route exact path='/*' component={Pages.NotFound} />
          </Switch>
        </BrowserRouter>
      </ToastProvider>
    );
  }
}

export default Routes;
