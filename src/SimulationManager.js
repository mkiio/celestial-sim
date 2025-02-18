// src/SimulationManager.js
import { rk4Step } from './Physics.js';

export class SimulationManager {
    constructor({ sceneManager, scale = 1, physics, timeStep = 3600 }) {
        this.sceneManager = sceneManager;
        this.scale = scale;
        this.G = physics.G;
        this.centralMass = physics.centralMass;
        this.dt = timeStep;
        this.bodies = [];
        this.trails = new Map(); // Map a body to its trail

        // Earth's rotation rate (if applicable): one rotation per day.
        this.earthRotationRate = (2 * Math.PI) / 86400;
    }

    addBody(body) {
        this.bodies.push(body);
    }

    setTrail(body, trail) {
        this.trails.set(body, trail);
    }

    start() {
        this.lastTime = performance.now();
        this.animate();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // --- Update Simulation Physics ---
        this.updatePhysics();

        // --- Update Trails ---
        this.updateTrails();

        // --- Update Earth's Rotation (if present) ---
        const earth = this.bodies.find((b) => b.name === 'Earth');
        if (earth) {
            earth.mesh.rotation.y += this.earthRotationRate * this.dt;
        }

        // --- Render the Scene ---
        this.sceneManager.render();
    }

    updatePhysics() {
        // For each body (skip the central body, e.g., Earth)
        for (let body of this.bodies) {
            if (body.name === 'Earth') continue; // assume Earth is central and fixed

            const { pos, vel } = rk4Step(
                body.simPosition,
                body.simVelocity,
                this.dt,
                this.G,
                this.centralMass
            );
            body.simPosition.copy(pos);
            body.simVelocity.copy(vel);

            // Update the Three.js mesh (convert SI units to scene units).
            body.mesh.position.copy(body.simPosition.clone().multiplyScalar(this.scale));
        }
    }

    updateTrails() {
        // Update each registered trail.
        for (let [body, trail] of this.trails.entries()) {
            trail.addPoint(body.simPosition);
            trail.capTrail();
            trail.updateGeometry(this.scale);
        }
    }
}
