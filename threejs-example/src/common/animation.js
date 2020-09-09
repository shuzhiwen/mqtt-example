import { interpolate } from './math';

/**
 * 三维物体运动函数
 * @param {departure} 出发地，一个带有三维坐标的对象
 * @param {destination} 目的地，一个带有三维坐标的对象 
 * @param {duration} 从出发地到目的地的时间 
 * @param {moveFunction} 移动位置的回调函数，接收一个三维坐标的对象为参数
 */
export function move({ departure, destination, duration, moveFunction }) {
  const frameNumber = 60;
  const interpolateNumber = duration / 1000 * frameNumber;
  const moveXs = interpolate({ start: departure.x, end: destination.x, number: interpolateNumber });
  const moveYs = interpolate({ start: departure.y, end: destination.y, number: interpolateNumber });
  const moveZs = interpolate({ start: departure.z, end: destination.z, number: interpolateNumber });

  let index = 0;
  let interval = setInterval(() => {
    moveFunction({
      x: moveXs[index],
      y: moveYs[index],
      z: moveZs[index]
    });
    if (++index === interpolateNumber) {
      clearInterval(interval);
    }
  }, duration / interpolateNumber);
}
