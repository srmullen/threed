import * as THREE from 'three';

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const AMOUNT = 6;

let camera, scene, renderer, cylinder;

const container = document.createElement('div');
document.body.appendChild(container);

init();
animate();

function init() {
  const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;
  const WIDTH = (SCREEN_WIDTH / AMOUNT) * window.devicePixelRatio;
  const HEIGHT = (SCREEN_HEIGHT / AMOUNT) * window.devicePixelRatio;

  const cameras = [];
  for (let y = 0; y < AMOUNT; y++) {
    for (let x = 0; x < AMOUNT; x++) {
      const subcamera = new THREE.PerspectiveCamera(40, ASPECT_RATIO, 0.1, 10);
      subcamera.viewport = new THREE.Vector4(
        Math.floor(x * WIDTH),
        Math.floor(y * HEIGHT),
        Math.ceil(WIDTH),
        Math.ceil(HEIGHT)
      );
      subcamera.position.x = (x / AMOUNT) - 0.5;
      subcamera.position.y = 0.5 - (y / AMOUNT);
      subcamera.position.z = 1.5;
      subcamera.position.multiplyScalar(2);
      subcamera.lookAt(0, 0, 0);
      subcamera.updateMatrixWorld();
      cameras.push(subcamera);
    }
  }

  scene = new THREE.Scene();
  camera = new THREE.ArrayCamera(cameras);
  camera.position.z = 3;

  scene.add(new THREE.AmbientLight(0x222244));
  const light = new THREE.DirectionalLight();
  light.position.set(0.5, 0.5, 1);
  light.castShadow = true;
  light.shadow.camera.zoom = 4; // tighter shadow map
  scene.add(light);

  const background = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(100, 100),
    new THREE.MeshPhongMaterial({ color: 0x000066 })
  );
  background.receiveShadow = true;
  background.position.set(0, 0, -1);
  scene.add(background);
  
  cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 1, 32),
    new THREE.MeshPhongMaterial({ color: 0xff0000 })
  );
  cylinder.castShadow = true;
  cylinder.receiveShadow = true;
  scene.add(cylinder);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);
}

function animate(time) {
  requestAnimationFrame(animate);

  cylinder.rotation.x = Math.sin(time * 0.001);
  cylinder.rotation.y = Math.cos(time * 0.001);
  cylinder.rotation.z = Math.sin(time * 0.001);
  
  renderer.render(scene, camera);
}

