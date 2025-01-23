import isNumber from 'utils/is-number';

export const roundNumber = (value, digits = 1) => {
  const parsed = parseFloat(value);
  const factor = 10 ** Math.min(digits, 10);
  return isNumber(parsed) && Math.round(value * factor) / factor;
};

export const formatNumber = (value, intl, digits = 0, options) =>
  intl.formatNumber(roundNumber(value, digits), options);

export const formatAreaRelative = (value, intl) => {
  const options = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 5,
  };
  if (value < 0.0001) {
    return formatNumber(value * 100, intl, 4, options);
  }
  if (value < 0.001) {
    return formatNumber(value * 100, intl, 3, options);
  }
  if (value < 0.01) {
    return formatNumber(value * 100, intl, 2, options);
  }
  return formatNumber(value * 100, intl, 1, options);
};

export default { isNumber };
