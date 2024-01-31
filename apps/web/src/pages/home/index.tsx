import React, { useCallback, useLayoutEffect, useState } from 'react';

import { NextPage } from 'next';
import Head from 'next/head';

import {
  TextInput,
  Group,
  Stack,
  Text,
  Image,
  SimpleGrid,
  rem,
  Card,
  Button,
  Pagination,
  Center,
  NumberFormatter,
  Paper,
  NumberInput,
  UnstyledButton,
  Grid,
  Skeleton,
  Container,
  CloseButton,
} from '@mantine/core';
import { useDebouncedValue, useInputState } from '@mantine/hooks';

import { IconArrowsDownUp, IconChevronDown, IconSearch, IconX } from '@tabler/icons-react';

import { productApi } from 'resources/product';

import { useCart } from 'hooks';

import { PER_PAGE } from './constants';

interface ProductsListParams {
  page?: number;
  perPage?: number;
  searchValue?: string;
  sort?: {
    createdOn: 'asc' | 'desc';
  };
  filter?: {
    price?: {
      min: number;
      max: number;
    };
  };
}

type FilterPrice = {
  min?: number,
  max?: number,
};

type SortBy = 'newest' | 'oldest';

const Home: NextPage = () => {
  const [search, setSearch] = useInputState('');

  const [sortBy, setSortBy] = useState<SortBy>('newest');

  const [filterPrice, setFilterPrice] = useState<FilterPrice>({});
  const [filterPriceError, setFilterPriceError] = useState(false);

  const [filter, setFilter] = useState<ProductsListParams['filter']>({});

  const [params, setParams] = useState<ProductsListParams>({});

  const [debouncedSearch] = useDebouncedValue(search, 1000);
  const [debouncedFilter] = useDebouncedValue(filter, 1000);

  const handleResetAllFilters = useCallback(() => {
    setFilterPrice({});
    setFilter({});
    setParams((prev) => ({
      ...prev,
      filter: {},
    }));
  }, []);

  const handleSort = useCallback((value: SortBy) => {
    setSortBy(value);
    setParams((prev) => ({
      ...prev,
      sort: value === 'newest' ? { createdOn: 'desc' } : { createdOn: 'asc' },
    }));
  }, []);

  const handleFilterPrice = useCallback(({ min, max }: FilterPrice) => {
    setFilterPrice({ min, max });

    if (min && max) {
      if (min < max) {
        setFilter({ price: { min, max } });
        setFilterPriceError(false);
      } else {
        setFilter({});
        setFilterPriceError(true);
      }
    } else {
      setFilter({});
      setFilterPriceError(false);
    }
  }, [setFilterPriceError]);

  useLayoutEffect(() => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      searchValue: debouncedSearch,
      perPage: PER_PAGE,
      filter: debouncedFilter,
    }));
  }, [debouncedSearch, debouncedFilter]);

  const { data, isLoading: isListLoading } = productApi.useList(params);

  const { addToCart, isCartContain } = useCart();

  let products: JSX.Element;

  if (data?.marketplaceCount === 0) {
    products = (
      <Center>
        <Container p={75}>
          <Text size="xl" c="gray">
            Marketplace is empty!
          </Text>
        </Container>
      </Center>
    );
  } else if (data?.items.length) {
    products = (
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 2, xl: 3 }}>
        {data.items.map((product) => (
          <Card key={product._id} padding="md" radius="lg" withBorder>
            <Card.Section>
              <Image
                src={product.photoUrl}
                height={218}
                alt={product.title}
              />
            </Card.Section>

            <Text fz="xl" fw={700} mt="md" truncate="end">{product.title}</Text>

            <Group justify="space-between" align="center" mt="md">
              <Text fz="md" c="dimmed">Price:</Text>
              <Text fz="xl" fw={700}>
                <NumberFormatter prefix="$" thousandSeparator value={product.price} />
              </Text>
            </Group>

            <Button
              color="blue"
              fullWidth
              mt="lg"
              radius="md"
              onClick={() => addToCart(product)}
              disabled={isCartContain(product._id)}
            >
              {isCartContain(product._id) ? 'In cart' : 'Add to cart'}
            </Button>
          </Card>
        ))}
      </SimpleGrid>
    );
  } else {
    products = (
      <Container p={75}>
        <Text size="xl" c="gray">
          No results found, try to adjust your search or filters.
        </Text>
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>Marketplace</title>
      </Head>

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, lg: 4, xl: 3 }}>
          <Paper p="lg" radius="lg" withBorder>
            <Stack gap="lg">
              <Group justify="space-between">
                <Text fz="xl" fw={700}>Filters</Text>
                <Button variant="shell" p={0} onClick={() => handleResetAllFilters()} disabled={data?.marketplaceCount === 0}>
                  <Text fz="sm" pr={rem(4)}>Reset All</Text>
                  <IconX size={16} />
                </Button>
              </Group>
              <Stack gap="xs">
                <Text fz="md" fw={700}>Price</Text>
                <SimpleGrid cols={2}>
                  <NumberInput
                    leftSectionPointerEvents="none"
                    leftSection={<Text fw={500} fz="sm">From: </Text>}
                    leftSectionWidth={rem(54)}
                    suffix="$"
                    allowNegative={false}
                    hideControls
                    fw={500}
                    fz="sm"
                    radius="md"
                    thousandSeparator=" "
                    value={`${filterPrice.min}`}
                    onChange={(value) => handleFilterPrice({ max: filterPrice.max, min: +value })}
                    error={filterPriceError}
                    disabled={data?.marketplaceCount === 0}
                  />
                  <NumberInput
                    leftSectionPointerEvents="none"
                    leftSection={<Text fw={500} fz="sm">To: </Text>}
                    leftSectionWidth={rem(36)}
                    suffix="$"
                    allowNegative={false}
                    hideControls
                    fw={500}
                    radius="md"
                    thousandSeparator=" "
                    value={`${filterPrice.max}`}
                    onChange={(value) => handleFilterPrice({ min: filterPrice.min, max: +value })}
                    error={filterPriceError}
                    disabled={data?.marketplaceCount === 0}
                  />
                </SimpleGrid>
              </Stack>
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 8, xl: 9 }}>
          <Stack gap="lg">
            <TextInput
              leftSection={<IconSearch size={16} />}
              leftSectionPointerEvents="none"
              placeholder="Type to search..."
              radius="md"
              value={search}
              onChange={setSearch}
              rightSection={search ? (
                <UnstyledButton
                  display="flex"
                  onClick={() => setSearch('')}
                >
                  <IconX color="gray" />
                </UnstyledButton>
              ) : null}
              disabled={data?.marketplaceCount === 0}
            />

            <Stack>
              <Group justify="space-between">
                {data && <Text fw={700}>{`${data.count} results`}</Text>}

                <Button
                  variant="shell"
                  display="flex"
                  style={{ alignItems: 'center' }}
                  c="dimmed"
                  onClick={() => handleSort(sortBy === 'newest' ? 'oldest' : 'newest')}
                  disabled={data?.marketplaceCount === 0}
                >
                  <IconArrowsDownUp style={{ width: rem(20), height: rem(20) }} />
                  <Text c="black" fw={500} mx={rem(4)}>{`Sort by ${sortBy}`}</Text>
                  <IconChevronDown style={{ width: rem(16), height: rem(16) }} />
                </Button>
              </Group>

              <Group>
                {filterPrice.min && filterPrice.max && !filterPriceError && (
                <Paper component={Group} pl={rem(20)} py={rem(10)} pr={rem(17)} radius="xl" withBorder fz="sm" gap={rem(8)} lh={rem(1)}>
                  <Group gap={0}>
                    <NumberFormatter value={filterPrice.min} prefix="$" />
                    -
                    <NumberFormatter value={filterPrice.max} prefix="$" />
                  </Group>
                  <CloseButton bg="dark.3" c="white" radius="xl" size="xs" onClick={() => handleResetAllFilters()} />
                </Paper>
                )}
              </Group>
            </Stack>

            {products}

            {isListLoading
                && (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 2, xl: 3 }}>
                  {[1, 2, 3, 4, 5, 6].map((key) => (
                    <Card key={key} padding="md" radius="lg" withBorder>
                      <Card.Section>
                        <Skeleton height={218} />
                      </Card.Section>

                      <Skeleton height={rem(27)} radius="md" mt="md" />

                      <Group justify="space-between" align="center" mt="md">
                        <Skeleton height={rem(24)} width={rem(64)} radius="md" mt="md" />
                        <Skeleton height={rem(24)} width={rem(64)} radius="md" mt="md" />
                      </Group>

                      <Skeleton height={rem(40)} radius="md" mt="md" />
                    </Card>
                  ))}
                </SimpleGrid>
                )}

          </Stack>
        </Grid.Col>

        <Grid.Col span={12}>
          <Center>
            {data && data.count > PER_PAGE && (
            <Pagination
              value={params.page}
              total={data.totalPages}
              onChange={(targetPage) => setParams((prev) => ({ ...prev, page: targetPage }))}
            />
            )}
          </Center>
        </Grid.Col>
      </Grid>

      <Group grow preventGrowOverflow={false} gap="xl" align="flex-start" />
    </>
  );
};

export default Home;
