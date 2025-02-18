// src/Physics.js
import * as THREE from 'three';

/**
 * Computes the gravitational acceleration from a central mass (assumed at the origin).
 * @param {THREE.Vector3} pos - Position of the body (SI units).
 * @param {number} G - Gravitational constant.
 * @param {number} centralMass - Mass of the central body.
 * @returns {THREE.Vector3}
 */
export function acceleration(pos, G, centralMass) {
    const r = pos.length();
    if (r === 0) return new THREE.Vector3(0, 0, 0);
    return pos.clone().multiplyScalar(-G * centralMass / Math.pow(r, 3));
}

/**
 * Executes one RK4 integration step.
 * @param {THREE.Vector3} pos - Current position.
 * @param {THREE.Vector3} vel - Current velocity.
 * @param {number} dt - Time step (seconds).
 * @param {number} G - Gravitational constant.
 * @param {number} centralMass - Mass of the central body.
 * @returns {{ pos: THREE.Vector3, vel: THREE.Vector3 }}
 */
export function rk4Step(pos, vel, dt, G, centralMass) {
    // k1
    const k1_v = acceleration(pos, G, centralMass).multiplyScalar(dt);
    const k1_p = vel.clone().multiplyScalar(dt);

    // k2
    const pos2 = pos.clone().add(k1_p.clone().multiplyScalar(0.5));
    const vel2 = vel.clone().add(k1_v.clone().multiplyScalar(0.5));
    const k2_v = acceleration(pos2, G, centralMass).multiplyScalar(dt);
    const k2_p = vel2.clone().multiplyScalar(dt);

    // k3
    const pos3 = pos.clone().add(k2_p.clone().multiplyScalar(0.5));
    const vel3 = vel.clone().add(k2_v.clone().multiplyScalar(0.5));
    const k3_v = acceleration(pos3, G, centralMass).multiplyScalar(dt);
    const k3_p = vel3.clone().multiplyScalar(dt);

    // k4
    const pos4 = pos.clone().add(k3_p);
    const vel4 = vel.clone().add(k3_v);
    const k4_v = acceleration(pos4, G, centralMass).multiplyScalar(dt);
    const k4_p = vel4.clone().multiplyScalar(dt);

    // Weighted average of increments.
    const deltaPos = k1_p.clone()
        .add(k2_p.clone().multiplyScalar(2))
        .add(k3_p.clone().multiplyScalar(2))
        .add(k4_p)
        .multiplyScalar(1 / 6);
    const deltaVel = k1_v.clone()
        .add(k2_v.clone().multiplyScalar(2))
        .add(k3_v.clone().multiplyScalar(2))
        .add(k4_v)
        .multiplyScalar(1 / 6);

    return {
        pos: pos.clone().add(deltaPos),
        vel: vel.clone().add(deltaVel)
    };
}
