import { PasswordInput } from '@mantine/core';

import classes from './index.module.css';

export default PasswordInput.extend({
  classNames: {
    input: classes.input,
    innerInput: classes.innerInput,
  },
  defaultProps: {
    variant: 'default',
    radius: 'md',
    size: 'md',
  },
  styles: (theme, props) => {
    if (props.variant === 'default') {
      return {
        root: {
          '--caret-color': theme.colors[props.color || theme.primaryColor][5],
          '--brd__hover': theme.colors[props.color || theme.primaryColor][5],
          '--brd__focus': theme.colors[props.color || theme.primaryColor][5],
          '--brd__filled': theme.colors[props.color || theme.primaryColor][5],
        },
      };
    }

    return { root: {} };
  },
});
