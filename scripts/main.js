/**
 * Name Generator Module for FoundryVTT
 * Main initialization file
 */

import { NameGenerator } from './nameplace-generator.js';

// Define the global function immediately at the top level
window.openNameplaceGenerator = function() {
  // Try to get the module API first
  const module = game.modules?.get('banestorm-nameplaces-generator');
  if (module && module.api && module.api.instance) {
    module.api.instance.openDialog();
    return;
  }
  
  // Fallback: create a new instance directly
  try {
    const generator = new NameGenerator();
    generator.openDialog();
  } catch (error) {
    ui.notifications.error('Nameplace Generator failed to open. Please try again.');
  }
};

Hooks.once('init', async () => {
  // Get the module instance from game.modules
  const module = game.modules.get('banestorm-nameplaces-generator');
  if (!module) {
    return;
  }
  
  // Initialize the module's API on the module instance
  module.api = {
    NameGenerator: NameGenerator,
    instance: null,
    openDialog: function() {
      if (!this.instance) {
        this.instance = new NameGenerator();
      }
      this.instance.openDialog();
    }
  };
});

Hooks.once('ready', () => {
  const module = game.modules.get('banestorm-nameplaces-generator');
  if (!module) {
    return;
  }
  
  if (!module.api) {
    return;
  }
  
  // Create the generator instance
  module.api.instance = new NameGenerator();
  
  // Add control button to token controls
  Hooks.on('getSceneControlButtons', (controls) => {
    const tokenControls = controls.find(c => c.name === 'token');
    if (tokenControls) {
      tokenControls.tools.push({
        name: 'nameplace-generator',
        title: game.i18n.localize('NAME_GENERATOR.ButtonTitle') || 'Place Generator',
        icon: 'fas fa-city',
        button: true,
        onClick: () => {
          const module = game.modules.get('banestorm-nameplaces-generator');
          if (module && module.api) {
            module.api.openDialog();
          } else {
            // Fallback to global function
            window.openNameplaceGenerator();
          }
        }
      });
    }
  });
});