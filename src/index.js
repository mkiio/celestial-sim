// src/index.js
import * as THREE from 'three';
import { SceneManager } from './SceneManager.js';
import { SimulationManager } from './SimulationManager.js';
import { CelestialBody } from './Body.js';
import { Trail } from './Trail.js';
import { textureLoader } from './Utils.js';

// === Physical Constants (SI Units) ===
const G = 6.67430e-11;             // gravitational constant
const earthMass = 5.972e24;        // kg
const earthRadius = 6.371e6;       // m
const moonMass = 7.34767309e22;    // kg
const moonRadius = 1.737e6;        // m
const earthMoonDistance = 384.4e6; // m

// A scale factor to convert SI units to scene units.
const scale = 1e-6;

// === Create Scene Manager ===
const sceneManager = new SceneManager();

// === Load Textures ===
const earthTexture = textureLoader.load('textures/earth_diffuse.jpg');
const moonTexture = textureLoader.load('textures/moon_diffuse.jpg');

// === Create Celestial Bodies ===

// Earth (central body at the origin)
const earth = new CelestialBody({
    name: 'Earth',
    mass: earthMass,
    radius: earthRadius,
    texture: earthTexture,
    initialPosition: new THREE.Vector3(0, 0, 0), // at origin
    initialVelocity: new THREE.Vector3(0, 0, 0)
});
sceneManager.addToScene(earth.mesh);

// Moon (orbiting Earth)
const moonOrbitalSpeed = Math.sqrt(G * earthMass / earthMoonDistance);
const moon = new CelestialBody({
    name: 'Moon',
    mass: moonMass,
    radius: moonRadius,
    texture: moonTexture,
    initialPosition: new THREE.Vector3(earthMoonDistance, 0, 0),
    initialVelocity: new THREE.Vector3(0, moonOrbitalSpeed, 0)
});
sceneManager.addToScene(moon.mesh);

// Create a trail for the Moon.
const moonTrail = new Trail({
    orbitCircumference: 2 * Math.PI * earthMoonDistance,
    scale: scale
});
sceneManager.addToScene(moonTrail.line);

// === Create Simulation Manager ===
const simulationManager = new SimulationManager({
    sceneManager,
    scale,
    physics: { G, centralMass: earthMass },
    timeStep: 3600 // 1 hour per frame
});

// Register bodies with the simulation manager.
simulationManager.addBody(earth);
simulationManager.addBody(moon);
simulationManager.setTrail(moon, moonTrail);

// Start the simulation.
simulationManager.start();
