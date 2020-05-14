import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the language domain
 */

const selectLanguage = state => state.language || initialState;

/**
 * Select the language locale
 */
const selectLocale = createSelector(
  selectLanguage,
  languageState => languageState.locale,
);

export { selectLanguage, selectLocale };
