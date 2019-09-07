// https://threejsfundamentals.org/threejs/lessons/threejs-scenegraph.html
import * as Three from 'three';
import dat from 'dat.gui';

const gui = new dat.GUI();

class AxisGridHelper {
  constructor(node, units = 10) {
    const axes = new Three.AxesHelper();
    axes.material.depthTest = false;
    axes.renderOrder = 2;
    node.add(axes);

    const grid = new Three.GridHelper();
    grid.material.depthTest = false;
    grid.renderOrder = 1;
    node.add(grid);

    this.grid = grid;
    this.axes = axes;
    this.visible = false;
  }

  get visible() {
    return this._visible;
  }

  set visible(v) {
    this._visible = v;
    this.grid.visible = v;
    this.axes.visible = v;
  }
}

const canvas = document.getElementById('canvas');
const scene = new Three.Scene();
// const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new Three.WebGLRenderer({ canvas });

const objects = [];
const radius = 1;
const widthSegments = 6;
const heightSegments = 6;
const sphereGeometry = new Three.SphereBufferGeometry(radius, widthSegments, heightSegments);

const solarSystem = new Three.Object3D();
scene.add(solarSystem);
objects.push(solarSystem);

const sunMaterial = new Three.MeshPhongMaterial({emissive: 0xFFFF00});
const sunMesh = new Three.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5);
solarSystem.add(sunMesh);
objects.push(sunMesh);

const earthOrbit = new Three.Object3D();
earthOrbit.position.x = 10;
solarSystem.add(earthOrbit);
objects.push(earthOrbit);

const earthMaterial = new Three.MeshPhongMaterial({ color: 0x2233FF, emissive: 0x112244 });
const earthMesh = new Three.Mesh(sphereGeometry, earthMaterial);
earthOrbit.add(earthMesh);
objects.push(earthMesh);

const moonOrbit = new Three.Object3D();
moonOrbit.position.x = 2; 
earthOrbit.add(moonOrbit);

const moonMaterial = new Three.MeshPhongMaterial({ color: 0x888888, emissive: 0x222222 });
const moonMesh = new Three.Mesh(sphereGeometry, moonMaterial);
moonMesh.scale.set(0.5, 0.5, 0.5);
moonOrbit.add(moonMesh);
objects.push(moonOrbit);

{ // add a light
  const color = 0xFFFFFF;
  const intensity = 3;
  const light = new Three.PointLight(color, intensity);
  scene.add(light);
}

const fov = 40;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 1000;
const camera = new Three.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 50, 0);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

/* AxesHelper */
// objects.forEach(node => {
//   const axes = new Three.AxesHelper();
//   axes.material.depthTest = false;
//   axes.renderOrder = 1;
//   node.add(axes);
// });

function makeAxisGrid(node, label, units) {
  const helper = new AxisGridHelper(node, units);
  gui.add(helper, 'visible').name(label);
}

makeAxisGrid(solarSystem, 'solarSystem', 25);
makeAxisGrid(sunMesh, 'sunMesh');
makeAxisGrid(earthOrbit, 'earthOrbit');
makeAxisGrid(earthMesh, 'earthMesh');
makeAxisGrid(moonMesh, 'moonMesh');

function render(time) {
  time = time * 0.001;

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  objects.forEach(obj => {
    obj.rotation. y = time;
  });

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);

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