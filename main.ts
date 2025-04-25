import * as THREE from 'three';
import { getParticleSystem } from './src/getParticleSystem';

type Mouse = {
    position: THREE.Vector2,
    velocity: THREE.Vector2,
    prev: THREE.Vector2,
    plane: THREE.Vector2,
};

const mouse: Mouse = {
    position: new THREE.Vector2(0, 0),
    velocity: new THREE.Vector2(0, 0),
    prev: new THREE.Vector2(0, 0),
    plane: new THREE.Vector2(0, 0),
};

function onMouseMove(event: MouseEvent): void {
    mouse.position.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.position.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

const scene: THREE.Scene = new THREE.Scene();
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// light
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(hemiLight);

// particles
const fireEffect = getParticleSystem({
    camera,
    mouse,
    parent: scene,
    rate: 5000.0,
});

camera.position.z = 5; // Camera Z-Position

// function onTouchMove(event: TouchEvent): void {
//     if (event.touches.length > 0) {
//         mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
//         mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
//     }
// }

window.addEventListener('mousemove', onMouseMove, false);
// window.addEventListener('touchmove', onTouchMove, false);


const raycaster: THREE.Raycaster = new THREE.Raycaster();
const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

let ts = 0;
// Animation function
function animate(nts = 0.1): void {
    requestAnimationFrame(animate);
    const timeElapsed = (nts - ts);

    raycaster.setFromCamera(mouse.position, camera);
    const mouseIntersectPoint: THREE.Vector3 = new THREE.Vector3();
    raycaster.ray.intersectPlane(planeZ, mouseIntersectPoint);

    mouse.velocity.x = (mouse.position.x - mouse.prev.x) / timeElapsed;
    mouse.velocity.y = (mouse.position.y - mouse.prev.y) / timeElapsed;

    mouse.prev.x = mouse.position.x;
    mouse.prev.y = mouse.position.y;

    mouse.plane.copy(mouseIntersectPoint);

    fireEffect.update(timeElapsed / 1000);
    ts = nts;

    renderer.render(scene, camera);
}

// Call animation function
animate();

// Code for responsiveness
function onWindowResize(): void {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);
onWindowResize();