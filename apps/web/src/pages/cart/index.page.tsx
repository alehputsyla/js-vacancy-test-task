import Head from 'next/head';
import { NextPage } from 'next';

import {
  Button,
  Image,
  Stack,
  Table,
  Text,
  Group,
  NumberFormatter,
  rem,
  Paper, Grid, Divider, Tooltip,
} from '@mantine/core';
import { IconMinus, IconPlus, IconX } from '@tabler/icons-react';

import { useCart } from 'hooks';

import { handleError } from 'utils';

import { orderApi } from 'resources/order';

import CartMenu from './components/CartMenu';
import CartEmptyState from './components/CartEmptyState';

import classes from './index.module.css';

const Cart: NextPage = () => {
  const { cartValue, removeFromCart, updateInCartQuantity } = useCart();

  const {
    mutate: orderCreate,
    isLoading: isOrderCreateLoading,
  } = orderApi.useCreate();

  const handleCreateOrder = () => {
    if (cartValue) {
      const cart = cartValue
        .map(({ _id, quantityCart }) => ({ _id, quantity: quantityCart }));

      orderCreate({ cart }, {
        onSuccess: ({ url }) => {
          window.location.href = url;
        },
        onError: (e) => handleError(e),
      });
    }
  };

  if (!cartValue) return null;

  const cartPrice = cartValue
    .reduce((total, product) => total + product.quantityCart * product.price, 0);

  const rows = cartValue.map((product) => (
    <Table.Tr key={product._id} className={classes.row} style={{ borderWidth: rem(1) }}>
      <Table.Td width="50%">
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

      <Table.Td width="20%">
        <Group justify="center">
          <Button
            p={0}
            variant="shell"
            onClick={() => updateInCartQuantity(product._id, product.quantityCart - 1)}
            disabled={product.quantityCart - 1 === 0}
          >
            <IconMinus size={18} />
          </Button>
          <Tooltip label={`Max quantity: ${product.quantity}`} color="dark.4" position="top">
            <Text miw={24} ta="center">
              {product.quantityCart}
            </Text>
          </Tooltip>
          <Button
            p={0}
            variant="shell"
            onClick={() => updateInCartQuantity(product._id, product.quantityCart + 1)}
            disabled={product.quantityCart + 1 > product.quantity}
          >
            <IconPlus size={18} />
          </Button>
        </Group>
      </Table.Td>

      <Table.Td width="15%">
        <Button variant="shell" onClick={() => removeFromCart(product._id)} fw={400}>
          <IconX size={18} />
          <Text ml={4}>Remove</Text>
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  const content = cartValue.length === 0 ? (
    <Stack>
      <CartMenu />
      <CartEmptyState />
    </Stack>
  ) : (
    <Grid gutter="xl">

      <Grid.Col span={{ base: 12, md: 12, lg: 9, xl: 9 }}>
        <Stack>
          <CartMenu />

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
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Stack>
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 6, md: 6, lg: 3, xl: 3 }}>
        <Paper withBorder radius="lg" p="lg">
          <Text fw={700} fz="xl" lh={1}>
            Summary
          </Text>
          <Divider my="xl" />
          <Group justify="space-between">
            <Text c="dimmed">Total price</Text>
            <Text fw={700}>
              <NumberFormatter prefix="$" thousandSeparator value={cartPrice} />
            </Text>
          </Group>
          <Button mt="xl" variant="filled" size="sm" fullWidth loading={isOrderCreateLoading} onClick={handleCreateOrder}>
            Proceed to Checkout
          </Button>
        </Paper>
      </Grid.Col>
    </Grid>
  );

  return (
    <>
      <Head>
        <title>My Cart</title>
      </Head>

      {content}
    </>
  );
};

export default Cart;
