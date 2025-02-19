import * as THREE from 'three';
import { SceneManager } from './SceneManager.js';
import { SimulationManager } from './SimulationManager.js';
import { CelestialBody } from './Body.js';
import { Trail } from './Trail.js';
import { textureLoader } from './Utils.js';

// === Physical Constants (SI Units) ===
const G = 6.67430e-11;      // gravitational constant
const earthMass = 5.972e24; // kg

// A scale factor to convert SI units to scene units.
const scale = 1e-6;

// === Create Scene Manager ===
const sceneManager = new SceneManager();

// === Create Simulation Manager ===
const simulationManager = new SimulationManager({
    sceneManager,
    scale,
    physics: { G, centralMass: earthMass },
    timeStep: 360 // 1 hour per frame
});

// Load bodies from the JSON file and instantiate them.
async function init() {
    // Fetch the JSON data
    const response = await fetch('data/earth-origin.json');
    const bodiesData = await response.json();

    bodiesData.forEach(bodyData => {
        // Load texture from the file path specified in JSON.
        const texture = textureLoader.load(bodyData.texture);
        // Convert the position and velocity objects to THREE.Vector3 instances.
        const initialPosition = new THREE.Vector3(
            bodyData.initialPosition.x,
            bodyData.initialPosition.y,
            bodyData.initialPosition.z
        );
        const initialVelocity = new THREE.Vector3(
            bodyData.initialVelocity.x,
            bodyData.initialVelocity.y,
            bodyData.initialVelocity.z
        );
        // Create a new CelestialBody using the JSON data.
        const body = new CelestialBody({
            name: bodyData.name,
            mass: bodyData.mass,
            radius: bodyData.radius,
            texture: texture,
            initialPosition: initialPosition,
            initialVelocity: initialVelocity
        });
        // Add the celestial body's mesh to the scene.
        sceneManager.addToScene(body.mesh);
        // Register the body with the simulation manager.
        simulationManager.addBody(body);
        // Calculate the magnitude of the starting position vector.
        const startingDistance = initialPosition.length();
        // Create a trail only if the starting distance is not zero.
        if (startingDistance > 0) {
            const trail = new Trail({
                orbitCircumference: 2 * Math.PI * startingDistance,
                scale: scale
            });
            sceneManager.addToScene(trail.line);
            simulationManager.setTrail(body, trail);
        }
    });
    // Start the simulation after all bodies have been added.
    simulationManager.start();
}

init();
