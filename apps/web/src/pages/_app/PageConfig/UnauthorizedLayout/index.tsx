import { FC, ReactElement } from 'react';
import { SimpleGrid, Center, Stack, rem, Group, Avatar, Text, Title, Image, Box } from '@mantine/core';

import { LogoImage } from 'public/images';
import { RoutePath } from 'routes';
import { Link } from 'components';

import classes from './index.module.css';

interface UnauthorizedLayoutProps {
  children: ReactElement;
}

const UnauthorizedLayout: FC<UnauthorizedLayoutProps> = ({ children }) => (
  <SimpleGrid
    cols={{ base: 1, sm: 2 }}
    spacing="sm"
    bg="#FCFCFC"
    mih="100vh"
  >
    <Center px="xl" p="xl" component="main">
      {children}
    </Center>

    <Center p="xl">
      <Stack gap="xl" bg="#F4F4F4" miw="100%" mih="100%" justify="flex-end" style={{ borderRadius: rem(12) }} px="xl" pt={rem(120)} pb={rem(46)} pos="relative">
        <Link type="router" href={RoutePath.Home}>
          <LogoImage style={{ position: 'absolute', top: rem(40), left: rem(40) }} />
        </Link>

        <Box className={classes.images}>
          <Image
            alt="Item card 1"
            src="/images/shop-item-card-1.webp"
            radius="md"
            className={classes.card1}
          />
          <Image
            alt="Shop"
            src="/images/shop.webp"
            radius="md"
            className={classes.shop}
          />
          <Image
            alt="Item card 2"
            src="/images/shop-item-card-2.webp"
            radius="md"
            className={classes.card2}
          />
        </Box>

        <Stack>
          <Title order={2} size="h1" fw={700}>
            Sell and buy products super
            {' '}
            <span className={classes.space}>quickly!</span>
          </Title>

          <Text fz="xl">
            Save your time, we take care of all the processing.
          </Text>
        </Stack>

        <Group>
          <Group gap={0} mr="lg">
            {[1, 2, 3, 4, 5].map((key) => (
              <Avatar key={key} src={`/images/avatar-${key}.webp`} alt={`Avatar ${key}`} size={rem(38)} mr={rem(-15)} style={{ border: `${rem(2)} solid var(--mantine-color-white)` }} />
            ))}
          </Group>

          <Text>
            <Text component="span" fw={600}>+100</Text>
            {' '}
            users from all over the world
          </Text>
        </Group>
      </Stack>
    </Center>
  </SimpleGrid>
);

export default UnauthorizedLayout;
