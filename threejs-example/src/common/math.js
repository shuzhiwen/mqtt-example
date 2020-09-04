//缓动函数
const easings = {
  linear: (percentage) => percentage,
  'ease-in': (percentage) => percentage ** 2,
  'ease-out': (percentage) => -1 * percentage ** 2 + 2 * percentage,
  'ease-in-out': (percentage) => 1 / (1 + Math.E ** -(-100 + percentage * 200))
};

//插值函数变化曲线（近似）
export function interpolate({ start, end, number, type = 'ease-out' }) {
  const numbers = new Array(0);
  const distance = end - start;
  const step = distance / number;
  const compute = easings[type];

  for (let i = start; start < end ? i <= end : i >= end; i += step) {
    const percentage = (i - start) / distance;
    const coefficient = compute(percentage);

    if (numbers.length < number) {
      numbers.push(start + coefficient * distance);
    }
  }

  //返回曲线插值数据
  return numbers;
}

//从一个原始数值数组中计算出增量数组
export function increment(array) {
  return array.map((number, index) => {
    if (index === 0) {
      return number;
    } else {
      return array[index] - array[index - 1];
    }
  });
}
