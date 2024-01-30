import { NextPage } from 'next';
import Head from 'next/head';

import { Button, Center, Image, Paper, rem, Stack, Text, Title } from '@mantine/core';

import { Link } from 'components';

import { RoutePath } from 'routes';

const PaymentSuccessfull: NextPage = () => (
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
          <Link type="router" href={RoutePath.Home} underline={false}>
            <Button w={rem(186)}>Back to Marketplace</Button>
          </Link>
        </Stack>
      </Paper>
    </Center>
  </>
);

export default PaymentSuccessfull;
