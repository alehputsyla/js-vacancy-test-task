import { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';

import {
  AspectRatio,
  BackgroundImage,
  Button,
  Card,
  Center,
  Flex,
  Group,
  NumberFormatter,
  Paper,
  rem,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';

import { IconPlus, IconTrash } from '@tabler/icons-react';

import { RoutePath } from 'routes';

import { productApi } from 'resources/product';

const Products: NextPage = () => {
  const { data } = productApi.useListPersonal();
  const { mutate: removeProduct } = productApi.useRemove();

  const openDeleteModal = (id: string) => modals.openConfirmModal({
    title: 'Delete your product',
    centered: true,
    children: (
      <Text size="sm">
        Are you sure you want to delete your product? This action is destructive and you will have
        to contact support to restore your data.
      </Text>
    ),
    labels: { confirm: 'Delete product', cancel: "No, don't delete it" },
    confirmProps: { color: 'red' },
    cancelProps: { variant: 'outline' },
    onConfirm: () => removeProduct({ id }, {
      onSuccess: () => {
        showNotification({
          title: 'Success',
          message: 'Your product has been successfully deleted.',
          color: 'green',
        });
      },
    }),
  });

  return (
    <>
      <Head>
        <title>Your Products</title>
      </Head>
      <Stack
        gap="lg"
      >
        <Title order={1} size="h3">Your Products</Title>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }}>
          <UnstyledButton
            component={NextLink}
            href={RoutePath.ProductsCreate}
          >
            <AspectRatio ratio={271 / 266}>
              <Card p={0} radius="lg" withBorder h="100%" w="100%">
                <Center h="100%" w="100%">
                  <Stack align="center" gap="sm">
                    <Paper radius="100%" bg="blue.4" w={rem(40)} h={rem(40)} p={rem(7)}>
                      <IconPlus color="white" style={{ width: '100%', height: '100%' }} />
                    </Paper>
                    <Text c="blue.4" fz="lg">New Product</Text>
                  </Stack>
                </Center>
              </Card>
            </AspectRatio>
          </UnstyledButton>

          {data?.items?.map(({ _id, title, price, quantity, photoUrl }) => (
            <AspectRatio key={_id} ratio={271 / 266}>
              <Card radius="lg" p={0} withBorder>
                <AspectRatio ratio={271 / 174} w="100%">
                  <BackgroundImage
                    w="100%"
                    h="100%"
                    src={photoUrl}
                  >
                    <Stack
                      w="100%"
                      h="100%"
                      p="md"
                      align="flex-end"
                      justify="space-between"
                    >
                      <Button
                        bg="white"
                        c="dimmed"
                        w={rem(32)}
                        h={rem(32)}
                        p={rem(6)}
                        style={{ borderRadius: rem(8) }}
                        onClick={() => openDeleteModal(_id)}
                      >
                        <IconTrash style={{ width: '100%', height: '100%' }} />
                      </Button>
                      <Tooltip label={`Quantity: ${quantity}`} color="dark.4" position="left">
                        {quantity !== 0 ? (
                          <Paper
                            bg="#FEF4E6"
                            c="#F79009"
                            fz="sm"
                            fw={500}
                            py={rem(2)}
                            px={rem(12)}
                            radius="md"
                            style={{ cursor: 'default' }}
                          >
                            On sale
                          </Paper>
                        ) : (
                          <Paper
                            bg="#E8F7F0"
                            c="#17B26A"
                            fz="sm"
                            fw={500}
                            py={rem(2)}
                            px={rem(12)}
                            radius="md"
                            style={{ cursor: 'default' }}
                          >
                            Sold
                          </Paper>
                        )}
                      </Tooltip>

                    </Stack>
                  </BackgroundImage>
                </AspectRatio>
                <AspectRatio ratio={271 / 92} w="100%">
                  <Flex w="100%" direction="column" p="md" align="stretch" justify="space-between">
                    <Text fz={rem(20)} lh={rem(24)} fw={700} truncate="end">{title}</Text>

                    <Group justify="space-between" align="center" w="100%">
                      <Text fz={rem(14)} lh={rem(17)} c="dimmed">Price:</Text>
                      <Text fz={rem(20)} lh={rem(24)} fw={700}>
                        <NumberFormatter prefix="$" thousandSeparator value={price} />
                      </Text>
                    </Group>
                  </Flex>
                </AspectRatio>
              </Card>
            </AspectRatio>
          ))}
        </SimpleGrid>
      </Stack>
    </>
  );
};

export default Products;
