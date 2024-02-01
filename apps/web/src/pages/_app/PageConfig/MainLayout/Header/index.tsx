import { memo, FC } from 'react';
import NextLink from 'next/link';

import { AppShellHeader as LayoutHeader, Container, rem } from '@mantine/core';

import { accountApi } from 'resources/account';

import { RoutePath } from 'routes';

import { LogoImage } from 'public/images';

import ShadowLoginBanner from './components/ShadowLoginBanner';
import TopBar from './components/TopBar';
import Buttons from './components/Buttons';

import classes from './index.module.css';

const Header: FC = () => {
  const { data: account } = accountApi.useGet();

  if (!account) return null;

  return (
    <LayoutHeader>
      {account.isShadow && <ShadowLoginBanner email={account.email} />}
      <Container
        className={classes.header}
        mih={104}
        py={32}
        px={48}
        display="flex"
        fluid
        pos="relative"
      >
        <NextLink href={RoutePath.Home} style={{ display: 'flex' }}>
          <LogoImage style={{ height: rem(40) }} />
        </NextLink>

        <TopBar />

        <Buttons />
      </Container>
    </LayoutHeader>
  );
};

export default memo(Header);
