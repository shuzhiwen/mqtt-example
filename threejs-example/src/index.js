import Modal from './components/modal';
import { WEBGL } from './common/webgl';
import { data } from './data/news.json';
import './index.css';

const modal = new Modal.Create(Modal.Line.geometry, Modal.Line.material);

modal.bindMouse({ angle: 50 });
modal.bindScroll({ distance: 20, z: true });
modal.drawTimeLine({ start: 2000, end: 2020, distance: 300 });

data.forEach(({ year, month, news }) => {
  const xRange = [ -100, 100 ];
  const yRange = [ -100, 100 ];

  const { object } = modal.drawTexts({
    x: xRange[Math.round(Math.random())],
    y: yRange[Math.round(Math.random())],
    z: (year + month / 12 - 2000) * 300,
    text: news,
    size: 10
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
