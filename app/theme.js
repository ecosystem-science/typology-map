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
    height: [50, 70, 95, 95, 95],
    zIndex: 1200,
    primaryIcons: 40,
  },
  aside: {
    // by breakpoint
    width: [0, 280, 300, 420, 550],
    zIndex: 1150,
  },
  realmIcons: {
    single: 68,
    multi: 56,
  },
  realmIconsSmall: {
    single: 60,
    multi: 48,
  },
  icons: {
    size: 24,
  },
  topGraphic: {
    // by breakpoint
    height: [300, 300, 350, 420, 550],
  },
  mainContent: {
    zIndex: 1100,
    // by breakpoint
    maxWidth: [700, 700, 700, 800, 900],
  },
  home: {
    maxWidth: [700, 900, 1000, 1100, 1200],
  },
  settings: {
    height: {
      small: 62,
      large: 100,
    },
  },
  panelToggle: {
    width: 41, // align with map controls (icon (17px) + (padding) 2*12px)
  },
  settingsToggle: {
    width: 60, // align with map controls (icon (17px) + (padding) 2*12px)
  },
};

export const colors = {
  // used by grommet
  // active, text, border, ...
  // also see https://github.com/grommet/grommet/wiki/Grommet-v2-theming-documentation
  // and https://github.com/grommet/grommet/blob/master/src/js/themes/base.js
  black: '#000000',
  dark: '#333333',
  white: '#ffffff',
  // active: '#ffffff',
  brand: '#C60000', // rle red
  'brand-dark': '#B10000', // rle red
  'brand-2': '#00183A', // rle blue
  'brand-2-dark': '#011126', // rle blue
  'brand-2-light': '#1A76F8', // rle red
  'brand-2-lighter': '#85B6FB', // rle red
  focus: '#333333',
  hover: '#AD190F',
  'hover-grey': '#EEEEEE',
  // placeholder: '#ffffff',
  inactive: '#adadad',
  secondary: '#6e787d',
  grey: '#c4c8c9',
  'dark-grey': '#6E787D',
  'light-grey': '#F5F5F5',
  'light-grey-transparent': 'rgba(245, 245, 245, 0.9)',
  text: {
    dark: '#ffffff', // on dark background
    light: '#000000', // on light background
  },
  border: {
    dark: '#ffffff', // on dark background
    light: '#dddddd', // on light background
  },
  // other custom colours (also understood by grommet conmponents)
  // realms: {
  //   T: '',
  //   M: '',
  //   F: '',
  //   S: '',
  // },
  header: {
    background: '#00183A',
  },
  footer: {
    background: '#011126',
  },
};

// grommet text
const text = {
  xxxsmall: { size: '11px', height: '13px', maxWidth: '500px' },
  xxsmall: { size: '12px', height: '15px', maxWidth: '500px' },
  xsmall: { size: '13px', height: '16px', maxWidth: '600px' },
  small: { size: '14px', height: '18px', maxWidth: '700px' },
  medium: { size: '16px', height: '22px', maxWidth: '800px' },
  large: { size: '18px', height: '24px', maxWidth: '800px' },
  larger: { size: '24px', height: '30px', maxWidth: '800px' },
  xlarge: { size: '28px', height: '36px', maxWidth: '800px' },
  xxlarge: { size: '40px', height: '48px', maxWidth: '800px' },
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
    spacing: '18px',
    focus: {
      // disable focus and instead deal with it in css
      border: { color: 'transparent' },
      // not effective?
      outline: { color: 'transparent' },
      // not effective?
      shadow: { color: 'transparent' },
    },
    drop: {
      zIndex: 1200,
    },
  },
  rangeInput: {
    thumb: {
      color: colors['brand-2'],
      extend: () => ({
        width: '18px !important',
        height: '18px !important',
        border: 'none !important',
        outline: 'none !important',
        boxShadow: 'none !important',
      }),
    },
    track: {
      color: colors.grey,
      height: '6px',
      extend: () => ({
        borderRadius: '3px',
      }),
    },
  },
  checkBox: {
    size: '18px',
    gap: 'xsmall',
    toggle: {
      extend: () => ({
        background: colors.grey,
        border: `1.5px solid ${colors.grey} !important`,
      }),
      size: '36px',
      knob: {
        extend: ({ checked }) => ({
          background: `${colors[checked ? 'brand-2' : 'dark-grey']} !important`,
          border: `2px solid ${colors[checked ? 'brand-2' : 'dark-grey']
            } !important`,
        }),
      },
    },
  },
  layer: {
    overlay: {
      background: 'rgba(0, 0, 0, 0.5)',
    },
    zIndex: 1300,
    container: {
      zIndex: 1300,
    },
  },
};

export default theme;
