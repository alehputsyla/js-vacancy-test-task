import mount from 'koa-mount';
import compose from 'koa-compose';

import { AppKoa } from 'types';

import { accountRoutes } from 'resources/account';
import { userRoutes } from 'resources/user';
import { productRoutes } from 'resources/product';
import { orderRoutes } from 'resources/order';

import auth from './middlewares/auth.middleware';

export default (app: AppKoa) => {
  app.use(mount('/account', compose([auth, accountRoutes.privateRoutes])));
  app.use(mount('/users', compose([auth, userRoutes.privateRoutes])));
  app.use(mount('/product', compose([auth, productRoutes.privateRoutes])));
  app.use(mount('/order', compose([auth, orderRoutes.privateRoutes])));
};
