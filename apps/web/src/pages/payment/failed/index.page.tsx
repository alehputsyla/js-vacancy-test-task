import { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';

import { Button, Center, Image, Paper, rem, Stack, Text, Title } from '@mantine/core';

import { RoutePath } from 'routes';

const PaymentFailed: NextPage = () => (
  <>
    <Head>
      <title>Payment Failed</title>
    </Head>

    <Center mt={rem(84)}>
      <Paper w={rem(480)} radius="lg">
        <Stack p="lg" gap="xl" align="center">
          <Image
            alt="Payment Failed"
            src="/images/payment-failed-icon.webp"
            w={rem(56)}
          />
          <Stack gap="md" align="center">
            <Title order={1} size="h2">Payment Failed</Title>
            <Text c="dimmed" ta="center">
              Sorry, your payment failed.
              <br />
              Would you like to try again?
            </Text>
          </Stack>
          <NextLink href={RoutePath.Cart}>
            <Button w={rem(186)}>Back to Cart</Button>
          </NextLink>
        </Stack>
      </Paper>
    </Center>
  </>
);

export default PaymentFailed;
