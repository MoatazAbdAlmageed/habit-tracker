import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ChallengeHabit from './ChallengeHabit';
import Loader from './Loader/Loader';

// This class has a lot of duplciate logic from Dashboard.js, I will continue to get it working then refactor/generalize as do not want to do that to early.
class ChallengeDashboard extends Component {
  state = {
    filter_obj: `{"where": {"target_month": "challenge", "year": "${moment().format('YYYY')}"}}`,
    habits: [],
    showCompletedHabits: false,
    loading: true
  };

  // todo: Dry up duplicated in Dashboard
  componentDidMount() {
    this.getHabits();
  }

  getHabits = async () => {
    const results = await (await fetch(`${process.env.REACT_APP_API_ENPOINT}/api/occurrence_habits?filter=${this.state.filter_obj}`,)).json();
    console.log(results);
    this.setState({ habits: results, loading: false });
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
        if (
          habit.lastUpdated.length === 0 ||
          moment().format('Do') !== habit.lastUpdated[habit.lastUpdated.length - 1].date
        ) {
          habit.lastUpdated.push({
            date: moment().format('Do'),
            time: moment().format('HH:mm'),
          });
        }
      }
    }

    // 4. Update the state with new habit object
    this.setState({ habits: existingHabits });
    // 5. Update the habit in the backend
    this.updateHabit(existingHabits[habitIndex], id);
  };

  // todo: DRY up duplicated in Dashboard
  updateHabit = async (habitDetails, id) => {
    const requestDetails = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(habitDetails),
    };
    await (await fetch(`${process.env.REACT_APP_API_ENPOINT}/api/occurrence_habits/${id}`, requestDetails)).json();
    console.log(`Habit: ${id} updated...`);
  };

  // todo: DRY up duplicated in Dashboard
  handleHabitDelete = async (id) => {
    await (await fetch(`${process.env.REACT_APP_API_ENPOINT}/api/occurrence_habits/${id}`, {
      method: 'DELETE',
    })).json();
    this.getHabits();
  };

  handleShowCompletedHabits = () => {
    this.setState(prevState => ({
      showCompletedHabits: !prevState.showCompletedHabits
    }));
  };

  render() {
    const completedHabits = this.state.habits.filter(habit => habit.completed >= habit.target);
    const incompleteHabits = this.state.habits.filter(habit => habit.completed < habit.target);
    if (this.state.loading) {
      return <Loader />;
    }
    return (
      <Fragment>
        <div className="row mb-3 mt-3">
          <div className="ml-auto col-sm-8 text-center">
            <h3>Challenges</h3>
          </div>
          <div className="col-sm-2">
            <Link to="/addhabit/challenge" params={{ habitType: 'challenge' }} className="btn btn-success pull-right">
              Add Habit
            </Link>
          </div>
        </div>
        <div className="mt-2 mb-2 mx-auto">
          {incompleteHabits.map(habit => (
            <ChallengeHabit
              key={habit.name}
              habit={habit}
              onHabitItemUpdated={this.handleHabitItemUpdate}
              onDelete={this.handleHabitDelete}
            />
          ))}
        </div>
        <div className="mt-2 mb-2">
          <div style={{ display: this.state.showCompletedHabits ? '' : 'none' }}>
            {completedHabits.map(habit => (
              <ChallengeHabit
                key={habit.name}
                habit={habit}
                onHabitItemUpdated={this.handleHabitItemUpdate}
                onDelete={this.handleHabitDelete}
              />
            ))}
          </div>
          <button onClick={this.handleShowCompletedHabits} className="btn btn-secondary btn-block mb-3">
            {this.state.showCompletedHabits ? 'Hide Completed' : 'Show Completed'}
          </button>
        </div>
      </Fragment>
    );
  }
}

export default ChallengeDashboard;
