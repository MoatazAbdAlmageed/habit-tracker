import React from 'react';
import PropTypes from 'prop-types';
import SummaryChart from './SummaryChart';

const SummaryPanel = ({ habit }) => (
  <div className="col-sm-2 mb-2">
    <div className="card text-white bg-inverse p-4">
      <div className="card-body">
        <h4 className="card-title">{habit.name}</h4>
        <p className="card-text">
          Total: {habit.totalCompletions} / {habit.totalTarget}
        </p>
        <SummaryChart habitDetails={habit} />
      </div>
    </div>
  </div>
);

const SummaryTable = ({ name, values }) => (
  <tr>
    <th scope="row">{name}</th>
    {values.map(element => <td key={element} className={element}>{element}</td>)}
  </tr>
);

SummaryTable.propTypes = {
  name: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.string).isRequired,

};

SummaryPanel.propTypes = {
  habit: PropTypes.shape({
    name: PropTypes.string.isRequired,
    totalCompletions: PropTypes.number.isRequired,
    totalTarget: PropTypes.number.isRequired,
  }).isRequired,
};
export { SummaryPanel, SummaryTable };
