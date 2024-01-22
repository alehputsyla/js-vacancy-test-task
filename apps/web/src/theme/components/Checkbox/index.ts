import { Checkbox } from '@mantine/core';

import classes from './index.module.css';

export default Checkbox.extend({
  classNames: () => ({
    root: classes.root,
    inner: classes.inner,
    input: classes.input,
    icon: classes.icon,
  }),
});
