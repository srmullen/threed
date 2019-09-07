import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let camera, scene, renderer, dirLight, dirLightHelper, hemiLight, hemiLightHelper;
const mixers = [];

const clock = new THREE.Clock();

init();
animate();

function init() {
  const container = document.getElementById('container');
  camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 5000);
  camera.position.set(0, 0, 250);

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(scene.background, 1, 5000);

  // Lights

  // HemisphereLight - A light source positioned directly above the scene, with color fading from the sky color
  // to the ground color. Cannot cast shadows.
  hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.groundColor.setHSL(0.095, 1, 0.75);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
  scene.add(hemiLightHelper);

  dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.color.setHSL(0.1, 1, 0.95);
  dirLight.position.set(-1, 1.75, 1);
  dirLight.position.multiplyScalar(30);
  scene.add(dirLight);

  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  const d = 50;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.camera.far = 3500;
  dirLight.shadow.bias = -0.0001;

  dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
  scene.add(dirLightHelper);

  // Ground
  const groundGeo = new THREE.PlaneBufferGeometry(10000, 10000);
  const groundMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  groundMat.color.setHSL(0.095, 1, 0.75);
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = -33;
  ground.rotation.x = Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Skydome
  const vertexShader = document.getElementById('vertexShader').textContent;
  const fragmentShader = document.getElementById('fragmentShader').textContent;
  const uniforms = {
    topColor: { value: new THREE.Color(0x0077ff) },
    bottomColor: { value: new THREE.Color(0xffffff) },
    offset: { value: 33 },
    exponent: { value: 0.6 }
  }
  uniforms.topColor.value.copy(hemiLight.color);
  scene.fog.color.copy(uniforms.bottomColor.value);

  const skyGeo = new THREE.SphereBufferGeometry(400, 32, 15);
  const skyMat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    side: THREE.BackSide
  });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);

  // Model
  const loader = new GLTFLoader();

  loader.load('/src/models/gltf/Flamingo.glb', function(gltf) {
    const mesh = gltf.scene.children[0];
    const s = 0.35;
    mesh.scale.set(s, s, s);
    mesh.position.y = 15;
    mesh.rotation.y = -1;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    const mixer = new THREE.AnimationMixer(mesh);
    mixer.clipAction(gltf.animations[0]).setDuration(1).play();
    mixers.push(mixer);
  });

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.shadowMap.enable = true;
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  const delta = clock.getDelta();

  for (let i = 0; i < mixers.length; i++) {
    mixers[i].update(delta);
  }

  renderer.render(scene, camera);
}