import React from 'react';
import PropTypes from 'prop-types';
import propTypes from 'prop-types';

export default function Picker(props) {
  const { value, onChange, options } = props;

  return (
    <span>
      <h1>{value}</h1>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(option =>
          <option key={option} value={option}>
            {option}
          </option>
        )}
      </select>
    </span>
  )
}

Picker.propTypes = {
  options: propTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}