'use strict';

const validLanguages = ['en', 'ru'];


const languages = {

  // Returns a list of all valid language keys. We make a copy to prevent accidental manipulation.
  getValidLanguages() {
    return validLanguages.slice();
  },
  isValid(langKey) {
    return validLanguages.indexOf(langKey) !== -1;
  }
};


module.exports = languages;
