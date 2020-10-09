import * as THREE from 'three';
import { makeTextCanvas, makeImageCanvas } from './canvas';

// 绘制时间轴上的文字
export const createText = ({ position, rotation, name, text, size, width, height, color, background }) => {
  // 创建平面和纹理
  const geometry = new THREE.PlaneGeometry(width ? width / 4 : 100, height ? height / 4 : 100);
  const material = new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(makeTextCanvas({ text, size, width, height, color, background })),
    transparent: true
  });

  // 创建新的对象用于展示文字
  const object = new THREE.Mesh(geometry, material);
  object.position.set(position.x, position.y, position.z);
  object.rotation.set(rotation.x, rotation.y, rotation.z);
  name && (object.name = name);

  return { object, material };
};

// 绘制时间轴上的图片
export const createImage = ({ position, rotation, name, source, width, height }) => {
  // 创建平面和纹理
  const geometry = new THREE.PlaneGeometry(width ? width / 4 : 100, height ? height / 4 : 100);
  const material = new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(makeImageCanvas({ source, width, height })),
    transparent: true
  });

  // 创建新的对象用于展示图片
  const object = new THREE.Mesh(geometry, material);
  object.position.set(position.x, position.y, position.z);
  object.rotation.set(rotation.x, rotation.y, rotation.z);
  name && (object.name = name);

  return { object, material };
};
