import * as THREE from 'three';
import { MeshToonMaterial } from 'three';
import { request } from 'http';

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

const aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
const frustumSize = 600;

let container;
let camera, scene, renderer, mesh;
let cameraRig, activeCamera, activeHelper;
let cameraPerspective, cameraOrtho;
let cameraPerspectiveHelper, cameraOrthoHelper;

init();
animate();

function init() {
  container = document.createElement('div');
  document.body.appendChild(container);
  scene = new THREE.Scene();

  // The perspective camera is designed to mimic the way the human eye sees. It is the most
  // common mode used for rendering a 3D scene.
  camera = new THREE.PerspectiveCamera( 50, 0.5 * aspect, 1, 10000);
  camera.position.z = 2500;

  cameraPerspective = new THREE.PerspectiveCamera(50, 0.5 * aspect, 150, 1000);
  cameraPerspectiveHelper = new THREE.CameraHelper(cameraPerspective);

  scene.add(cameraPerspectiveHelper);

  // In this projection mode, an objects size in the rendered image stays the same regardless of its distance from
  // the camera. Useful for rendering 2D scenes and UI elements amongst other things.
  cameraOrtho = new THREE.OrthographicCamera(
    0.5 * frustumSize * aspect / - 2, 
    0.5 * frustumSize * aspect / 2, 
    frustumSize / 2,
    frustumSize / -2,
    150, 1000
  );
  cameraOrthoHelper = new THREE.CameraHelper(cameraOrtho);
  scene.add(cameraOrthoHelper);

  activeCamera = cameraPerspective;
  activeHelper = cameraPerspectiveHelper;

  // counteract different front orientation of cameras vs rig.
  cameraOrtho.rotation.y = Math.PI;
  cameraPerspective.rotation.y = Math.PI;

  cameraRig = new THREE.Group();
  cameraRig.add(cameraPerspective);
  cameraRig.add(cameraOrtho);
  scene.add(cameraRig);

  mesh = new THREE.Mesh(
    new THREE.SphereBufferGeometry(100, 16, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
  );
  scene.add(mesh);

  const mesh2 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(50, 16, 8),
    new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
  );
  mesh2.position.y = 170;
  mesh2.position.z = 12;
  mesh.add(mesh2);

  const mesh3 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(5, 16, 8),
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true})
  );
  mesh3.position.z = 150;
  cameraRig.add(mesh3);

  // BufferGeometry is an efficient representation of mesh, line, or point geometry. Includes vertex positions,
  // face indices, normals, colors, UBs, and custom attributes within buffers, reducing the cost of passing all 
  // the data to the GPU.
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  for (let i = 0; i < 10000; i++) {
    vertices.push(THREE.Math.randFloatSpread(2000)); // x
    vertices.push(THREE.Math.randFloatSpread(2000)); // y
    vertices.push(THREE.Math.randFloatSpread(2000)); // z
  }

  geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x888888 }));
  scene.add(particles);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container.appendChild(renderer.domElement);
  renderer.autoClear = false;

  document.addEventListener('keydown', onKeyDown, false);

}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function onKeyDown(event) {
  switch (event.keyCode) {
    case 79:
      activeCamera = cameraOrtho;
      activeHelper = cameraOrthoHelper;
      break;
    case 80:
      activeCamera = cameraPerspective;
      activeHelper = cameraPerspectiveHelper;
      break; 
  }
}

function render() {
  const r = Date.now() * 0.0005;
  mesh.position.x = 700 * Math.cos(r);
  mesh.position.z = 700 * Math.sin(r);
  mesh.position.y = 700 * Math.sin(r);

  // mesh.children[0].position.x = 70 * Math.cos(2 * r);
  // mesh.children[0].position.z = 70 * Math.sin(r);

  if (activeCamera === cameraPerspective) {
    cameraPerspective.fov = 35 + 30 * Math.sin(0.5 * r);
    cameraPerspective.far = mesh.position.length();
    cameraPerspective.updateProjectionMatrix();

    cameraPerspectiveHelper.update();
    cameraPerspectiveHelper.visible = true;

    cameraOrthoHelper.visible = false;
  } else {
    cameraOrtho.far = mesh.position.length();
    cameraOrtho.updateProjectionMatrix();

    cameraOrthoHelper.update();
    cameraOrthoHelper.visible = true;

    cameraPerspectiveHelper.visible = false;
  }

  cameraRig.lookAt(mesh.position);

  renderer.clear();

  activeHelper.visible = false;
  renderer.setViewport(0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT);
  renderer.render(scene, activeCamera);
  activeHelper.visible = true;

  renderer.setViewport(SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT);
  renderer.render(scene, camera);

}