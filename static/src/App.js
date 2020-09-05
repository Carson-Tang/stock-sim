import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import About from './components/About.js';
import Portfolio from './components/Portfolio.js';
import Settings from './components/Settings.js';
import Stock from './components/Stock.js';
import Watchlist from './components/Watchlist.js';
import StocksPage from './components/StocksPage.js';
import Header from './components/Header.js';
import PrivateRoute from './PrivateRoute';
import { AuthContext } from "./context/auth";
import Login from './components/Login.js'
import Register from './components/Register.js'
import HomePage from './components/HomePage.js'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

const theme = createMuiTheme({
/*   palette: {
    type: 'dark',
    background: {
      container: "#000000",
      paper: "#000000"
    }
  } */
  palette: {
    type: 'dark',
    background: {
      default: "#000220"
    },
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
              <PrivateRoute exact path='/' component={Portfolio} />
              <PrivateRoute path='/portfolio' component={Portfolio} />
              <PrivateRoute path='/watchlist' component={Watchlist} />
              <PrivateRoute path='/settings' component={Settings} />
              <PrivateRoute path='/stocks' component={StocksPage} />
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