import React from 'react';
import * as THREE from 'three';
import { WEBGL } from './common/webgl';
import { texts, images } from './data/news.json';
import Modal, { Creator } from './components/modal';
import './app.css';

const modal = new Modal.Create();

export default function App() {
  modal.bindMouse({ angle: 60 });
  modal.bindScroll({ distance: 20, z: true });
  modal.drawTimeLine({ start: 2000, end: 2020, distance: 300 });

  // 约束随机坐标范围
  const [ base, length ] = [ 100, 100 ];
  const xRange = new Array(length).fill(base).map((v, i) => (i < length / 2 ? v + i : -v - i + length / 2));
  const yRange = new Array(length).fill(base).map((v, i) => (i < length / 2 ? v + i : -v - i + length / 2));

  // 添加文字
  texts.forEach(({ year, month, news }) => {
    const x = xRange[Math.floor(Math.random() * 200)];
    const y = yRange[Math.floor(Math.random() * 200)];
    const z = (year + month / 12 - 2000) * 300;
    const ray = new THREE.Vector3(x, y, 0);
    const angleY = ray.angleTo(new THREE.Vector3(0, 1, 0));

    // 创建一个文字对象
    const { object } = Creator.createText({
      position: { x, y, z },
      rotation: { x: 0, y: Math.abs(angleY - Math.PI / 2) * (x > 0 ? -1 : 1), z: 0 },
      text: news,
      size: 20,
      width: 400,
      height: 100
    });

    modal.scene.add(object);
  });

  // 添加图片
  images.forEach(({ year, month, source }) => {
    const x = xRange[Math.floor(Math.random() * 200)];
    const y = yRange[Math.floor(Math.random() * 200)];
    const z = (year + month / 12 - 2000) * 300;
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

  return (
    <div className="container">
      <div id="stars" />
      <div id="stars2" />
      <div id="stars3" />
    </div>
  );
}
