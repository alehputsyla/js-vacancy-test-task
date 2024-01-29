import { routeUtil } from 'utils';

import create from './actions/create';
import remove from './actions/remove';
import listPersonal from './actions/list-personal';

const publicRoutes = routeUtil.getRoutes([

]);

const privateRoutes = routeUtil.getRoutes([
  create,
  remove,
  listPersonal,
]);

const adminRoutes = routeUtil.getRoutes([

]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
