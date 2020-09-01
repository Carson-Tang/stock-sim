import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Home from './components/Home.js';
import LoggedIn from './components/LoggedIn.js';
import About from './components/About.js';
import Portfolio from './components/Portfolio.js';
import Stock from './components/Stock.js';
import Header from './components/Header.js'
import CircularProgress from '@material-ui/core/CircularProgress'
import PrivateRoute from './PrivateRoute';
import { AuthContext } from "./context/auth";
import Login from './components/Login.js'
import Register from './components/Register.js'
import HomePage from './components/HomePage.js'
import { ThemeProvider } from '@material-ui/styles'
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    type: 'light',
  }
})

const App = () => {

  const existingTokens = JSON.parse(localStorage.getItem("tokens"))
  const [authTokens, setAuthTokens] = useState(existingTokens);
  
  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  }

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        { authTokens && <Header /> }
        <Switch>
          {
            !authTokens &&
            <>
              <Route exact path='/' component={HomePage} />
              <Route path='/login' component={Login} />
              <Route path='/register' component={Register} />
            </>
          }
          { authTokens &&
            <>
              <PrivateRoute exact path='/' component={LoggedIn} />
              <PrivateRoute path='/portfolio' component={Portfolio} />
              <PrivateRoute path='/stock/:ticket' component={Stock} />
              <PrivateRoute path='/about' component={About} />
            </>
          }
        </Switch>
      </Router>
      </ThemeProvider>
    </AuthContext.Provider>
  );
};

export default App;