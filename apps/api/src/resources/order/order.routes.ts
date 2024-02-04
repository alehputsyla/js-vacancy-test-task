import { routeUtil } from 'utils';

import create from './actions/create';
import webhook from './actions/webhook';
import listPersonal from './actions/list-personal';
import expire from './actions/expire';
import remove from './actions/remove';
import retry from './actions/retry';

const publicRoutes = routeUtil.getRoutes([
  webhook,
]);

const privateRoutes = routeUtil.getRoutes([
  create,
  listPersonal,
  expire,
  remove,
  retry,
]);

const adminRoutes = routeUtil.getRoutes([

]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
