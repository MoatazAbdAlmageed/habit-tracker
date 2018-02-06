import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AddHabit from './AddHabit';
import EditHabit from './EditHabit';
import Dashboard from './Dashboard';
import Login from './Login';
import Summary from './Summary';
import PrivateRoute from './PrivateRoute';
import ChallengeDashboard from './ChallengeDashboard';
import AddChallengeHabit from './AddChallengeHabit';
import Demo from './Demo';

const Main = () => (
  <main>
    <Switch>
      <PrivateRoute exact path="/" component={Dashboard} />
      <Route exact path="/login" component={Login} />
      <PrivateRoute exact path="/addhabit" component={AddHabit} />
      <PrivateRoute exact path="/addchallengehabit" component={AddChallengeHabit} />
      <PrivateRoute exact path="/editHabit/:id" component={EditHabit} />
      <PrivateRoute exact path="/summary" component={Summary} />
      <PrivateRoute path="/dashboard" component={Dashboard} />
      <Route exact path="/challenge" component={ChallengeDashboard} />
      <Route exact path="/demo" component={Demo} />
    </Switch>
  </main>
);
export default Main;