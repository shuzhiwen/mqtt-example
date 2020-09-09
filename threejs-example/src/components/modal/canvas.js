//创建文字画布用于材质
export const makeTextCanvas = ({
  text,
  size = 50,
  width = 200,
  height = 200,
  color = '#ffffff',
  background = '#00000000'
}) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
  ctx.font = `${size}px bold`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  return canvas;
};
