// src/Trail.js
import * as THREE from 'three';

export class Trail {
    /**
     * @param {Object} options
     * @param {number} options.orbitCircumference - Maximum trail length in SI units.
     * @param {number} options.scale - Scale factor to convert SI units to scene units.
     */
    constructor({ orbitCircumference, scale }) {
        this.orbitCircumference = orbitCircumference;
        this.scale = scale;
        this.trailPoints = [];
        this.trailGeometry = new THREE.BufferGeometry();

        this.trailMaterial = new THREE.ShaderMaterial({
            uniforms: {
                lineColor: { value: new THREE.Color(0xadd8e6) } // light blue
            },
            vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform vec3 lineColor;
        varying float vAlpha;
        void main() {
          gl_FragColor = vec4(lineColor, vAlpha);
        }
      `,
            transparent: true,
            depthWrite: false,
            blending: THREE.NormalBlending
        });

        this.line = new THREE.Line(this.trailGeometry, this.trailMaterial);
    }

    // Compute the cumulative arc length of the trail points.
    computeArcLength(points) {
        let length = 0;
        for (let i = 1; i < points.length; i++) {
            length += points[i].distanceTo(points[i - 1]);
        }
        return length;
    }

    // Append a new point (in SI units) to the trail.
    addPoint(point) {
        this.trailPoints.push(point.clone());
    }

    // Cap the trail so its total length does not exceed one full orbit.
    capTrail() {
        let totalLength = this.computeArcLength(this.trailPoints);
        while (this.trailPoints.length > 1 && totalLength > this.orbitCircumference) {
            totalLength -= this.trailPoints[1].distanceTo(this.trailPoints[0]);
            this.trailPoints.shift();
        }
    }

    // Update the trail geometry (with fading via per-vertex alpha).
    updateGeometry(scale) {
        const count = this.trailPoints.length;
        const positionsArray = new Float32Array(count * 3);
        const alphaArray = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            const scaledPos = this.trailPoints[i].clone().multiplyScalar(scale);
            positionsArray[i * 3] = scaledPos.x;
            positionsArray[i * 3 + 1] = scaledPos.y;
            positionsArray[i * 3 + 2] = scaledPos.z;
            // Newer points are more opaque.
            alphaArray[i] = count > 1 ? i / (count - 1) : 1.0;
        }
        this.trailGeometry.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3));
        this.trailGeometry.setAttribute('alpha', new THREE.BufferAttribute(alphaArray, 1));
        this.trailGeometry.attributes.position.needsUpdate = true;
        this.trailGeometry.attributes.alpha.needsUpdate = true;
    }
}
