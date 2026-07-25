/**
 * Example schematics - simple structures
 */

export const SCHEMATICS = {
  // Simple 3x3x3 cube
  cube_3x3x3: {
    name: 'cube_3x3x3',
    blocks: [
      // Layer 0 (bottom)
      { x: 0, y: 0, z: 0, name: 'stone' },
      { x: 1, y: 0, z: 0, name: 'stone' },
      { x: 2, y: 0, z: 0, name: 'stone' },
      { x: 0, y: 0, z: 1, name: 'stone' },
      { x: 1, y: 0, z: 1, name: 'stone' },
      { x: 2, y: 0, z: 1, name: 'stone' },
      { x: 0, y: 0, z: 2, name: 'stone' },
      { x: 1, y: 0, z: 2, name: 'stone' },
      { x: 2, y: 0, z: 2, name: 'stone' },
      // Layer 1 (middle)
      { x: 0, y: 1, z: 0, name: 'stone' },
      { x: 1, y: 1, z: 0, name: 'air' },
      { x: 2, y: 1, z: 0, name: 'stone' },
      { x: 0, y: 1, z: 1, name: 'air' },
      { x: 1, y: 1, z: 1, name: 'air' },
      { x: 2, y: 1, z: 1, name: 'air' },
      { x: 0, y: 1, z: 2, name: 'stone' },
      { x: 1, y: 1, z: 2, name: 'air' },
      { x: 2, y: 1, z: 2, name: 'stone' },
      // Layer 2 (top)
      { x: 0, y: 2, z: 0, name: 'stone' },
      { x: 1, y: 2, z: 0, name: 'stone' },
      { x: 2, y: 2, z: 0, name: 'stone' },
      { x: 0, y: 2, z: 1, name: 'stone' },
      { x: 1, y: 2, z: 1, name: 'stone' },
      { x: 2, y: 2, z: 1, name: 'stone' },
      { x: 0, y: 2, z: 2, name: 'stone' },
      { x: 1, y: 2, z: 2, name: 'stone' },
      { x: 2, y: 2, z: 2, name: 'stone' },
    ],
  },

  // Simple 5x3 house
  house_small: {
    name: 'house_small',
    blocks: [
      // Floor
      { x: 0, y: 0, z: 0, name: 'oak_planks' },
      { x: 1, y: 0, z: 0, name: 'oak_planks' },
      { x: 2, y: 0, z: 0, name: 'oak_planks' },
      { x: 3, y: 0, z: 0, name: 'oak_planks' },
      { x: 4, y: 0, z: 0, name: 'oak_planks' },
      { x: 0, y: 0, z: 1, name: 'oak_planks' },
      { x: 1, y: 0, z: 1, name: 'oak_planks' },
      { x: 2, y: 0, z: 1, name: 'oak_planks' },
      { x: 3, y: 0, z: 1, name: 'oak_planks' },
      { x: 4, y: 0, z: 1, name: 'oak_planks' },
      // Walls
      { x: 0, y: 1, z: 0, name: 'oak_log' },
      { x: 4, y: 1, z: 0, name: 'oak_log' },
      { x: 0, y: 1, z: 1, name: 'oak_log' },
      { x: 4, y: 1, z: 1, name: 'oak_log' },
      // Roof
      { x: 0, y: 2, z: 0, name: 'oak_log' },
      { x: 1, y: 2, z: 0, name: 'oak_log' },
      { x: 2, y: 2, z: 0, name: 'oak_log' },
      { x: 3, y: 2, z: 0, name: 'oak_log' },
      { x: 4, y: 2, z: 0, name: 'oak_log' },
      { x: 0, y: 2, z: 1, name: 'oak_log' },
      { x: 1, y: 2, z: 1, name: 'oak_log' },
      { x: 2, y: 2, z: 1, name: 'oak_log' },
      { x: 3, y: 2, z: 1, name: 'oak_log' },
      { x: 4, y: 2, z: 1, name: 'oak_log' },
    ],
  },
};
