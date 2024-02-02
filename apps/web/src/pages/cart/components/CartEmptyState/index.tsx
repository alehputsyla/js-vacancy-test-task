import { FC, memo } from 'react';
import NextLink from 'next/link';

import { Button, Center, Image, rem, Stack, Text, Title } from '@mantine/core';

import { RoutePath } from 'routes';

const CartEmptyState: FC = () => (
  <Center mt={rem(84)}>
    <Stack p="lg" gap="xl" align="center">
      <Image
        alt="Cart empty state"
        src="/images/cart-empty-state-icon.webp"
        w={rem(206)}
        h={rem(206)}
      />
      <Stack gap="md" align="center">
        <Title order={1} size={rem(20)}>Oops, there&apos;s nothing here yet!</Title>
        <Text c="dimmed" size="sm" ta="center">
          You haven&apos;t made any purchases yet.
          <br />
          Go to the marketplace and make purchases.
        </Text>
      </Stack>
      <NextLink href={RoutePath.Home}>
        <Button>Go to Marketplace</Button>
      </NextLink>
    </Stack>
  </Center>
);

export default memo(CartEmptyState);
