//state结构模板
export const demoState = {
  selectedSubreddit: 'frontend',
  postsBySubreddit: {
    frontend: {
      isFetching: true,
      didInvalidate: false,
      items: []
    },
    reactjs: {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: 1439478405547,
      items: [{
        id: 42,
        title: 'Confusion about Flux and Relay'
      }]
    }
  }
}

export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT';
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT';

export const selectSubreddit = (subreddit) => ({
  type: SELECT_SUBREDDIT,
  subreddit
});

export const invalidateSubreddit = (subreddit) => ({
  type: INVALIDATE_SUBREDDIT,
  subreddit
});

const requestPosts = (subreddit) => ({
  type: REQUEST_POSTS,
  subreddit
});

const receivePosts = (subreddit, json) => ({
  type: RECEIVE_POSTS,
  subreddit,
  posts: json.data.children.map(child => child.data),
  receivedAt: Date.now()
});

//redux-thunk中间件
const fetchPosts = (subreddit) => {
  return dispatch => {
    dispatch(requestPosts(subreddit));
    fetch(`https://www.reddit.com/r/${subreddit}.json`)
      .then(response => response.json())
      .then(json => dispatch(receivePosts(subreddit, json)));
  }
}

const shouldUpdateReddit = (state, subreddit) => {
  const posts = state.postsBySubreddit[subreddit];

  if (!posts) {
    return true;
  } else if (posts.isFetching) {
    return false;
  } else {
    return posts.didInvalidate;
  }
}

//redux-thunk中间件调用另一个redux-thunk中间件
export const fetchPostsIfNeeded = (subreddit) => {
  return (dispatch, getState) => {
    if (shouldUpdateReddit(getState(), subreddit)) {
      return dispatch(fetchPosts(subreddit));
    }
  }
} 