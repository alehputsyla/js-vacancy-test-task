import { FC } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { Burger, Button, Center, Group, Menu, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { RoutePath } from 'routes';

import classes from './index.module.css';

const TopBar: FC = () => {
  const router = useRouter();

  const [opened, { toggle }] = useDisclosure();

  return (
    <>
      <Center className={classes.menu} component={Group} gap="xl" visibleFrom="sm">
        <NextLink href={RoutePath.Home}>
          <Button radius="xl" size="md" fw={500} h={rem(40)} variant={router.pathname === RoutePath.Home ? 'shell__active' : 'shell'}>
            Marketplace
          </Button>
        </NextLink>

        <NextLink href={RoutePath.Products}>
          <Button radius="xl" size="md" fw={500} h={rem(40)} variant={router.pathname === RoutePath.Products ? 'shell__active' : 'shell'}>
            Your Products
          </Button>
        </NextLink>
      </Center>

      <Menu>
        <Menu.Target>
          <Burger opened={opened} onClick={toggle} size={rem(30)} aria-label="Toggle menu" hiddenFrom="sm" ml="auto" mr="xl" color="#767676" />
        </Menu.Target>
        <Menu.Dropdown p="xs" style={{ alignItems: 'center' }}>
          <Menu.Item
            component={NextLink}
            href={RoutePath.Home}
          >
            <Button size="md" fw={500} variant="shell" c={router.pathname === RoutePath.Home ? 'var(--mantine-color-black)' : ''}>
              Marketplace
            </Button>
          </Menu.Item>

          <Menu.Item
            component={NextLink}
            href={RoutePath.Products}
          >
            <Button size="md" fw={500} variant="shell" c={router.pathname === RoutePath.Products ? 'var(--mantine-color-black)' : ''}>
              Your Products
            </Button>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default TopBar;
