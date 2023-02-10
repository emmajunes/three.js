import * as THREE from 'three';
import { OrbitControls } from 'orbitControls';
import { DirectionalLight, TextureLoader } from 'three';
import * as dat from '../node_modules/dat.gui/build/dat.gui.module.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;
const orbit = new OrbitControls(camera, renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

camera.position.set(-10, 30, 30);
orbit.update();

//sphere
const geometry = new THREE.SphereGeometry(4, 50, 50);
const texture = new THREE.TextureLoader().load('textures/lavatile.jpg');
const material = new THREE.MeshStandardMaterial({ map: texture, wireframe: false });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);
sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

//lights
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

//background
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load('textures/hubble-early-universe-stars-1.jpg')

//cube
const boxGeometry = new THREE.BoxGeometry(4, 4, 4);
const boxTexture = new THREE.TextureLoader().load('textures/crate.gif');
const boxMaterial = new THREE.MeshBasicMaterial({ map: boxTexture });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);
box.position.set(0, 15, 10);

//gui options
const gui = new dat.GUI();

const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 1,
};

gui.addColor(options, 'sphereColor').onChange(function (e) {
    sphere.material.color.set(e);
});

gui.add(options, 'wireframe').onChange(function (e) {
    sphere.material.wireframe = e;
});

gui.add(options, 'speed', 0, 0.1);
gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 1);

let step = 0;

const mousePosition = new THREE.Vector2();
const rayCaster = new THREE.Raycaster();

const sphereId = sphere.id;
box.name = 'box';

window.addEventListener('mousemove', function (e) {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
    requestAnimationFrame(animate);

    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    console.log(intersects);

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.id === sphereId) {
            intersects[i].object.material.color.set(0xFF000);
        }
        if (intersects[i].object.name === 'box') {
            intersects[i].object.rotation.x += 0.01;
            intersects[i].object.rotation.y += 0.01;
        }
    }
    renderer.render(scene, camera);
};

animate();
