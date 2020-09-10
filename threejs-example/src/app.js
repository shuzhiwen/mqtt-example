import React from 'react';
import { WEBGL } from './common/webgl';
import { data } from './data/news.json';
import Modal, { Creator } from './components/modal';
import './app.css';

const modal = new Modal.Create();

export default function App() {
  modal.bindMouse({ angle: 50 });
  modal.bindScroll({ distance: 20, z: true });
  modal.drawTimeLine({ start: 2000, end: 2020, distance: 300 });

  // 将数据绘制成文字
  data.forEach(({ year, month, news }) => {
    const xRange = [ -100, 100 ];
    const yRange = [ -100, 100 ];
    const x = xRange[Math.round(Math.random())];
    const y = yRange[Math.round(Math.random())];
    const z = (year + month / 12 - 2000) * 300;

    // 创建一个文字对象
    const { object } = Creator.createText({
      position: { x, y, z },
      text: news,
      size: 10,
      width: 200,
      height: 100
    });

    modal.scene.add(object);
  });

  // 检查是否支持 WebGL
  if (WEBGL.isWebGLAvailable()) {
    modal.animate();
  } else {
    const warning = WEBGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
  }

  return (
    <div className="container">
      <div id="stars" />
      <div id="stars2" />
      <div id="stars3" />
    </div>
  );
}
