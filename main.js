import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Debug logging
console.log('Three.js version:', THREE.REVISION);
console.log('Starting application...');

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a); // 더 어두운 배경색

// Debug logging for scene creation
console.log('Scene created');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#canvas'),
    antialias: true
});

// Debug logging for renderer
console.log('Renderer created');

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 5;
controls.maxDistance = 30;
controls.maxPolarAngle = Math.PI / 2 - 0.1; // 바닥 아래로 내려가지 않도록 제한

// Warehouse floor
const floorGeometry = new THREE.PlaneGeometry(30, 30);
const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x404040,
    roughness: 0.9,
    metalness: 0.1
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2;
floor.receiveShadow = true;
scene.add(floor);

// Warehouse walls
const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x303030,
    roughness: 0.8,
    metalness: 0.1
});

// Back wall
const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 15),
    wallMaterial
);
backWall.position.z = -15;
backWall.position.y = 5.5;
backWall.receiveShadow = true;
scene.add(backWall);

// Side walls
const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 15),
    wallMaterial
);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.x = -15;
leftWall.position.y = 5.5;
leftWall.receiveShadow = true;
scene.add(leftWall);

const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 15),
    wallMaterial
);
rightWall.rotation.y = -Math.PI / 2;
rightWall.position.x = 15;
rightWall.position.y = 5.5;
rightWall.receiveShadow = true;
scene.add(rightWall);

// Create gray balls
const balls = [];
const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const ballMaterial = new THREE.MeshStandardMaterial({
    color: 0x808080,
    roughness: 0.6,
    metalness: 0.4
});

// Create multiple balls in a pile with better distribution
for (let i = 0; i < 150; i++) {
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    
    // Create a more natural pile distribution
    const radius = Math.random() * 8; // Random radius from center
    const angle = Math.random() * Math.PI * 2; // Random angle
    
    ball.position.x = Math.cos(angle) * radius;
    ball.position.z = Math.sin(angle) * radius;
    
    // Stack balls with decreasing height based on distance from center
    const heightFactor = 1 - (radius / 8); // Height decreases as radius increases
    ball.position.y = -1.5 + Math.random() * 6 * heightFactor;
    
    // Add slight random rotation
    ball.rotation.x = Math.random() * Math.PI;
    ball.rotation.y = Math.random() * Math.PI;
    ball.rotation.z = Math.random() * Math.PI;
    
    ball.castShadow = true;
    ball.receiveShadow = true;
    
    scene.add(ball);
    balls.push(ball);
}

// Camera position
camera.position.set(20, 20, 20);
camera.lookAt(0, 0, 0);

// Animation loop
function animate() {
    try {
        requestAnimationFrame(animate);
        
        // Add subtle movement to balls
        balls.forEach((ball, index) => {
            ball.rotation.x += 0.001;
            ball.rotation.y += 0.002;
        });
        
        controls.update();
        renderer.render(scene, camera);
    } catch (error) {
        console.error('Error in animation loop:', error);
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    try {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch (error) {
        console.error('Error in resize handler:', error);
    }
});

// Debug logging before animation start
console.log('Starting animation...');

animate();