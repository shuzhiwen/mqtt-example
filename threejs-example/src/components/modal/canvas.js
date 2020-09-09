//创建文字画布用于材质
export const makeTextCanvas = ({
  text,
  size = 50,
  width = 200,
  height = 200,
  color = '#ffffff',
  background = '#00000000',
  depth = 3
}) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const devicePixelRatio = window.devicePixelRatio || 1;
  const backingStoreRatio = ctx.webkitBackingStorePixelRatio || 1;
  const ratio = depth || devicePixelRatio / backingStoreRatio;

  //将 canvas 的宽高设置成容器宽高的 2 倍
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  //放大图像
  ctx.scale(ratio, ratio);
  //设置文字
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
  ctx.font = `${size}px bold`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  return canvas;
};
