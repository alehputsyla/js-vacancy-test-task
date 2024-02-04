import Head from 'next/head';
import { NextPage } from 'next';

import {
  Grid,
  Group,
  Image,
  NumberFormatter,
  rem,
  Stack,
  Table,
  Text,
  UnstyledButton,
} from '@mantine/core';

import { orderApi } from 'resources/order';

import dayjs from 'dayjs';

import { handleError } from 'utils';

import { IconCash, IconX } from '@tabler/icons-react';

import CartMenu from '../components/CartMenu';
import CartEmptyState from '../components/CartEmptyState';

import classes from './index.module.css';

const CartHistory: NextPage = () => {
  const { data } = orderApi.useListPersonal();
  const { mutate: removeOrder, isLoading: isRemoveOrderLoading } = orderApi.useRemove();
  const { mutate: retryPayment, isLoading: isRetryPaymentLoading } = orderApi.useRetry();

  if (!data) return null;

  const orders = data.items;

  const ordersProducts = orders
    .map(({ products, paidOn, _id }) => products
      .map((product) => ({ ...product, paidOn, orderId: _id })))
    .flat();

  const ordersProductsCompleted = ordersProducts.filter((p) => p.paidOn);

  const ordersProductsUncompleted = ordersProducts.filter((p) => !p.paidOn);

  const rowsCompleted = ordersProductsCompleted.map((product) => (
    <Table.Tr key={product._id} className={classes.row} style={{ borderWidth: rem(1) }}>
      <Table.Td width="55%">
        <Group>
          <Image src={product.photoUrl} radius="md" w={rem(80)} h={rem(80)} />
          <Text fw={700}>
            {product.title}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td width="15%">
        <Text ta="right">
          <NumberFormatter prefix="$" thousandSeparator value={product.price} />
        </Text>
      </Table.Td>

      <Table.Td width="15%">
        <Text miw={24} ta="center">
          {product.quantity}
        </Text>
      </Table.Td>

      <Table.Td width="10%">
        <Text miw={24} ta="right">
          {product.paidOn && dayjs(product.paidOn).format('DD.MM.YYYY')}
        </Text>
      </Table.Td>
    </Table.Tr>
  ));

  const rowsUncompleted = ordersProductsUncompleted.map((product) => (
    <Table.Tr key={product._id} className={classes.row} style={{ borderWidth: rem(1) }}>
      <Table.Td width="55%">
        <Group>
          <Image src={product.photoUrl} radius="md" w={rem(80)} h={rem(80)} />
          <Text fw={700}>
            {product.title}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td width="15%">
        <Text ta="right">
          <NumberFormatter prefix="$" thousandSeparator value={product.price} />
        </Text>
      </Table.Td>

      <Table.Td width="15%">
        <Text miw={24} ta="center">
          {product.quantity}
        </Text>
      </Table.Td>

      <Table.Td width="10%">
        <Stack gap="xs" align="flex-end">
          <UnstyledButton
            disabled={isRemoveOrderLoading || isRetryPaymentLoading}
            onClick={() => removeOrder({ orderId: product.orderId }, {
              onError: (e) => handleError(e),
            })}
            w="fit-content"
            display="flex"
            style={{ alignItems: 'center' }}
            c="dimmed"
          >
            <IconX size={18} />
            <Text ml={4}>Remove</Text>
          </UnstyledButton>
          <UnstyledButton
            disabled={isRemoveOrderLoading || isRetryPaymentLoading}
            onClick={() => retryPayment({ orderId: product.orderId }, {
              onSuccess: ({ url }) => {
                window.location.href = url;
              },
              onError: (e) => handleError(e),
            })}
            w="fit-content"
            display="flex"
            c="dimmed"
            style={{ alignItems: 'center' }}
          >
            <IconCash size={18} />
            <Text ml={4}>Retry</Text>
          </UnstyledButton>
        </Stack>
      </Table.Td>
    </Table.Tr>
  ));

  const content = orders.length === 0 ? (
    <Stack>
      <CartMenu />
      <CartEmptyState />
    </Stack>
  ) : (
    <Grid gutter="xl">
      <Grid.Col span={{ base: 12, md: 12, lg: 9, xl: 9 }}>
        <Stack>
          <CartMenu />

          {ordersProductsUncompleted?.length > 0
              && (
              <Table.ScrollContainer minWidth={rem(668)}>
                <Table verticalSpacing="sm" withRowBorders={false}>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th py={0}>
                        <Text c="dimmed">Unpaid Item</Text>
                      </Table.Th>
                      <Table.Th py={0}>
                        <Text c="dimmed" ta="right">Unit Price</Text>
                      </Table.Th>
                      <Table.Th py={0}>
                        <Text c="dimmed" ta="center">Quantity</Text>
                      </Table.Th>
                      <Table.Th py={0}>
                        <Text c="dimmed" ta="right">Options</Text>
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody>{rowsUncompleted}</Table.Tbody>
                </Table>
              </Table.ScrollContainer>
              )}

          <Table.ScrollContainer minWidth={rem(668)}>
            <Table verticalSpacing="sm" withRowBorders={false}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th py={0}>
                    <Text c="dimmed">Item</Text>
                  </Table.Th>
                  <Table.Th py={0}>
                    <Text c="dimmed" ta="right">Unit Price</Text>
                  </Table.Th>
                  <Table.Th py={0}>
                    <Text c="dimmed" ta="center">Quantity</Text>
                  </Table.Th>
                  <Table.Th py={0}>
                    <Text c="dimmed" ta="right">Date</Text>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>{rowsCompleted}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Stack>
      </Grid.Col>
    </Grid>
  );

  return (
    <>
      <Head>
        <title>My cart - History</title>
      </Head>

      {content}
    </>
  );
};

export default CartHistory;
