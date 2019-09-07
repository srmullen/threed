// https://threejsfundamentals.org/threejs/lessons/threejs-responsive.html
import * as Three from 'three';

const scene = new Three.Scene();

const canvas = document.getElementById('canvas');
const fov = 75;
const aspect = canvas.clientWidth / canvas.clientHeight;;
const near = 0.1;
const far = 5;
const camera = new Three.PerspectiveCamera(fov, aspect, near, far);
const renderer = new Three.WebGLRenderer({ canvas });
// renderer.setSize(window.innerWidth, window.innerHeight);

// Create a cube
const geometry = new Three.BoxGeometry(1, 1, 1);

const cubes = [
  makeCube(geometry, 0x44aa88, 0),
  makeCube(geometry, 0x8844aa, -2),
  makeCube(geometry, 0xaa8844, 2)
];

function makeCube(geometry, color, x) {
  const material = new Three.MeshPhongMaterial({ color });
  const cube = new Three.Mesh(geometry, material);
  scene.add(cube);
  cube.position.x = x;
  return cube;
}

// Create a light
{
  const color = 0xFFFFF;
  const intensity = 1;
  const light = new Three.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
}

camera.position.z = 2;

function animate(time) {
  if (resizeRendererToDisplaySize(renderer)) {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
  cubes.forEach(cube => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  });
  // camera.position.z = Math.sin(time / 10 * 0.01 * Math.PI * 2) * 2 + 10;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}