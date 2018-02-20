import React, { Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import './App.css'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './components/home'
import Login from './components/login'
import Team from './components/team'
import Tournaments from './components/tournaments'

class App extends Component {
  render () {
    return (
      <Router>
        <div className="body-wrapper">
          <Route exact path="/" component={Home} />
          <Route path="/team" component={Team}/>
          <Route path="/login" component={Login} />
          <Route path="/tournaments" component={Tournaments} />
        </div>
      </Router>
    )
  }
}

export default App
