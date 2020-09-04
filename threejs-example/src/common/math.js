//逻辑斯蒂函数变化曲线（近似）
export function logistic({ start, end, number }) {
  const min = -10;
  const max = 10;
  const numbers = new Array(0);
  const distance = end - start;
  const step = distance / number;
  const compute = (percentage) => 1 / (1 + Math.E ** -(min + percentage * (max - min)));

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
