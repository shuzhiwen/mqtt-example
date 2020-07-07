const ADD_TODO = 'ADD_TODO';
const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';
const TOGGLE_TODO = 'TOGGLE_TODO';

//id计数
let nextTodoId = 0;

//简便的action creator生成器
function makeActionCreator(type, ...argNames) {
  return (...args) => {
    const actions = { type };

    argNames.forEach((arg, index) => {
      actions[argNames[index]] = args[index];
    });

    return actions;
  }
}

export const addTodo = text => ({
  type: ADD_TODO,
  id: nextTodoId++,
  text
});

export const setVisibilityFilter = makeActionCreator(
  SET_VISIBILITY_FILTER,
  'filter'
);

export const toggleTodo = makeActionCreator(
  TOGGLE_TODO,
  'id'
);

export const visibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}