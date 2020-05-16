import { reduce } from 'lodash/collection';

// theme defining breakpoints, colors, sizes, grid gutters
export const sizes = {
  small: {
    min: 0,
    max: 720, // inclusive
    name: 'mobile',
    index: 0,
  },
  medium: {
    min: 721,
    max: 992,
    name: 'tablet (portrait)',
    index: 1,
  },
  large: {
    min: 993,
    max: 1152,
    name: 'laptop/tablet (landscape)',
    index: 2,
  },
  xlarge: {
    min: 1153,
    max: 1728,
    name: 'desktop',
    index: 3,
  },
  xxlarge: {
    min: 1729,
    max: 99999999,
    name: 'large desktop',
    index: 4,
  },
};

export const dimensions = {
  header: {
    // by breakpoint
    height: [50, 50, 95, 95, 95],
  },
};

export const colors = {
  // used by grommet
  // active, text, border, ...
  // also see https://github.com/grommet/grommet/wiki/Grommet-v2-theming-documentation
  // and https://github.com/grommet/grommet/blob/master/src/js/themes/base.js
  black: '#000000',
  white: '#ffffff',
  // active: '#ffffff',
  // brand: '#ffffff',
  focus: '#ffffff',
  // placeholder: '#ffffff',
  text: {
    dark: '#ffffff', // on dark background
    light: '#000000', // on light background
  },
  border: {
    dark: '#ffffff', // on dark background
    light: '#dddddd', // on light background
  },
  // other custom colours (also udnerstood by grommet conmponents)
  // realms: {
  //   T: '',
  //   M: '',
  //   F: '',
  //   S: '',
  // },
  header: {
    background: '#000000',
  },
};

// grommet text
const text = {
  xxsmall: { size: '12px', height: '14px', maxWidth: '500px' },
  xsmall: { size: '13px', height: '16px', maxWidth: '600px' },
  small: { size: '14px', height: '18px', maxWidth: '700px' },
  medium: { size: '16px', height: '21px', maxWidth: '800px' },
  large: { size: '18px', height: '24px', maxWidth: '800px' },
  xlarge: { size: '22px', height: '30px', maxWidth: '800px' },
  xxlarge: { size: '30px', height: '36px', maxWidth: '800px' },
  xxxlarge: { size: '60px', height: '75px', maxWidth: '800px' },
};
// grommet paddings and margins
const edgeSize = {
  hair: '1px',
  xxsmall: '3px',
  xsmall: '6px',
  small: '12px',
  ms: '16px',
  medium: '24px',
  ml: '36px',
  large: '48px',
  xlarge: '64px',
  xxlarge: '100px',
};
// grommet icon size
const icon = {
  size: {
    small: '14px',
    medium: '17px',
    large: '20px',
    xlarge: '24px',
    xxlarge: '32px',
  },
};

const theme = {
  dimensions,
  sizes: reduce(
    sizes,
    (sizespx, s, key) => ({
      ...sizespx,
      [key]: {
        ...s,
        minpx: `${s.min}px`,
        maxpx: `${s.max}px`,
      },
    }),
    {},
  ),
  // used for grommet
  icon,
  text,
  paragraph: text,
  global: {
    // margins & paddings
    edgeSize,
    font: {
      // family: 'Source Sans Pro',
      height: '22px',
      size: '16px',
    },
    colors,
    input: {
      padding: '2px',
      weight: 400,
    },
    breakpoints: {
      small: {
        value: sizes.small.max,
      },
      medium: {
        value: sizes.medium.max,
      },
      large: {
        value: sizes.large.max,
      },
      xlarge: {
        value: sizes.xlarge.max,
      },
      xxlarge: {},
    },
  },
};

export default theme;
