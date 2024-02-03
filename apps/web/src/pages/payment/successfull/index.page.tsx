import { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';

import { useEffect } from 'react';

import { Button, Center, Image, Paper, rem, Stack, Text, Title } from '@mantine/core';

import { RoutePath } from 'routes';

import { useCart } from 'hooks';

const PaymentSuccessfull: NextPage = () => {
  const { resetCart } = useCart();

  useEffect(() => {
    resetCart();
  }, [resetCart]);

  return (
    <>
      <Head>
        <title>Payment Successfull</title>
      </Head>

      <Center mt={rem(84)}>
        <Paper w={rem(480)} radius="md">
          <Stack p="lg" gap="xl" align="center">
            <Image
              alt="Payment Successfull"
              src="/images/payment-successfull-icon.webp"
              w={rem(56)}
            />
            <Stack gap="md" align="center">
              <Title order={1} size="h2">Payment Successfull</Title>
              <Text c="dimmed" ta="center">Hooray, you have completed your payment!</Text>
            </Stack>
            <NextLink href={RoutePath.Home}>
              <Button miw={rem(186)}>Back to Marketplace</Button>
            </NextLink>
          </Stack>
        </Paper>
      </Center>
    </>
  );
};

export default PaymentSuccessfull;
