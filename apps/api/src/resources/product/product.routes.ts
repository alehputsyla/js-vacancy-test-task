import { routeUtil } from 'utils';

import create from './actions/create';
import remove from './actions/remove';
import listPersonal from './actions/list-personal';
import list from './actions/list';

const publicRoutes = routeUtil.getRoutes([

]);

const privateRoutes = routeUtil.getRoutes([
  create,
  remove,
  listPersonal,
  list,
]);

const adminRoutes = routeUtil.getRoutes([
  list,
]);

export default {
  publicRoutes,
  privateRoutes,
  adminRoutes,
};
