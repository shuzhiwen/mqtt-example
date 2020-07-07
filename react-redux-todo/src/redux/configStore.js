import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import loggerMiddleware from './middleware/logger';
import monitorReducerEnhancer from './enhancers/monitorReducer';
import rootReducer from './reducers';

//配置store
export default function configureStore(preloadedState) {
  const middlewareEnhancer = applyMiddleware(thunkMiddleware, loggerMiddleware);
  const composeEnhancer = compose(middlewareEnhancer, monitorReducerEnhancer);

  const store = createStore(rootReducer, preloadedState, composeEnhancer);
  return store;
}