import * as THREE from 'three';
import Event from '../event';
import { logistic, increment } from '../../common/math';

class Create {
  constructor() {
    //事件注册，指定每帧会调用的函数
    this.opacityEvent = new Event();

    //新建相机
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 10, 2000);
    //移动相机坐标，防止和对象重叠
    this.camera.position.set(0, 0, 100);
    //相机视角
    this.camera.lookAt(0, 0, 0);

    //新建渲染器
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    //设置渲染器大小
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    //添加dom元素
    document.body.appendChild(this.renderer.domElement);

    //新建场景
    this.scene = new THREE.Scene();
  }

  makeTextCanvas = ({ text, size = 50, width = 200, height = 200, color = '#000000', background = '#00000000' }) => {
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

  //绘制时间轴
  drawTimeLine = ({ start, end, distance = 200 }) => {
    for (let index = start; index <= end; index++) {
      //创建平面和纹理
      const geometry = new THREE.PlaneGeometry(100, 100);
      const material = new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(this.makeTextCanvas({ text: index }))
      });

      //创建新的对象用于展示年份
      const object = new THREE.Mesh(geometry, material);
      object.position.set(0, 0, distance * (index - start));
      material.opacity = 0.5;

      //透明度控制函数
      const transparencyControl = () => {
        const spacingZ = Math.abs(this.camera.position.z - object.position.z);
        if (spacingZ < distance / 3) {
          material.opacity = (spacingZ - 20) / distance;
        } else if (spacingZ > distance * 2 / 3) {
          material.opacity = (distance - spacingZ) / distance;
        }
      };

      //注册函数
      this.opacityEvent.registerEvent(transparencyControl, index);
      //添加对象
      this.scene.add(object);
    }
  };

  //设置相机坐标位置，由滚动事件控制
  bindScroll = ({ distance = 20, x, y, z }) => {
    if (typeof distance === 'number') {
      document.body.onmousewheel = (e) => {
        //动画持续时间
        const duration = 100;
        //插值数量
        const number = distance;
        //插值数值数组
        const distances = logistic({ start: 0, end: distance, number: number });
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
    }
  };

  //设置相机视角，由鼠标位置控制
  bindMouse = (angle = 30) => {
    document.body.onmousemove = (e) => {
      const { clientX, clientY } = e;
      const { clientWidth, clientHeight } = document.body;
      const offsetX = (clientX - clientWidth / 2) / (clientWidth / 2);
      const offsetY = (clientY - clientHeight / 2) / (clientHeight / 2);

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

const Line = {
  material: new THREE.LineBasicMaterial({ color: 0x0000ff }),
  geometry: new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-10, 0, 0),
    new THREE.Vector3(0, 10, 0),
    new THREE.Vector3(10, 0, 0)
  ])
};

export default { Create, Line };
