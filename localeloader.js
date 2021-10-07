/** @license
  Copyright 2021 Daltro A. Campanher de Souza

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 */
// @ts-nocheck

/**
  * **SimpleLocaleLoader**
  * A really minimal and simple library that uses eval() for basic and flexible i18n.
*/
 export default class SimpleLocaleLoader {
  /**
   * @constructor
   * @param {String} localesMap URL (relative or absolute) for a JSON array of available locales. Files should be in the same folder, with <code>.json filename syntax.
   * @param {Boolean} localizeOnStart Sets if document will be automatically localized when running Object.initialize().
   * @param {String} fallbackLocale Code for fallback locale. Need to be available in the indicated map.
   */
  constructor(localesMap, localizeOnStart = true, fallbackLocale = "en") {
    this.browserLocale = navigator.language.substr(0, 2);
    this.fallback = fallbackLocale;
    this.localizeOnStart = localizeOnStart;
    this.mapUrl = localesMap;
  }

  /**
   * Runs all the initialization chain. Localizes document except if Object.localizeOnStart equals to false.
   * @returns {Promise<Boolean>}
   */
  initialize() {
    return new Promise(resolve => {
      fetch(this.mapUrl)
        .then(r => r.json())
        .then(map => (this.availableLocales = map))
        .then(() => this.loadLocale())
        .then(() => { 
          if(this.localizeOnStart) this.localizeDocument();
        })
        .then(() => resolve(true))
        .catch(err => {
          throw new Error(err);
        });
    });
  }

  /**
   * Loads actual locale strings to Object.strings.
   * @returns {Promise<Boolean>}
   */
  loadLocale() {
    if (!this.locale) this.setCurrentLocale();
    const localeUrl =
      this.mapUrl.slice(0, this.mapUrl.lastIndexOf("/")) +
      `/${this.locale}.json`;
    // console.log(`localeUrl is ${localeUrl}`); PASSING! [initialize]

    return new Promise((resolve, reject) => {
      fetch(localeUrl)
        .then(r => r.json())
        .then(data => {
          this.strings = data;
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Sets actual locale code in Object.localeCode.
   */
  setCurrentLocale() {
    if (this.isAvailableLocale(this.browserLocale)) {
      this.locale = this.browserLocale;
    } else {
      this.locale = this.fallback;
    }
  }

  /**
   * Checks if a language is available.
   * @param {String} langCode
   * @returns {Boolean}
   */
  isAvailableLocale(langCode) {
    for (const lang of this.availableLocales) {
      if (langCode == lang) return true;
    }

    return false;
  }

  /**
   * Actually localizes the document. Requires an already loaded strings (locale) collection in Object.strings. Uses eval().
   */
  localizeDocument() {
    for (const node of document.querySelectorAll("[string]")) {
      const nodeString = node.getAttribute("string");
      const thestring = eval(`this.strings.${nodeString}`);
  
      node.innerHTML = thestring;
    }

    for (const node of document.querySelectorAll("[placeholderstring]")) {
      const phString = node.getAttribute("placeholderstring");
      const thestring = eval(`this.strings.${phString}`);
  
      node.setAttribute("placeholder", thestring);
    }
  
    window.dispatchEvent(new Event("localesloaded"));
  }

  /**
   * Gets a specific string. Locales need to be already loaded via initialize or modularly with Object.loadLocale().
   * @param {String} key Key of a string, as in its locale JSON files.
   * @returns {(String|Boolean)} The string itself or false if strings are not loaded yet or if the key wasn't found.
   */
  getString(key) {
    if(!this.strings) return false;

    try {
      return eval(`this.strings.${key}`); 
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
