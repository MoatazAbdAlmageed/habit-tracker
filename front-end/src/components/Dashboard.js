import React, { Component, Fragment } from 'react';
import moment from 'moment';
import MonthlyDashboard from './MonthlyDashboard';
import Loader from './Loader/Loader';
// import ChallengeDashboard from './ChallengeDashboard';

class Dashboard extends Component {
  /*
    When components mounts, fetch user habits from backend
  */
  state = {
    habits: [],
    loading: true
  };

  // todo: DRY up duplicated in ChallengeDashboard
  componentDidMount() {
    this.getHabits();
  }

  getHabits = async () => {
    const habits = await (await fetch(`${process.env.REACT_APP_API_ENPOINT}/api/occurrence_habits`)).json();
    this.setState({ habits, loading: false });
  };

  // todo: Dry up duplicated in Dashboard
  handleHabitItemUpdate = (id, numCompleted) => {
    const existingHabits = this.state.habits;
    // 1. Find the habit we are updating
    const habitIndex = this.state.habits.findIndex(habit => habit.id === id);
    const habit = existingHabits[habitIndex];
    // 2. Check if your adding a completion or removing a completion
    const isNewEntry = numCompleted > habit.completed;
    // 2. change the value of num of completed
    habit.completed = numCompleted;
    // Only update the last_updated when a new entry is added.
    if (isNewEntry) {
      // 3. Set the last_updated date to today.
      habit.last_updated = moment().format('Do@HH:mm');
      // 3.5 Update the lastUpdated list so we can keep track of all the dates...
      if (habit.lastUpdated) {
        habit.lastUpdated.push({
          date: moment().format('Do'),
          time: moment().format('HH:mm')
        });
      }
    }
    // 4. Update the state with new habit object but keeping older ones??
    this.setState({ habits: existingHabits });
    // 5. Update the habit in the backend
    this.updateHabit(existingHabits[habitIndex], id);
  };

  // todo: DRY up duplicated in ChallengeDashboard
  updateHabit = async (habitDetails, id) => {
    const requestDetails = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(habitDetails)
    };

    await (await fetch(`${process.env.REACT_APP_API_ENPOINT}/api/occurrence_habits/${id}`, requestDetails)).json();
    console.log(`Habit: ${id} updated...`);
  };

  // todo: DRY up duplicated in ChallengeDashboard
  handleHabitDelete = async id => {
    await (await fetch(`${process.env.REACT_APP_API_ENPOINT}/api/occurrence_habits/${id}`, {
      method: 'DELETE'
    })).json();
    this.getHabits();
  };

  render() {
    if (this.state.loading) {
      return <Loader />;
    }
    return (
      <Fragment>
        <MonthlyDashboard
          habits={this.state.habits}
          onHabitItemUpdate={this.handleHabitItemUpdate}
          onHabitDelete={this.handleHabitDelete}
        />
        {/* <ChallengeDashboard /> */}
      </Fragment>
    );
  }
}

export default Dashboard;
