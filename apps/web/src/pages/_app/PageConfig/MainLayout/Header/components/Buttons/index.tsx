import { FC } from 'react';
import { Group, Indicator, rem, UnstyledButton } from '@mantine/core';
import cx from 'clsx';
import { useRouter } from 'next/router';

import { Link } from 'components';
import { RoutePath } from 'routes';
import { useCart } from 'hooks';

import { CartIcon, ExitIcon } from 'public/icons';

import { accountApi } from 'resources/account';

import classes from './index.module.css';

const Buttons: FC = () => {
  const router = useRouter();

  const { mutate: signOut } = accountApi.useSignOut();

  const { cartValue } = useCart();

  return (
    <Group gap="xl">
      <Link type="router" href={RoutePath.MyCart} underline={false}>
        <Indicator
          size={rem(20)}
          inline
          disabled={cartValue?.length === 0}
          label={cartValue?.length}
          classNames={{ indicator: classes.indicator }}
        >
          <UnstyledButton className={classes.button}>
            <CartIcon className={cx(
              { [classes.active]: router.pathname === RoutePath.MyCart },
            )}
            />
          </UnstyledButton>
        </Indicator>
      </Link>
      <UnstyledButton className={classes.button} onClick={() => signOut()}>
        <ExitIcon />
      </UnstyledButton>
    </Group>
  );
};

export default Buttons;
