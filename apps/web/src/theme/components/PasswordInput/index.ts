import { PasswordInput } from '@mantine/core';

import classes from './index.module.css';

export default PasswordInput.extend({
  classNames: {
    input: classes.input,
    innerInput: classes.innerInput,
  },
});
