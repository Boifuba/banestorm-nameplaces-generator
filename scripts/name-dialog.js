/**
 * Name Generator Dialog Class
 */

import { NAME_DATA } from './name-data.js';
import { NameGenerator } from './nameplace-generator.js';

export class NameDialog extends Dialog {
  constructor() {
    const content = `
      <div class="nameplace-generator-form">
        <div class="nameplace-generator-form-header">
          <i class="fas fa-city"></i>
          <h2>${game.i18n.localize('NAME_GENERATOR.DialogTitle')}</h2>
        </div>
        
        <form class="nameplace-generator-dialog-form">
          <div class="nameplace-generator-form-section">
            <div class="nameplace-generator-form-group">
              <label for="nation-select">
                <i class="fas fa-flag"></i>
                ${game.i18n.localize('NAME_GENERATOR.SelectNation')}
              </label>
              <select id="nation-select" name="nation" class="nameplace-generator-nation-select">
                ${Object.keys(NAME_DATA).map(nation => 
                  `<option value="${nation}">${game.i18n.localize(`NAME_GENERATOR.Nations.${nation}`)}</option>`
                ).join('')}
              </select>
            </div>
          </div>

          <div class="nameplace-generator-names-container">
            <div class="nameplace-generator-names-list" id="names-list">
              <div class="nameplace-generator-no-names">${game.i18n.localize('NAME_GENERATOR.GenerateCities')}</div>
            </div>
          </div>
        </form>
      </div>
    `;

    super({
      title: game.i18n.localize('NAME_GENERATOR.DialogTitle'),
      content: content,
      buttons: {
        generate: {
          icon: '<i class="fas fa-dice"></i>',
          label: game.i18n.localize('NAME_GENERATOR.GenerateCities'),
          callback: (html) => {
            this._generateNames(html);
            return false; // Prevent dialog from closing
          },
        },
        close: {
          icon: '<i class="fas fa-times"></i>',
          label: "Close",
        },
      },
      default: "generate",
      classes: ["nameplace-generator-dialog"],
      resizable: true,
      close: () => {}
    });

    this.currentNation = Object.keys(NAME_DATA)[0];
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Handle nation selection change
    html.find('#nation-select').on('change', (event) => {
      this.currentNation = event.target.value;
      this._generateNames(html);
    });

    // Override the generate button to prevent closing
    html.find('button[data-button="generate"]').off('click').on('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this._generateNames(html);
    });

    // Auto-generate names on dialog open
    setTimeout(() => {
      this._generateNames(html);
    }, 100);
  }

  _generateNames(html) {
    const nationSelect = html.find('#nation-select');
    const nation = nationSelect.val() || this.currentNation;
    const namesList = html.find('#names-list');

    if (!NAME_DATA[nation]) {
      ui.notifications.error(`Nation data not found: ${nation}`);
      return;
    }

    // Get city names
    const availableCities = NAME_DATA[nation].cities || [];

    if (availableCities.length === 0) {
      namesList.html('<div class="nameplace-generator-no-names">No cities available for this nation</div>');
      return;
    }

    // Generate 5 random city names
    const selectedCities = [];
    const usedIndices = new Set();

    while (selectedCities.length < 5 && selectedCities.length < availableCities.length) {
      const randomIndex = Math.floor(Math.random() * availableCities.length);
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        const cityName = availableCities[randomIndex];
        
        selectedCities.push({
          name: cityName
        });
      }
    }

    // Create HTML for city names
    const citiesHtml = selectedCities.map(cityData => 
      `<div class="nameplace-generator-name-item city" data-name="${cityData.name}" data-nation="${nation}">
        <i class="fas fa-city"></i>
        <span class="nameplace-generator-name-text">${cityData.name}</span>
      </div>`
    ).join('');

    namesList.html(citiesHtml);

    // Add click handlers for city selection
    namesList.find('.nameplace-generator-name-item').on('click', (event) => {
      const nameElement = $(event.currentTarget);
      const selectedCity = nameElement.data('name');
      const selectedNation = nameElement.data('nation');

      // Visual feedback
      nameElement.addClass('nameplace-generator-selected');
      setTimeout(() => {
        nameElement.removeClass('nameplace-generator-selected');
      }, 300);

      // Send to chat
      NameGenerator.sendCityToChat(selectedCity, selectedNation);
    });
  }
}