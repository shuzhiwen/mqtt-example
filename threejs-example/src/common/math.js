// 缓动函数
export const easings = {
  linear: (percentage) => percentage,
  'ease-in': (percentage) => percentage ** 2,
  'ease-out': (percentage) => -1 * percentage ** 2 + 2 * percentage
};

/**
 * 插值函数变化曲线（近似）
 * @param {start} 开始的值，不受 end 约束
 * @param {end} 结束的值，不受 start 约束
 * @param {number} 插值数量
 * @param {type} 缓动函数类型
 * @return {numbers} 插值数据
 */

export function interpolate({ start, end, number, type = 'ease-out' }) {
  const numbers = new Array(0);
  const distance = end - start;
  const step = distance / number;
  const compute = easings[type];

  if (step === 0) {
    return new Array(number).fill(start);
  }

  for (let i = start; start < end ? i <= end : i >= end; i += step) {
    const percentage = (i - start) / distance;
    const coefficient = compute(percentage);

    if (numbers.length < number) {
      numbers.push(start + coefficient * distance);
    }
  }

  return numbers;
}

/**
 * 从一个原始数值数组中计算出增量数组
 * @param {array} 一组散点数值
 * @return {array} 一组增量数值
 */

export function increment(array) {
  return array.map((number, index) => {
    if (index === 0) {
      return number;
    } else {
      return array[index] - array[index - 1];
    }
  });
}
