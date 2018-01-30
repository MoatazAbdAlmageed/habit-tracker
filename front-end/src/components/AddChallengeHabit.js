import React, { Component } from 'react';
import moment from 'moment';
import HabitSuggestion from './HabitSuggestion';

class AddHabit extends Component {

  state = {
    name: '',
    description: '',
    category: '',
    target: 0,
    existing_habits: [],
    filter_obj: '{"where": {"target_month": "challenge"}}',
    year: `${moment().format('YYYY')}`,
    msg: '',
  }

  componentDidMount() {
    this.getHabits();
  }

  onSubmit = async (e) => {
    e.preventDefault();

    // Add habit to db..then redirect
    const newHabit = {
      name: this.state.name,
      description: this.state.description,
      category: this.state.category,
      target: parseInt(this.state.target, 10),
      completed: 0,
      target_month: 'challenge',
      year: this.state.year,
    };

    const filterSettings = `{"name": "${newHabit.name}", "target_month": "challenge"}`;
    const results = await (await fetch(`${process.env.REACT_APP_API_ENPOINT}/api/occurrence_habits/count?where=${filterSettings}`)).json();
    if (results.count === 0) {
      this.addHabit(newHabit);
      console.log(newHabit);
    } else {
      this.setState({ msg: `Habit ${newHabit.name} already exists for month ${newHabit.target_month}` });
    }
  }

  getHabits = async () => {
    const results = await (await fetch(`${process.env.REACT_APP_API_ENPOINT}/api/occurrence_habits?filter=${this.state.filter_obj}`)).json();
    this.setState({ existing_habits: results });
    // .catch(e => console.log(`Failed to get all habits ${e}`));
  }

  handleSelectedHabit = (e) => {
    this.setState({
      name: e.target.getAttribute('data-name'),
      description: e.target.getAttribute('data-description'),
      category: e.target.getAttribute('data-category'),
      target: e.target.getAttribute('data-target'),
    });
    e.preventDefault();
  }

  addHabit = async (habit) => {
    const requestObj = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(habit),
    };

    await (await fetch(`${process.env.REACT_APP_API_ENPOINT}/api/occurrence_habits`, requestObj)).json();
    this.props.history.push('/');
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  render() {
    const habitsElements = this.state.existing_habits.map(habit => <HabitSuggestion key={habit.id} habit={habit} onSelect={this.handleSelectedHabit} />);
    const msgDisplaying = this.state.msg.length > 0 ? <div className="alert alert-info text-center">{this.state.msg}</div> : '';
    return (
      <div>
        <h1 className="m-3 text-center">Add Habit</h1>
        {msgDisplaying}
        <div className="row">
          <div className="ml-auto col-6">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="name">Habit Name:</label>
                <input type="text" className="form-control" name="name" placeholder="Habit Name e.g. Wake up before 8am each day" value={this.state.name} onChange={this.handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <input type="text" className="form-control" name="description" placeholder="Why do you want to complete it?" value={this.state.description} onChange={this.handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <input type="text" className="form-control" name="category" placeholder="Health / Finance / Career" value={this.state.category} onChange={this.handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="habit_mon">Type of Habit:</label>
                <select className="form-control" name="month" value={this.state.month} onChange={this.handleInputChange} required>
                  <option>Challenge Habit</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="target">How many days do you want to do this challenge?</label>
                <input type="number" className="form-control" name="target" step="1" min="1" max="30" placeholder="1" value={this.state.target} onChange={this.handleInputChange} />
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
          <div className="col-3">
            {habitsElements}
          </div>
        </div>
      </div>
    );
  }
}

export default AddHabit;