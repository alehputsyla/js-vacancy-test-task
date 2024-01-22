import React, { FC } from 'react';
import { Burger, Button, Center, Group, Menu, rem } from '@mantine/core';
import { useRouter } from 'next/router';
import { useDisclosure } from '@mantine/hooks';

import { Link } from 'components';
import { RoutePath } from 'routes';

import classes from './index.module.css';

const TopBar: FC = () => {
  const router = useRouter();

  const [opened, { toggle }] = useDisclosure();

  return (
    <>
      <Center className={classes.menu} component={Group} gap="xl" visibleFrom="sm">
        <Link type="router" href={RoutePath.Home} underline={false}>
          <Button radius="xl" size="md" fw={500} h={rem(40)} variant={router.pathname === RoutePath.Home ? 'shell-active' : 'shell'}>
            Marketplace
          </Button>
        </Link>

        <Link type="router" href={RoutePath.YourProducts} underline={false}>
          <Button radius="xl" size="md" fw={500} h={rem(40)} variant={router.pathname === RoutePath.YourProducts ? 'shell-active' : 'shell'}>
            Your Products
          </Button>
        </Link>
      </Center>

      <Menu>
        <Menu.Target>
          <Burger opened={opened} onClick={toggle} size={rem(30)} aria-label="Toggle menu" hiddenFrom="sm" ml="auto" mr="xl" color="#767676" />
        </Menu.Target>
        <Menu.Dropdown p="xs" style={{ alignItems: 'center' }}>
          <Menu.Item
            component={Link}
            type="router"
            href={RoutePath.Home}
            underline={false}
          >
            <Button size="md" fw={500} variant="shell" c={router.pathname === RoutePath.Home ? 'var(--mantine-color-black)' : ''}>
              Marketplace
            </Button>
          </Menu.Item>

          <Menu.Item
            component={Link}
            type="router"
            href={RoutePath.YourProducts}
            underline={false}
          >
            <Button size="md" fw={500} variant="shell" c={router.pathname === RoutePath.YourProducts ? 'var(--mantine-color-black)' : ''}>
              Your Products
            </Button>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default TopBar;
