# n-Body Simulation (Orbiting Bodies Around Earth)

This project is a browser-based n‑body simulation built with [Three.js](https://threejs.org/). The simulation focuses on celestial bodies orbiting Earth and uses an object‑oriented, modular design that cleanly separates physics (simulation) from rendering. The project is designed to be extended—for example, to add more bodies, integrate a detailed UI, or incorporate more complex gravitational interactions.

## Project Structure
src/
├── index.js # Application entry point; sets up scene and starts simulation

├── SceneManager.js # Manages the Three.js scene, camera, renderer, and controls

├── SimulationManager.js # Handles simulation loop and physics updates

├── Physics.js # Contains physics utilities and the RK4 integrator

├── Body.js # Defines the CelestialBody class for creating bodies

├── Trail.js # Manages the trail effect for orbiting bodies

└── Utils.js # Provides utility functions (e.g., label creation, texture loader)

## Setup Instructions

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/mkiio/celestial-sim

Install Dependencies:

This project uses Three.js. Ensure you have Node.js installed, then run:

```npm install
npm start