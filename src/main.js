import './style.css'
import * as THREE from 'three'
import { addInstancedBalls } from './addInstancedMeshes'
import { addLight } from './addLights'
import { addPostProcessing } from './PostProcessing'

// Scene Setup
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    500
)
const renderer = new THREE.WebGLRenderer({ antialias: true })

const meshes = {}
const lights = {}

let composer, bloomPass, glitchPass;

let ballMesh;
const numBalls = 2000; // ball count
const dummy = new THREE.Object3D(); // dummy for instancing
const matrix = new THREE.Matrix4(); //  matrix for instancing

init()

function init() {
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    camera.position.set(0, 0, 0)

    // Lights
    lights.default = addLight()
    scene.add(lights.default)

    // Post Processing
    composer = addPostProcessing(renderer, scene, camera)

    ballMesh = addInstancedBalls(numBalls)
    scene.add(ballMesh)

    startInstructionSequence()
    interactions()
    resize()
    animate()

     //Audio
    const listener = new THREE.AudioListener();
    camera.add(listener);
    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('./iFloatAloneCut.mp3', (buffer) => {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        window.addEventListener('click', () => {
            if (!sound.isPlaying) sound.play();
        });
    });

    //Text Instructions
    function typeWriter(text, elementId, speed = 50) {
    const element = document.getElementById(elementId);
    element.innerHTML = ""; // Clear existing
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Trigger the sequence
function startInstructionSequence() {
    // 5 seconds in: Bloom instruction
    setTimeout(() => {
        typeWriter("PRESS 'B' TO ILLUMINATE THE VOID", "instructions");
    }, 5000);

    // 15 seconds in: Glitch instruction
    setTimeout(() => {
        // Clear the previous instruction first or let it overwrite
        typeWriter("PRESS 'G' TO DECREATE THE FRAME", "instructions");
    }, 15000);
    
    // 25 seconds in: Fade out
    setTimeout(() => {
        document.getElementById("instructions").style.opacity = "0";
        document.getElementById("instructions").style.transition = "opacity 2s";
    }, 25000);
}
}

function interactions() {
    window.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();

        if (key === 'g') {
            // Toggle Glitch
            composer.glitch.enabled = !composer.glitch.enabled;
            console.log(`Glitch Mode: ${composer.glitch.enabled ? 'ON' : 'OFF'}`);
        }

        if (key === 'b') {
            // Toggle Bloom
            composer.bloom.enabled = !composer.bloom.enabled;
            console.log(`Bloom Mode: ${composer.bloom.enabled ? 'ON' : 'OFF'}`);
        }
    });
}


function animate() {
    requestAnimationFrame(animate)

    for (let i = 0; i < numBalls; i++) {
        ballMesh.getMatrixAt(i, matrix);
        dummy.matrix.copy(matrix);
        dummy.position.setFromMatrixPosition(dummy.matrix);

        // Move each ball towards the camera
        dummy.position.z += 0.1;

        // Loop point for each ball
        if (dummy.position.z > 50) {
            dummy.position.z = -50; // Reset to the back of the tunnel
        }

        dummy.updateMatrix();
        ballMesh.setMatrixAt(i, dummy.matrix);
    }
    ballMesh.instanceMatrix.needsUpdate = true;
    
    
    composer.composer.render()
}

function resize() {
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
    })
}
