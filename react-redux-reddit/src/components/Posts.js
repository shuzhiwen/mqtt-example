import React from 'react';
import PropTypes from 'prop-types';

export default function Posts(props) {
  return (
    <ul>
      {props.posts.map((post, index) => (
        <li key={index}>
          {post.title}
        </li>
      ))}
    </ul>
  )
}

Posts.propTypes = {
  posts: PropTypes.array.isRequired
}