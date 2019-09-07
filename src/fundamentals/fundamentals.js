// https://threejsfundamentals.org/threejs/lessons/threejs-fundamentals.html
import * as Three from 'three';

const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new Three.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a cube
const geometry = new Three.BoxGeometry(3, 1, 2);

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

camera.position.z = 5;

function animate(time) {
  cubes.forEach(cube => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  });
  camera.position.z = Math.sin(time / 10 * 0.01 * Math.PI * 2) * 2 + 10;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);