import * as THREE from 'three';
import Event from '../event';
import { interpolate, increment } from '../../common/math';
import { change3D } from '../../common/animation';
import { createText } from './creator';

class Create {
  constructor() {
    this.minCameraView = 10;
    this.maxCameraView = 1000;
    this.cameraAspect = window.innerWidth / window.innerHeight;
    // 事件注册，指定每帧会调用的函数
    this.opacityEvent = new Event();
    // 新建相机
    this.camera = new THREE.PerspectiveCamera(75, this.cameraAspect, this.minCameraView, this.maxCameraView);
    // 移动相机坐标，防止和对象重叠
    this.camera.position.set(0, 0, 100);
    // 相机观察点
    this.camera.lookAt(0, 0, 0);
    // 新建渲染器
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    // 设置渲染器大小
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // 添加dom元素
    document.body.appendChild(this.renderer.domElement);
    // 新建场景
    this.scene = new THREE.Scene();
  }

  // 绘制时间轴
  drawTimeLine = ({ start, end, distance = 200 }) => {
    this.camera.position.set(0, 0, (end - start + 1) * distance);
    for (let index = start; index <= end; index++) {
      // 创建对象和纹理
      const { object, material } = createText({
        position: { x: 0, y: 0, z: distance * (index - start) },
        rotation: { x: 0, y: 0, z: 0 },
        name: 'timeLine',
        text: index
      });
      // 初始文字透明度
      material.opacity = 0;
      // 注册透明度控制函数
      this.opacityEvent.registerEvent(() => {
        const spacing = Math.abs(this.camera.position.z - object.position.z);
        // 根据和相机的距离设置透明度
        if (spacing - this.minCameraView < distance / 5) {
          material.opacity = (spacing - this.minCameraView) / distance - 0.1;
        } else if (spacing > distance * 4 / 5) {
          material.opacity = (distance - spacing) / distance - 0.1;
        }
      }, index);
      // 添加对象
      this.scene.add(object);
    }
  };

  // 设置相机坐标位置，由滚动事件控制
  bindScroll = ({ distance = 20, x, y, z }) => {
    // 滚轮事件计数，用于叠加
    let scrollCount = 0;

    document.body.onmousewheel = (e) => {
      // 动画持续时间
      const duration = 500;
      // 插值数量
      const number = distance;
      // 插值数值数组
      const distances = interpolate({ start: 0, end: distance, number: number });
      // 增量数值数组
      let increments = increment(distances);

      ++scrollCount;
      increments = increments.map((item) => item * scrollCount);
      increments.forEach((displacement, index) => {
        setTimeout(() => {
          x && (this.camera.position.x += e.wheelDelta > 0 ? displacement : -displacement);
          y && (this.camera.position.y += e.wheelDelta > 0 ? displacement : -displacement);
          z && (this.camera.position.z += e.wheelDelta > 0 ? displacement : -displacement);
          // 触发注册的函数
          this.opacityEvent.fireAllEvents();
          // 此次事件结束，取消叠加影响
          if (index === increments.length - 1) --scrollCount;
        }, duration / number * index);
      });
    };
  };

  // 设置相机视角，由鼠标位置控制
  bindMouse = ({ angle = 30 }) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(0, 0);
    let activeObject = null;
    let activePosition = new THREE.Vector3();
    let activeRotation = new THREE.Vector3();

    document.body.onclick = () => {
      // 通过摄像机和鼠标位置更新射线
      raycaster.setFromCamera(mouse, this.camera);
      // 计算相交的点，过滤时间轴物体
      const intersects = raycaster
        .intersectObjects(this.scene.children)
        .filter((intersect) => intersect.object.name !== 'timeLine');
      // 控制物体移动
      if (intersects.length !== 0 && intersects[0]) {
        const originObject = activeObject;
        const originPosition = new THREE.Vector3(activePosition.x, activePosition.y, activePosition.z);
        const originRotation = new THREE.Vector3(activeRotation.x, activeRotation.y, activeRotation.z);
        const targetObject = intersects[0].object;
        const targetPosition = targetObject.position;
        const targetRotation = targetObject.rotation;
        const duration = 1000;

        // 原来的激活对象返回到原位置
        if (originObject !== null) {
          // 重置激活的对象
          if (targetObject === originObject) activeObject = null;
          // 标记运动状态
          originObject.isMoving = true;
          setTimeout(() => (originObject.isMoving = false), duration);
          // 开始移动对象
          change3D({
            duration,
            start: originObject.position,
            end: originPosition,
            callback: (position) => originObject.position.set(position.x, position.y, position.z)
          });
          // 改变对象角度
          change3D({
            duration,
            start: originObject.rotation,
            end: originRotation,
            callback: (rotation) => originObject.rotation.set(rotation.x, rotation.y, rotation.z)
          });
        }

        // 新的激活对象移动到摄像头正前方
        if (!targetObject.isMoving && targetObject !== originObject) {
          // 设置新坐标
          activeObject = targetObject;
          activePosition.set(targetPosition.x, targetPosition.y, targetPosition.z);
          activeRotation.set(targetRotation.x, targetRotation.y, targetRotation.z);
          // 标记运动状态
          targetObject.isMoving = true;
          setTimeout(() => (targetObject.isMoving = false), duration);
          // 开始移动对象
          change3D({
            duration,
            start: targetPosition,
            end: { x: 0, y: 0, z: this.camera.position.z - 50 },
            callback: (position) => targetObject.position.set(position.x, position.y, position.z)
          });
          // 改变对象角度
          change3D({
            duration,
            start: targetRotation,
            end: { x: 0, y: 0, z: 0 },
            callback: (rotation) => targetObject.rotation.set(rotation.x, rotation.y, rotation.z)
          });
        }
      }
    };

    document.body.onmousemove = (e) => {
      // 鼠标位置转换为设备坐标，范围是（-1，1）
      mouse.x = e.clientX / window.innerWidth * 2 - 1;
      mouse.y = e.clientY / window.innerHeight * -2 + 1;

      // 相机将要移动的视角
      const x = mouse.x * angle;
      const y = mouse.y * angle;
      const z = this.camera.position.z - 100;

      this.camera.lookAt(x, y, z);
    };
  };

  // 设置屏幕刷新的时候更新场景
  animate = (extraAnimate) => {
    // 额外的变换
    typeof extraAnimate === 'function' && extraAnimate();
    // 渲染下一帧
    this.renderer.render(this.scene, this.camera);
    // 下次绘制前调用此函数
    requestAnimationFrame(() => this.animate(extraAnimate));
  };
}

export default { Create };
