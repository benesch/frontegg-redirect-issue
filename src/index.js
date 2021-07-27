import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Switch, Route, Redirect, useHistory } from 'react-router-dom';

import { FronteggProvider, useAuth } from '@frontegg/react';

function ProtectedRoute(props) {
  const history = useHistory();
  const { isAuthenticated, isLoading, routes: authRoutes } = useAuth();
  if (isLoading) {
    // Wait for authentication state to load before determining what to do.
    return null;
  } else if (isAuthenticated) {
    return <Route {...props} />;
  } else {
    let loginRedirectUrl = authRoutes.loginUrl;
    if (typeof(props.path) === "string") {
      loginRedirectUrl += `?redirectUrl=${encodeURIComponent(props.path)}`;
    }
    history.push(loginRedirectUrl)
    return null;
  }
};

function RedirectIfNotAuthRoute() {
  const history = useHistory();
  const { routes: authRoutes } = useAuth();
  if (Object.values(authRoutes).includes(history.location.pathname)) {
    // Frontegg will handle it.
    return null;
  } else {
    return <Redirect to="/secret-home" />;
  }
}

const contextOptions = {
  baseUrl: 'https://materialize-staging.frontegg.com',
};

ReactDOM.render(
  <FronteggProvider contextOptions={contextOptions} authOptions={{routes: {authenticatedUrl: "/secret-home"}}}>
    <BrowserRouter>
        <Switch>
            <ProtectedRoute path="/secret-home">
              secret home<br />
              <Link to="/subsecret">subsecret</Link><br />
              <Link to="/account/logout">log out</Link>
            </ProtectedRoute>
            <ProtectedRoute path="/subsecret">
              subsecret<br />
              <Link to="/secret-home">secret home</Link><br />
              <Link to="/account/logout">log out</Link>
            </ProtectedRoute>
            <Route>
              <Redirect to="/secret-home" />
              {/* Replace the above line with the following to get the intended behavior. */}
              {/* <RedirectIfNotAuthRoute /> */}
            </Route>
        </Switch>
    </BrowserRouter>
  </FronteggProvider>,
  document.getElementById('root')
);
