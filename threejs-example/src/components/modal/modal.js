import * as THREE from 'three';
import Event from '../event';
import { interpolate, increment } from '../../common/math';
import { move } from '../../common/animation';
import { makeTextCanvas } from './canvas';

class Create {
  constructor() {
    //事件注册，指定每帧会调用的函数
    this.opacityEvent = new Event();
    //新建相机
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 1000);
    //移动相机坐标，防止和对象重叠
    this.camera.position.set(0, 0, 100);
    //相机视角
    this.camera.lookAt(0, 0, 0);
    //新建渲染器
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    //设置渲染器大小
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    //添加dom元素
    document.body.appendChild(this.renderer.domElement);
    //新建场景
    this.scene = new THREE.Scene();
  }

  //绘制时间轴
  drawTimeLine = ({ start, end, distance = 200 }) => {
    for (let index = start; index <= end; index++) {
      //创建对象和纹理
      const { object, material } = this.drawTexts({
        position: new THREE.Vector3(0, 0, distance * (index - start)),
        text: index
      });

      //透明度控制函数
      const transparencyControl = () => {
        const spacingZ = Math.abs(this.camera.position.z - object.position.z);
        if (spacingZ < distance / 3) {
          material.opacity = (spacingZ - 20) / distance;
        } else if (spacingZ > distance * 2 / 3) {
          material.opacity = (distance - spacingZ) / distance;
        }
      };

      //初始文字透明度
      material.opacity = 0.5;
      //注册函数
      this.opacityEvent.registerEvent(transparencyControl, index);
      //添加对象
      this.scene.add(object);
    }
  };

  //绘制时间轴上的文字
  drawTexts = ({ position, name, text, size, width, height, color, background }) => {
    //创建平面和纹理
    const geometry = new THREE.PlaneGeometry(width ? width / 4 : 100, height ? height / 4 : 100);
    const material = new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(makeTextCanvas({ text, size, width, height, color, background })),
      transparent: true
    });

    //创建新的对象用于展示文字
    const object = new THREE.Mesh(geometry, material);
    object.position.set(position.x, position.y, position.z);
    name && (object.name = name);

    return { object, material };
  };

  //设置相机坐标位置，由滚动事件控制
  bindScroll = ({ distance = 20, x, y, z }) => {
    document.body.onmousewheel = (e) => {
      //动画持续时间
      const duration = 500;
      //插值数量
      const number = distance;
      //插值数值数组
      const distances = interpolate({ start: 0, end: distance, number: number });
      //增量数值数组
      const increments = increment(distances);

      increments.forEach((displacement, index) => {
        setTimeout(() => {
          x && (this.camera.position.x += e.wheelDelta > 0 ? displacement : -displacement);
          y && (this.camera.position.y += e.wheelDelta > 0 ? displacement : -displacement);
          z && (this.camera.position.z += e.wheelDelta > 0 ? displacement : -displacement);
          //触发注册的函数
          this.opacityEvent.fireAllEvents();
        }, duration / number * index);
      });
    };
  };

  //设置相机视角，由鼠标位置控制
  bindMouse = ({ angle = 30 }) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(0, 0);
    let activeObject = null;
    let activePosition = new THREE.Vector3();

    document.body.onclick = () => {
      //通过摄像机和鼠标位置更新射线
      raycaster.setFromCamera(mouse, this.camera);
      //计算相交的点
      const intersects = raycaster.intersectObjects(this.scene.children);
      //控制物体移动
      if (intersects.length !== 0 && intersects[0]) {
        const originObject = activeObject;
        const originPosition = new THREE.Vector3(activePosition.x, activePosition.y, activePosition.z);
        const targetObject = intersects[0].object;
        const targetPosition = targetObject.position;
        const duration = 1000;

        //原来的激活对象返回到原位置
        if (originObject !== null && !originObject.isMoving) {
          //重置激活的对象
          if (targetObject === originObject) activeObject = null;
          //移动对象
          originObject.isMoving = true; //标记
          setTimeout(() => (originObject.isMoving = false), duration);
          move({
            departure: originObject.position,
            destination: originPosition,
            duration: duration,
            moveFunction: (position) => originObject.position.set(position.x, position.y, position.z)
          });
        }

        //新的激活对象移动到摄像头正前方
        if (!targetObject.isMoving && targetObject !== originObject) {
          //设置新坐标
          activeObject = targetObject;
          activePosition.set(targetPosition.x, targetPosition.y, targetPosition.z);
          //移动对象
          targetObject.isMoving = true;
          setTimeout(() => (targetObject.isMoving = false), duration);
          move({
            departure: targetPosition,
            destination: { x: 0, y: 0, z: this.camera.position.z - 50 },
            duration: duration,
            moveFunction: (position) => targetObject.position.set(position.x, position.y, position.z)
          });
        }
      }
    };

    document.body.onmousemove = (e) => {
      const { clientX, clientY } = e;
      const { clientWidth, clientHeight } = document.body;
      const offsetX = (clientX - clientWidth / 2) / (clientWidth / 2);
      const offsetY = (clientY - clientHeight / 2) / (clientHeight / 2);

      //鼠标位置转换为设备坐标，范围是（-1，1）
      mouse.x = e.clientX / window.innerWidth * 2 - 1;
      mouse.y = e.clientY / window.innerHeight * -2 + 1;

      //相机将要移动的视角
      const x = offsetX * angle;
      const y = -offsetY * angle;
      const z = this.camera.position.z - 100;

      this.camera.lookAt(x, y, z);
    };
  };

  //设置屏幕刷新的时候更新场景
  animate = (extraAnimate) => {
    //额外的变换
    typeof extraAnimate === 'function' && extraAnimate();
    //渲染下一帧
    this.renderer.render(this.scene, this.camera);
    //下次绘制前调用此函数
    requestAnimationFrame(() => this.animate(extraAnimate));
  };
}

export default { Create };
