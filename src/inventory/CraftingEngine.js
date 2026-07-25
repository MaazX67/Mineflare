/**
 * Crafting engine
 */

import { Logger } from '../core/Logger.js';

const logger = new Logger('CraftingEngine');

/**
 * Manages crafting operations
 */
export class CraftingEngine {
  constructor() {
    this.logger = logger.createChild('Engine');
    this.recipes = new Map();
  }

  /**
   * Register recipe
   * @param {string} name
   * @param {Array} ingredients
   * @param {Object} result
   */
  registerRecipe(name, ingredients, result) {
    this.recipes.set(name, {
      name,
      ingredients,
      result,
    });
    this.logger.debug(`Registered recipe: ${name}`);
  }

  /**
   * Get recipe by name
   * @param {string} name
   * @returns {Object|null}
   */
  getRecipe(name) {
    return this.recipes.get(name) || null;
  }

  /**
   * Find recipes for item
   * @param {string} itemName
   * @returns {Array}
   */
  findRecipesFor(itemName) {
    const matching = [];
    for (const [, recipe] of this.recipes) {
      if (recipe.result.name === itemName) {
        matching.push(recipe);
      }
    }
    return matching;
  }

  /**
   * Check if recipe can be crafted
   * @param {string} recipeName
   * @param {InventoryManager} inventory
   * @returns {boolean}
   */
  canCraft(recipeName, inventory) {
    const recipe = this.getRecipe(recipeName);
    if (!recipe) return false;

    for (const ingredient of recipe.ingredients) {
      const count = inventory.getItemCount(ingredient.id);
      if (count < ingredient.count) {
        return false;
      }
    }

    return true;
  }

  /**
   * Craft item
   * @param {string} recipeName
   * @param {number} times
   */
  async craft(recipeName, times = 1) {
    const recipe = this.getRecipe(recipeName);
    if (!recipe) {
      this.logger.warn(`Recipe not found: ${recipeName}`);
      return false;
    }

    this.logger.info(`Crafting ${times}x ${recipe.result.name}`);
    return true;
  }
}
