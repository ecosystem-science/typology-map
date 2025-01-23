import { toLower, toUpper, deburr } from 'lodash/string';
import { reduce } from 'lodash/collection';

import { startsWith } from 'utils/string';

// match multiple words, incl substrings
export const regExMultipleWords = str =>
  reduce(str.split(' '), (words, s) => `${words}(?=.*${s})`, '');

// match multiple words
// const regExMultipleWordsMatchStart = str =>
//   reduce(str.split(' '), (words, s) => `${words}(?=.*\\b${s})`, '');

// cleanup input string
/* eslint-disable no-useless-escape */
const invalid = /[°"§%()\[\]{}=\\?´`'#<>|;:+_]+/g;
export const sanitise = str => str.replace(invalid, '');

// cleanup search target
export const cleanupSearchTarget = str => toLower(deburr(str));

const filterTaxonomy = (item, search) => {
  if (!search || search.trim().length < 1) return true;
  if (startsWith(toLower(item.code), toLower(search))) return true;
  if (search.trim().length > 1) {
    try {
      const regex = new RegExp(regExMultipleWords(search), 'i');
      return regex.test(cleanupSearchTarget(`${item.label} ${item.keywords}`));
    } catch {
      return true;
    }
  }
  return false;
};

// make bold macthing substring
const highlightCode = (str, search) =>
  str.replace(toUpper(search), `<strong>${toUpper(search)}</strong>`);

// make bold all matching substrings of all matching words
const highlightLabel = (str, search) =>
  reduce(
    search.split(' '),
    (highlighted, searchWord) => {
      if (searchWord.length < 2) return highlighted;
      const regex = new RegExp(searchWord, 'i');
      return highlighted.replace(regex, s => `[${s}]`);
    },
    str,
  )
    .replace(/\[/g, '<strong>')
    .replace(/\]/g, '</strong>');

// prettier-ignore
export const prepTaxonomies = (items, search, locale) =>
  items
    ? items
      .map(item => ({
        code: item.id,
        label: item.title ? item.title[locale || 'en'] : '',
        keywords: item.keywords
          ? item.keywords[locale || 'en']
            .split(',')
            .map(w => w.trim())
            .join(', ')
          : '',
      }))
      .filter(item => filterTaxonomy(item, search))
      .map(item => {
        if (search.length === 0) return item;
        return {
          ...item,
          codeHTML: highlightCode(item.code, search),
          labelHTML: highlightLabel(item.label, search),
        };
      })
      .sort((a, b) => {
        if (a.code.length < b.code.length) return -1;
        if (a.code.length === b.code.length && a.code < b.code) return -1;
        return 1;
      })
    : [];
