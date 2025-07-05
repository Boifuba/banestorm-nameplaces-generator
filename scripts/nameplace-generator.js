/**
 * Name Generator Main Class
 */

import { NameDialog } from './name-dialog.js';

export class NameGenerator {
  static MODULE_NAME = "nameplace-generator";

  constructor() {
    this.dialog = null;
  }

  /**
   * Open the name generator dialog
   */
  openDialog() {
    try {
      if (this.dialog) {
        this.dialog.close();
      }
      this.dialog = new NameDialog();
      this.dialog.render(true);
    } catch (error) {
      console.error('Name Generator | Error opening dialog:', error);
      ui.notifications.error('Error opening Name Generator dialog');
    }
  }

  /**
   * Send selected city to chat
   */
  static async sendCityToChat(cityName, nation) {
    try {
      const nationName = game.i18n.localize(`NAME_GENERATOR.Nations.${nation}`);
      
      const message = game.i18n.format('NAME_GENERATOR.CitySentToChat', {
        city: cityName,
        nation: nationName
      });

      const chatContent = `
        <div class="nameplace-generator-chat-result">
          <div class="name-result-header">
            <i class="fas fa-city"></i>
            <h3>${game.i18n.localize('NAME_GENERATOR.ModuleTitle')}</h3>
          </div>
          <div class="name-result-content">
            <div class="selected-name">
              <i class="fas fa-city"></i>
              ${cityName}
            </div>
            <div class="nation-info">${nationName}</div>
          </div>
        </div>
      `;

      await ChatMessage.create({
        content: chatContent,
        whisper: []
      });

      ui.notifications.info(message);
    } catch (error) {
      console.error('Name Generator | Error sending city to chat:', error);
      ui.notifications.error('Error sending city to chat');
    }
  }

  /**
   * Get the module's API from game.modules
   * This is a convenience method for other modules to interact with this one
   */
  static getAPI() {
    const module = game.modules.get('nameplace-generator');
    return module ? module.api : null;
  }
}