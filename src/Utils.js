// src/Utils.js
import * as THREE from 'three';

export const textureLoader = new THREE.TextureLoader();

/**
 * Creates a label sprite with the given message.
 * @param {string} message
 * @param {Object} parameters
 * @returns {THREE.Sprite}
 */
export function createLabel(message, parameters = {}) {
    const fontface = parameters.fontface || 'Arial';
    const fontsize = parameters.fontsize || 24;
    const borderThickness = parameters.borderThickness || 4;
    const borderColor = parameters.borderColor || { r: 0, g: 0, b: 0, a: 1.0 };
    const backgroundColor = parameters.backgroundColor || { r: 255, g: 255, b: 255, a: 1.0 };

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = fontsize + 'px ' + fontface;
    const metrics = context.measureText(message);
    const textWidth = metrics.width;

    // Set canvas dimensions to fit the text.
    canvas.width = textWidth + borderThickness * 2;
    canvas.height = fontsize * 1.4 + borderThickness * 2;

    // Redraw with the new dimensions.
    context.font = fontsize + 'px ' + fontface;
    context.fillStyle = `rgba(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b}, ${backgroundColor.a})`;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = `rgba(${borderColor.r}, ${borderColor.g}, ${borderColor.b}, ${borderColor.a})`;
    context.lineWidth = borderThickness;
    context.strokeRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'rgba(0, 0, 0, 1.0)';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(message, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(30, 15, 1.0);
    return sprite;
}
