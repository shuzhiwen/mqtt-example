import Modal from './components/modal';
import { WEBGL } from './common/webgl';
import './index.css';

const modal = new Modal.Create(Modal.Line.geometry, Modal.Line.material);
modal.bindMouse();
modal.bindScroll({ distance: 20, z: true });
modal.drawTimeLine({ start: 2000, end: 2020 });

if (WEBGL.isWebGLAvailable()) {
  // Initiate function or other initializations here
  modal.animate();
} else {
  var warning = WEBGL.getWebGLErrorMessage();
  document.getElementById('container').appendChild(warning);
}
