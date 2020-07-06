import { combineReducers } from 'redux';
import {
  RECEIVE_POSTS,
  REQUEST_POSTS,
  SELECT_SUBREDDIT,
  INVALIDATE_SUBREDDIT
} from './actions';

const selectedSubreddit = (
  state = 'reactjs',
  action
) => {
  switch (action.type) {
    case SELECT_SUBREDDIT:
      return action.subreddit;
    default:
      return state;
  }
}

const posts = (
  state = {
    isFetching: false,
    didInvalidate: false,
    items: []
  },
  action
) => {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
      return Object.assign({}, state, {
        didInvalidate: true
      });
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      });
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      })
    default:
      return state;
  }
}

//将Reducer进行拆分，细化Reducer管理
const postsBySubreddit = (state = {}, action) => {
  switch (action.type) {
    case INVALIDATE_SUBREDDIT:
    case REQUEST_POSTS:
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        [action.subreddit]: posts(state[action.subreddit], action)
      });
    default:
      return state;
  }
}

//Reducers的命名需要和state中的名字保持一致（顶层）
export default combineReducers({
  selectedSubreddit,
  postsBySubreddit
});