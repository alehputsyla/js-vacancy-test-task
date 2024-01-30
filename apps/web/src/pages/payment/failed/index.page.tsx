import { NextPage } from 'next';
import Head from 'next/head';

import { Button, Center, Image, Paper, rem, Stack, Text, Title } from '@mantine/core';

import { Link } from 'components';

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
          <Link type="router" href={RoutePath.MyCart} underline={false}>
            <Button w={rem(186)}>Back to Cart</Button>
          </Link>
        </Stack>
      </Paper>
    </Center>
  </>
);

export default PaymentFailed;
