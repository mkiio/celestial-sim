import * as THREE from 'three';
import { SceneManager } from './SceneManager.js';
import { SimulationManager } from './SimulationManager.js';
import { CelestialBody } from './Body.js';
import { Trail } from './Trail.js';
import { textureLoader } from './Utils.js';

// === Physical Constants (SI Units) ===
const G = 6.67430e-11;      // gravitational constant
const defaultOriginMass = 1.98847e30; // fallback mass if no central object is found

// A scale factor to convert SI units to scene units.
const scale = 1e-9;

// === Create Scene Manager ===
const sceneManager = new SceneManager();

async function init() {
    // Fetch the JSON data
    const response = await fetch('data/sol.json');
    const bodiesData = await response.json();

    // Determine the most massive object with an initial position of (0,0,0)
    let centralBodyData = null;
    bodiesData.forEach(bodyData => {
        const pos = bodyData.initialPosition;
        if (pos.x === 0 && pos.y === 0 && pos.z === 0) {
            if (!centralBodyData || bodyData.mass > centralBodyData.mass) {
                centralBodyData = bodyData;
            }
        }
    });
    // Use the found mass, or fallback to earthMass if none found.
    const centralMass = centralBodyData ? centralBodyData.mass : defaultOriginMass;

    // === Create Simulation Manager using the computed centralMass ===
    const simulationManager = new SimulationManager({
        sceneManager,
        scale,
        physics: { G, centralMass },
        timeStep: 3600 // 1 hour per frame
    });

    // Instantiate each celestial body and add them to the simulation.
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
        // Create a new CelestialBody using the JSON data and the scale factor.
        const body = new CelestialBody({
            name: bodyData.name,
            mass: bodyData.mass,
            radius: bodyData.radius,
            texture: texture,
            initialPosition: initialPosition,
            initialVelocity: initialVelocity,
            scale: scale  // Pass the scale factor from the simulation
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
