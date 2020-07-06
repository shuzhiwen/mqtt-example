import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  selectSubreddit,
  invalidateSubreddit,
  fetchPostsIfNeeded
} from '../redux/actions';
import Picker from '../components/Picker';
import Posts from '../components/Posts';

function AsyncApp(props) {
  //更改选择的字表
  const handleChange = (nextSubreddit) => {
    props.dispatch(selectSubreddit(nextSubreddit));
  }
  //响应更新字表数据
  const handleRefreshClick = (e) => {
    e.preventDefault();
    const { dispatch, selectedSubreddit } = props;
    dispatch(invalidateSubreddit(selectedSubreddit));
    dispatch(fetchPostsIfNeeded(selectedSubreddit));
  }
  //传入的props变更时刷新数据
  useEffect(() => {
    const { dispatch, selectedSubreddit } = props;
    dispatch(fetchPostsIfNeeded(selectedSubreddit));
  }, [props]);

  const {
    selectedSubreddit,
    lastUpdated,
    posts,
    isFetching
  } = props;
  return (
    <div>
      <Picker
        value={selectedSubreddit}
        onChange={handleChange.bind(this)}
        options={['reactjs', 'frontend']}
      />
      <p>
        {lastUpdated && (
          <span>
            Last updated at {new Date(lastUpdated).toLocaleTimeString()}.{' '}
          </span>
        )}
        {!isFetching && (
          <a href='#' onClick={handleRefreshClick.bind(this)}>
            Refresh
          </a>
        )}
      </p>
      {isFetching && posts.length === 0 && <h2>Loading...</h2>}
      {!isFetching && posts.length === 0 && <h2>Empty.</h2>}
      {posts.length > 0 && (
        <div style={{ opacity: isFetching ? 0.5 : 1 }}>
          <Posts posts={posts} />
        </div>
      )}
    </div>
  )
}

AsyncApp.propTypes = {
  selectedSubreddit: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

//初始化时会根据Reducer定义的默认值进行映射
function mapStateToProps(state) {
  const { selectedSubreddit, postsBySubreddit } = state;
  const { isFetching, lastUpdated, items: posts } = postsBySubreddit[
    selectedSubreddit
  ] || {
    isFetching: true,
    items: []
  }

  return {
    selectedSubreddit,
    posts,
    isFetching,
    lastUpdated
  }
}

export default connect(mapStateToProps)(AsyncApp);