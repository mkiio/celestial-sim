import * as THREE from 'three';

export const textureLoader = new THREE.TextureLoader();

/**
 * Creates a label sprite with the given message.
 * The label includes a leader line from its bottom center pointing toward the target.
 * @param {string} message - The label text.
 * @param {Object} parameters - Configuration parameters.
 * @param {string} [parameters.fontface='Arial'] - Font face.
 * @param {number} [parameters.fontsize=24] - Font size in pixels.
 * @param {Object} [parameters.fontColor={r:255, g:255, b:255, a:1.0}] - Font color.
 * @param {number} [parameters.borderThickness=4] - Border thickness in pixels.
 * @param {Object} [parameters.borderColor={r:0, g:0, b:0, a:1.0}] - Border color.
 * @param {Object} [parameters.backgroundColor={r:22, g:22, b:77, a:1.0}] - Background color.
 * @param {number} [parameters.padding=10] - Padding around the text in pixels.
 * @param {number} [parameters.scaleFactor=0.1] - Conversion factor from canvas pixels to world units.
 * @param {number} [parameters.leaderLineLength=20] - Leader line length in canvas pixels.
 * @param {Object} [parameters.leaderLineColor=parameters.borderColor] - Leader line color.
 * @param {number} [parameters.leaderLineWidth=2] - Leader line width.
 * @returns {THREE.Group} A group containing the label sprite and its leader line.
 */
export function createLabel(message, parameters = {}) {
  // Font and color settings.
  const fontface = parameters.fontface || 'Arial';
  const fontsize = parameters.fontsize || 24;
  const fontColor = parameters.fontColor || { r: 255, g: 255, b: 255, a: 1.0 };
  const borderThickness = parameters.borderThickness || 4;
  const borderColor = parameters.borderColor || { r: 0, g: 0, b: 0, a: 1.0 };
  const backgroundColor = parameters.backgroundColor || { r: 22, g: 22, b: 77, a: 1.0 };
  const padding = parameters.padding !== undefined ? parameters.padding : 10;
  const scaleFactor = parameters.scaleFactor || 0.1;
  const leaderLineLengthPixels = parameters.leaderLineLength !== undefined ? parameters.leaderLineLength : 20;
  const leaderLineColor = parameters.leaderLineColor || borderColor;
  const leaderLineWidth = parameters.leaderLineWidth !== undefined ? parameters.leaderLineWidth : 2;

  // Create a canvas and get the drawing context.
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // Set font and measure text.
  context.font = `${fontsize}px ${fontface}`;
  const metrics = context.measureText(message);
  const textWidth = metrics.width;

  // Calculate canvas dimensions to include border and padding.
  canvas.width = textWidth + borderThickness * 2 + padding * 2;
  canvas.height = fontsize * 1.4 + borderThickness * 2 + padding * 2;

  // Redraw with new canvas dimensions.
  context.font = `${fontsize}px ${fontface}`;
  // Draw background.
  context.fillStyle = `rgba(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b}, ${backgroundColor.a})`;
  context.fillRect(0, 0, canvas.width, canvas.height);
  // Draw border.
  context.strokeStyle = `rgba(${borderColor.r}, ${borderColor.g}, ${borderColor.b}, ${borderColor.a})`;
  context.lineWidth = borderThickness;
  context.strokeRect(0, 0, canvas.width, canvas.height);
  // Draw text.
  context.fillStyle = `rgba(${fontColor.r}, ${fontColor.g}, ${fontColor.b}, ${fontColor.a})`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(message, canvas.width / 2, canvas.height / 2);

  // Create texture and sprite.
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMaterial);

  // Set sprite scale based on canvas dimensions.
  const spriteWidth = canvas.width * scaleFactor;
  const spriteHeight = canvas.height * scaleFactor;
  sprite.scale.set(spriteWidth, spriteHeight, 1);

  // Create leader line (separate from the canvas) that starts at the bottom center.
  const leaderLineLengthWorld = leaderLineLengthPixels * scaleFactor;
  const startPoint = new THREE.Vector3(0, -spriteHeight / 2, 0);
  const endPoint = new THREE.Vector3(0, -spriteHeight / 2 - leaderLineLengthWorld, 0);
  const lineGeometry = new THREE.BufferGeometry().setFromPoints([startPoint, endPoint]);
  const lineMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color(leaderLineColor.r / 255, leaderLineColor.g / 255, leaderLineColor.b / 255),
    linewidth: leaderLineWidth
  });
  const leaderLine = new THREE.Line(lineGeometry, lineMaterial);

  // Create a group to hold both the sprite and its leader line.
  const labelGroup = new THREE.Group();
  labelGroup.add(sprite);
  labelGroup.add(leaderLine);

  return labelGroup;
}
