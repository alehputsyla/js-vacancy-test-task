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
} from '@mantine/core';

import CartMenu from '../components/CartMenu';
import CartEmptyState from '../components/CartEmptyState';

import classes from './index.module.css';

type TestData = {
  _id: string;
  title: string,
  price: number,
  quantity: number,
  photoUrl: string,
  purchaseDate: string,
}[];

const testData: TestData = [];

const CartHistory: NextPage = () => {
  if (!testData) return null;

  const rows = testData.map((product) => (
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
          {product.purchaseDate}
        </Text>
      </Table.Td>
    </Table.Tr>
  ));

  const content = testData.length === 0 ? (
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
                  <Table.Th py={0}>
                    <Text c="dimmed" ta="right">Date</Text>
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>{rows}</Table.Tbody>
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
