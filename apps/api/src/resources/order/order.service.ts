import { Order } from 'types';
import { orderSchema } from 'schemas';
import { DATABASE_DOCUMENTS } from 'app-constants';

import db from 'db';

const service = db.createService<Order>(DATABASE_DOCUMENTS.ORDERS, {
  schemaValidator: (obj) => orderSchema.parseAsync(obj),
});

export default Object.assign(service, {

});
