import { createTheme } from '@mantine/core';

import * as components from './components';

const mainTheme = createTheme({
  fontFamily: 'Inter, sans-serif',
  fontFamilyMonospace: 'monospace',
  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '600',
  },
  lineHeights: {
    base: '1.5',
  },
  colors: {
    blue: [
      '#e5f4ff',
      '#d1e3ff',
      '#a2c5f9',
      '#71a4f3',
      '#4789ee',
      '#2c78eb',
      '#196feb',
      '#075ed1',
      '#0053bd',
      '#0048a7',
    ],
  },
  primaryColor: 'blue',
  primaryShade: 5,
  black: '#201F22',
  components,
});

export default mainTheme;
