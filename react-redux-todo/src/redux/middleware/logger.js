//打印日志的中间件
const logger = store => next => action => {
  console.group(action.type);
  console.info('dispatching', action);
  const result = next(action);
  console.log('nextState', store.getState());
  console.groupEnd();
  return result;
}

export default logger;