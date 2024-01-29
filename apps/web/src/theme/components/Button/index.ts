import { Button } from '@mantine/core';

import classes from './index.module.css';

export default Button.extend({
  classNames: {
    root: classes.root,
  },
  defaultProps: {
    variant: 'filled',
    radius: 'md',
    size: 'md',
    fw: 500,
  },
  styles: (theme, props) => {
    if (props.variant === 'filled') {
      return {
        root: {
          '--bg': theme.colors[props.color || theme.primaryColor][6],
          '--bg__hover': theme.colors[props.color || theme.primaryColor][4],
          '--bg__active': theme.colors[props.color || theme.primaryColor][8],
        },
      };
    }

    if (props.variant === 'outline') {
      return {
        root: {
          '--brd': theme.colors.gray[3],
          '--brd__hover': theme.colors[props.color || theme.primaryColor][4],
          '--brd__active': theme.colors[props.color || theme.primaryColor][4],
          '--color': theme.colors.gray[6],
          '--color__hover': theme.colors[props.color || theme.primaryColor][6],
          '--color__active': theme.colors[props.color || theme.primaryColor][8],
        },
      };
    }

    return { root: {} };
  },
});
