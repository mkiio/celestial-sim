// src/Body.js
import * as THREE from 'three';
import { createLabel } from './Utils.js';

export class CelestialBody {
    /**
     * @param {Object} options
     * @param {string} options.name
     * @param {number} options.mass
     * @param {number} options.radius - in SI units.
     * @param {THREE.Texture} options.texture
     * @param {THREE.Vector3} options.initialPosition - in SI units.
     * @param {THREE.Vector3} options.initialVelocity - in SI units.
     * @param {number} [options.scale=1e-6] - Scale factor for rendering the body.
     */
    constructor({ name, mass, radius, texture, initialPosition, initialVelocity, scale = 1e-6 }) {
        this.name = name;
        this.mass = mass;
        this.radius = radius;
        this.texture = texture;
        // Simulation state in SI units.
        this.simPosition = initialPosition.clone();
        this.simVelocity = initialVelocity.clone();

        // Use the provided scale factor.
        const meshScale = scale;

        // Create a sphere geometry with the scale factor applied.
        const geometry = new THREE.SphereGeometry(radius * meshScale, 64, 64);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        this.mesh = new THREE.Mesh(geometry, material);

        // Create and attach a label.
        const label = createLabel(name, {
            fontsize: 32,
            fontColor: { r: 255, g: 255, b: 255, a: 1.0 },
            borderColor: { r: 22, g: 22, b: 22, a: 1.0 },
            backgroundColor: { r: 22, g: 22, b: 22, a: 0.7 }
        });
        // Adjust the label's vertical position using the same scale.
        label.position.set(0, radius * meshScale + 10, 0);
        this.mesh.add(label);
    }
}
