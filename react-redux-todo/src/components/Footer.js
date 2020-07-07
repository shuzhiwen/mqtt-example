import React from 'react';
import FilterLink from '../containers/FilterLink';
import { visibilityFilters } from '../redux/actions';

const Footer = () => (
  <div>
    <FilterLink filter={visibilityFilters.SHOW_ALL}>SHOW ALL</FilterLink>
    <FilterLink filter={visibilityFilters.SHOW_ACTIVE}>SHOW ACTIVE</FilterLink>
    <FilterLink filter={visibilityFilters.SHOW_COMPLETED}>SHOW COMPLETED</FilterLink>
  </div>
);

export default Footer;