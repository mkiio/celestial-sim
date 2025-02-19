# n-Body Simulation (Orbiting Bodies Around Earth)

This project is a browser-based n‑body simulation built with [Three.js](https://threejs.org/). 

## Project Structure
src/  
├── index.js # Application entry point; sets up scene and starts simulation\
├── SceneManager.js # Manages the Three.js scene, camera, renderer, and controls\
├── SimulationManager.js # Handles simulation loop and physics updates\
├── Physics.js # Contains physics utilities and the RK4 integrator\
├── Body.js # Defines the CelestialBody class for creating bodies\
├── Trail.js # Manages the trail effect for orbiting bodies\
└── Utils.js # Provides utility functions (e.g., label creation, texture loader)\

public/  
├── data/ # Celestial body data sets\
├── textures/ # Celestial body textures\
└── index.html # Application container page

## Setup Instructions

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/mkiio/celestial-sim

Install Dependencies:

This project uses Three.js. Ensure you have Node.js installed, then run:

```npm install
npm start
```
## License

Released under the MIT License – freely modify and distribute for your needs.