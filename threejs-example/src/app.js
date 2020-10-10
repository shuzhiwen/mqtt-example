import React from 'react';
import * as THREE from 'three';
import poetry from './data/poetry.json';
import { WEBGL } from './common/webgl';
import { images } from './data/news.json';
import Modal, { Creator } from './components/modal';
import './app.css';

// 网站空间模型
const modal = new Modal.Create();

export default function App() {
  const [ base, length ] = [ 100, 400 ];
  const [ yearStart, yearEnd, yearDistance ] = [ 2000, 2020, 300 ];
  const xRange = new Array(length).fill(base).map((v, i) => (i < length / 2 ? v + i : -v - i + length / 2));
  const yRange = new Array(length).fill(base).map((v, i) => (i < length / 2 ? v + i : -v - i + length / 2));

  modal.bindMouse({ angle: 60 });
  modal.bindScroll({ distance: 20, z: true });
  modal.drawTimeLine({ start: yearStart, end: yearEnd, yearDistance });

  // 添加文字
  poetry.forEach(({ paragraphs }) => {
    const x = xRange[Math.floor(Math.random() * length)];
    const y = yRange[Math.floor(Math.random() * length)];
    const z = Math.floor(Math.random() * (yearEnd - yearStart - 1)) * yearDistance;
    const ray = new THREE.Vector3(x, y, 0);
    const angleY = ray.angleTo(new THREE.Vector3(0, 1, 0));

    // 创建一个文字对象
    const { object } = Creator.createText({
      position: { x, y, z },
      rotation: { x: 0, y: Math.abs(angleY - Math.PI / 2) * (x > 0 ? -1 : 1), z: 0 },
      text: paragraphs[Math.floor(Math.random() * paragraphs.length)],
      size: 20,
      width: 400,
      height: 100
    });

    modal.scene.add(object);
  });

  // 添加图片
  images.forEach(({ year, month, source }) => {
    const x = xRange[Math.floor(Math.random() * length)];
    const y = yRange[Math.floor(Math.random() * length)];
    const z = (year + month / 12 - 2000) * yearDistance;
    const ray = new THREE.Vector3(x, y, 0);
    const angleY = ray.angleTo(new THREE.Vector3(0, 1, 0));

    // 创建一个图片对象
    const { object } = Creator.createImage({
      position: { x, y, z },
      rotation: { x: 0, y: Math.abs(angleY - Math.PI / 2) * (x > 0 ? -1 : 1), z: 0 },
      source: require(`${source}`),
      width: 200,
      height: 200
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

  // 绘制全局动态背景
  return (
    <div className="container">
      <div id="stars" />
    </div>
  );
}
