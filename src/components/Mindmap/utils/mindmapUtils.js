/**
 * Utility functions for the mindmap component
 */

/**
 * Darkens a hex color by a specified amount
 * @param {string} color - Hex color string (e.g., '#e8f5e9')
 * @param {number} amount - Amount to darken (default: 40)
 * @returns {string} Darkened hex color
 */
export const darkenColor = (color, amount = 40) => {
  const hex = color.replace('#', '');
  const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - amount);
  const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - amount);
  const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Gets the center position of a node in pixels
 * @param {number} nodeId - The node ID
 * @param {Array} nodes - Array of all nodes
 * @param {DOMRect} canvasRect - Canvas bounding rect
 * @returns {{x: number, y: number}} Center coordinates
 */
export const getNodeCenter = (nodeId, nodes, canvasRect) => {
  if (!Array.isArray(nodes) || !canvasRect) {
    return { x: 0, y: 0 };
  }

  const node = nodes.find(n => n.id === nodeId);
  if (!node) {
    return { x: 0, y: 0 };
  }
  
  return { 
    x: (node.x / 100) * canvasRect.width, 
    y: (node.y / 100) * canvasRect.height 
  };
};

/**
 * Finds a free position for a new node away from existing nodes
 * @param {Array} nodes - Array of existing nodes
 * @returns {{x: number, y: number}} Free position in percentages
 */
export const findFreePosition = (nodes) => {
  const minDistance = 15; // Minimum distance percentage from other nodes
  const maxAttempts = 50;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Generate random position in visible area (between 20% and 80%)
    const x = 20 + Math.random() * 60;
    const y = 20 + Math.random() * 60;
    
    // Check if sufficiently far from all other nodes
    const isFree = nodes.every(node => {
      const distance = Math.sqrt(
        Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)
      );
      return distance >= minDistance;
    });
    
    if (isFree) {
      return { x, y };
    }
  }
  
  // If no free space found, return random position anyway
  return { 
    x: 20 + Math.random() * 60, 
    y: 20 + Math.random() * 60 
  };
};

/**
 * Available icons for nodes
 */
export const availableIcons = [
  'History',
  'Map',
  'User',
  'Church',
  'Building2',
  'LayoutDashboard',
  'Flag',
  'Lightbulb'
];

/**
 * Available colors for nodes (9 pastel colors)
 */
export const availableColors = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#1186f7',
];
