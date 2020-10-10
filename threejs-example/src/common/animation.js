import { interpolate } from './math';

/**
 * 三维物体运动函数
 * @param {start} 出发地，一个带有三维坐标的对象
 * @param {end} 目的地，一个带有三维坐标的对象 
 * @param {duration} 从出发地到目的地的时间 
 * @param {callback} 移动位置的回调函数，接收一个三维坐标的对象为参数
 */

export function move({ start, end, duration, callback }) {
  const frameNumber = 60;
  const interpolateNumber = duration / 1000 * frameNumber;
  const moveXs = interpolate({ start: start.x, end: end.x, number: interpolateNumber });
  const moveYs = interpolate({ start: start.y, end: end.y, number: interpolateNumber });
  const moveZs = interpolate({ start: start.z, end: end.z, number: interpolateNumber });

  let index = 0;
  let interval = setInterval(() => {
    callback({
      x: moveXs[index],
      y: moveYs[index],
      z: moveZs[index]
    });
    if (++index === interpolateNumber) {
      clearInterval(interval);
    }
  }, duration / interpolateNumber);
}

/**
 * 三维物体旋转函数，逻辑和移动是相同的
 * @param {start} 开始角度，一个带有三维角度的对象
 * @param {end} 结束角度，一个带有三维角度的对象 
 * @param {duration} 旋转持续时间 
 * @param {callback} 旋转操作的回调函数，接收一个三维角度的对象为参数
 */

export function rotate({ start, end, duration, callback }) {
  move({ start, end, duration, callback });
}
