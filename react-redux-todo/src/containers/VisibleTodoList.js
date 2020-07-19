import { connect } from 'react-redux';
import { toggleTodo } from '../redux/actions';
import TodoList from '../components/TodoList';
import { getVisibleTodos } from '../redux/selectors';

const mapStateToProps = state => ({
  todos: getVisibleTodos(state)
});

const mapDispatchToProps = dispatch => ({
  toggleTodo: id => dispatch(toggleTodo(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList);
