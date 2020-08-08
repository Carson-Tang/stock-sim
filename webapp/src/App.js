import React from 'react';
import './App.css';
import logo from './logo.svg';
import {Tech} from "./tech/Tech";

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import About from './pages/About'

export function App() {
  return (
    <div className="app">
      <h2 className="title">stock-simulator</h2>
      <div className="logo"><img src={logo} height="150px" alt="logo"/></div>
      <div>
        This project is generated with <b><a
        href="https://github.com/shpota/goxygen">goxygen</a></b>.
        <p/>The following list of technologies comes from
        a REST API call to the Go-based back end. Find
        and change the corresponding code
        in <code>webapp/src/tech/Tech.js
        </code> and <code>server/web/app.go</code>.
        <Tech/>
      </div>
    </div>
  );

/*   return (
    <Router>
      <div className="App">
        <Nav />
        <Route exact path='/' component={Home} />
        <Route path='/login' component={Login} />
        <Route path='/about' component={About} />
      </div>
    </Router>
  ); */
}
