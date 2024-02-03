import { routeUtil } from 'utils';

import create from './actions/create';
import webhook from './actions/webhook';
import listPersonal from './actions/list-personal';

const publicRoutes = routeUtil.getRoutes([
  webhook,
]);

const privateRoutes = routeUtil.getRoutes([
  create,
  listPersonal,
]);

const adminRoutes = routeUtil.getRoutes([

]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
