export function logistic({ start, end, step }) {
  //逻辑斯蒂函数变化曲线（近似）
  if (typeof start === 'number' && typeof end === 'number' && end > start) {
    const min = -10;
    const max = 10;
    const compute = (percentage) => 1 / (1 + Math.E ** -(min + percentage * (max - min)));

    let numbers = new Array(0);
    let distance = end - start;

    for (let i = start; i <= end; i += step) {
      const percentage = (i - start) / distance;
      const coefficient = compute(percentage);

      numbers.push(start + coefficient * distance);
    }

    //返回曲线插值数据
    return numbers;
  }
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
console.log(increment([ 0, 1, 2, 3, 4 ]));
