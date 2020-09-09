import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './components/modal';
import { WEBGL } from './common/webgl';
import { data } from './data/news.json';
import './index.css';

const modal = new Modal.Create();

modal.bindMouse({ angle: 50 });
modal.bindScroll({ distance: 20, z: true });
modal.drawTimeLine({ start: 2000, end: 2020, distance: 300 });

// 将数据绘制成文字
data.forEach(({ year, month, news }) => {
  const xRange = [ -100, 100 ];
  const yRange = [ -100, 100 ];

  // 创建一个文字对象
  const { object } = modal.drawTexts({
    text: news,
    position: {
      x: xRange[Math.round(Math.random())],
      y: yRange[Math.round(Math.random())],
      z: (year + month / 12 - 2000) * 300
    },
    size: 10,
    width: 200,
    height: 100
  });

  modal.scene.add(object);
});

if (WEBGL.isWebGLAvailable()) {
  // Initiate function or other initializations here
  modal.animate();
} else {
  var warning = WEBGL.getWebGLErrorMessage();
  document.getElementById('container').appendChild(warning);
}

// css绘制背景图
ReactDOM.render(
  <div className="container">
    <div id="stars" />
    <div id="stars2" />
    <div id="stars3" />
  </div>,
  document.getElementById('root')
);
