import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './components/Home.js';
import LoggedIn from './components/LoggedIn.js';
import About from './components/About.js';
import Portfolio from './components/Portfolio.js';
import Stock from './components/Stock.js';
import Header from './components/Header.js'
import { useAuth0 } from "./react-auth0-spa";
import CircularProgress from '@material-ui/core/CircularProgress'

const App = () => {
  const { isAuthenticated } = useAuth0();

  const { loading } = useAuth0();

  if (loading) {
    return <div><CircularProgress />Loading...</div>
  }

  return (
    <Router>
      <div>
        {!isAuthenticated && <Home />}
        {isAuthenticated && 
          <>
            <Header />
            <Route exact path='/' component={LoggedIn} />
            <Route path='/portfolio' component={Portfolio} />
            <Route path='/stock/:ticket' component={Stock} />
            <Route path='/about' component={About} />
          </>
        }
      </div>
    </Router>
  );
};

export default App;