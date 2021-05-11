import React from 'react';
import { Switch, Route } from "react-router-dom";

import './App.css';

import NavBar from './Components/NavBar';
import HomePage from './Components/HomePage';
import TopFiveView from './Components/TopFiveView';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <NavBar />
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/mostTeamPIM">
            <TopFiveView data="mostTeamPIM"/>
          </Route>
          <Route path="/mostTeamHits">
            <TopFiveView data="mostTeamHits"/>
          </Route>
          <Route path="/mostPIM">
            <TopFiveView data="mostPIM"/>
          </Route>
          <Route path="/mostHits">
            <TopFiveView data="mostHits"/>
          </Route>
          <Route path="/fights">
            <TopFiveView data="fights"/>
          </Route>
          <Route path="/majors">
            <TopFiveView data="majors"/>
          </Route>
          <Route path="/mostGoals">
            <TopFiveView data="mostGoals"/>
          </Route>
          <Route path="/mostAssists">
            <TopFiveView data="mostAssists"/>
          </Route>
          <Route path="/mostPoints">
            <TopFiveView data="mostPoints"/>
          </Route>
          <Route path="/mostPPGoals">
            <TopFiveView data="mostPPGoals"/>
          </Route>
          <Route path="/mostSHGoals">
            <TopFiveView data="mostSHGoals"/>
          </Route>
          <Route path="/bestPlusMinus">
            <TopFiveView data="bestPlusMinus"/>
          </Route>
          <Route path="/savePercentage">
            <TopFiveView data="savePercentage"/>
          </Route>
          <Route path="/goalsAgainstAverage">
            <TopFiveView data="goalsAgainstAverage"/>
          </Route>
          <Route path="/shutOuts">
            <TopFiveView data="shutOuts"/>
          </Route>
          <Route path="/shotTypes">
            <TopFiveView data="shotTypes"/>
          </Route>
        </Switch>
      </div>
    );
  }
}

export default App;