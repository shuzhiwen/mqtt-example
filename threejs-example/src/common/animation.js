import { interpolate } from './math';

/**
 * 三维物体运动（改变）函数
 * @param {start} 开始状态，一个带有三维属性的对象
 * @param {end} 结束状态，一个带有三维属性的对象 
 * @param {duration} 从开始状态到结束状态的持续时间 
 * @param {callback} 回调函数，接收一个带有三维属性的对象为参数
 * @param {type} 缓动函数类型
 */

export function change3D({ start, end, duration, callback, type = 'ease-out' }) {
  const frameNumber = 60;
  const interpolateNumber = duration / 1000 * frameNumber;
  const changeXs = interpolate({ start: start.x, end: end.x, number: interpolateNumber, type });
  const changeYs = interpolate({ start: start.y, end: end.y, number: interpolateNumber, type });
  const changeZs = interpolate({ start: start.z, end: end.z, number: interpolateNumber, type });

  let index = 0;
  let interval = setInterval(() => {
    callback({
      x: changeXs[index],
      y: changeYs[index],
      z: changeZs[index]
    });
    if (++index === interpolateNumber) {
      clearInterval(interval);
    }
  }, duration / interpolateNumber);

  return () => clearInterval(interval);
}
