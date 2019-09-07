import * as THREE from 'three';
import { CinematicCamera } from 'three/examples/jsm/cameras/CinematicCamera';
import { random } from 'mathjs';
import dat from 'dat.gui';

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;

const mouse = new THREE.Vector2();
const radius = 100;
let theta = 0;

const container = document.createElement('div');
document.body.appendChild(container);

const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(60, ASPECT, 0.1, 1000);
const camera = new CinematicCamera(60, ASPECT, 0.1, 1000);
camera.setLens(20);
camera.position.set(2, 1, 500);
scene.background = new THREE.Color(0xf0f0f0);

const nCubes = 1500;
const cubes = [];
const geometry = new THREE.BoxBufferGeometry(20, 20, 20);
for (let i = 0; i < nCubes; i++) {
  const mesh = new THREE.Mesh(
    // new THREE.BoxBufferGeometry(40, 40, 40),
    geometry,
    new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
  );
  mesh.position.set(random(-400, 400), random(-400, 400), random(-400, 400));
  cubes.push(mesh);
  scene.add(mesh);
}

const raycaster = new THREE.Raycaster();

camera.lookAt(0, 0, 0);

const amlight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(amlight);
const light = new THREE.DirectionalLight();
light.position.set(1, 1, 1).normalize();
scene.add(light);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
container.appendChild(renderer.domElement);

window.addEventListener('mousemove', onDocumentMouseMove, false);

animate();

function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (event.clientY / window.innerHeight) * 2 + 1;
}

function animate(time) {
  render();
  requestAnimationFrame(animate);
}

let INTERSECTED = null;
function render() {
  theta += 0.1;
  camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta));
  camera.position.y = radius * Math.sin(THREE.Math.degToRad(theta));
  camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta));
  camera.lookAt(scene.position);
  camera.updateMatrixWorld();

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    const targetDistance = intersects[0].distance;
    camera.focusAt(targetDistance);

    if (INTERSECTED !== intersects[0].object) {
      if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

      INTERSECTED = intersects[0].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex(0xff0000);
    }
  } else {
    if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
    INTERSECTED = null;
  }

  if (camera.postprocessing.enabled) {
    camera.renderCinematic(scene, renderer);
  } else {
    scene.overrideMaterial = null;
    renderer.clear();
    renderer.render(scene, camera);
  }
}