import { Button, Group } from '@mantine/core';
import { FC, memo } from 'react';
import { RoutePath } from 'routes';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

const CartMenu: FC = () => {
  const router = useRouter();

  return (
    <Group gap="xl">
      <NextLink href={RoutePath.Cart}>
        <Button variant="shell" fz="xl" p={0} fw={600} c={router.pathname === RoutePath.Cart ? 'black' : ''}>
          My cart
        </Button>
      </NextLink>
      <NextLink href={RoutePath.CartHistory}>
        <Button variant="shell" fz="xl" p={0} fw={600} c={router.pathname === RoutePath.CartHistory ? 'black' : ''}>
          History
        </Button>
      </NextLink>
    </Group>
  );
};

export default memo(CartMenu);
