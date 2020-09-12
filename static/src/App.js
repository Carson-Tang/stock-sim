import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import About from './components/About.js';
import Portfolio from './components/Portfolio.js';
import Settings from './components/Settings.js';
import Stock from './components/Stock.js';
import Watchlist from './components/Watchlist.js';
import StocksPage from './components/StocksPage.js';
import Header from './components/Header.js';
import Statistics from './components/Statistics.js'
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
      default: "#000112"//"#040d14"//"#000112"//"#000220"
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

  const [profileData, setProfile] = useState('')

  useEffect(() => {
    async function getProfile() {
			console.log('getting profile')
      try {
        await fetch(
          `http://localhost:8080/profile`,
          {
            method: "GET",
            headers: {
              'Authorization': authTokens,
            }
          }
        )
        .then(response => response.json())
        .then(function(data) {
          console.log(data)
          if(data.error)
            return
          setProfile(data)
        });
      } catch (error) {
        console.error(error);
      }
    }
    getProfile()
  }, [])

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens, profileData }}>
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
              <PrivateRoute path='/settings' component={Settings} />
              <PrivateRoute path='/portfolio' component={Portfolio} />
              <PrivateRoute path='/statistics' component={Statistics} />
              <PrivateRoute path='/watchlist' component={Watchlist} />
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