import { useLocalStorage } from '@mantine/hooks';

import { Product } from 'types';

type CartProduct = Pick<Product, '_id' | 'title' | 'price' | 'quantity' | 'photoUrl'> & {
  quantityCart: number;
};

const useCart = () => {
  const [cartValue, setCartValue, resetCart] = useLocalStorage<CartProduct[]>({
    key: 'cart',
    defaultValue: [],
  });

  const isCartContain = (_id: string) => cartValue && cartValue.some(
    (product) => product._id === _id,
  );

  const removeFromCart = (_id: string) => setCartValue(
    (prev) => prev.filter((product) => product._id !== _id),
  );

  const addToCart = (product: Product) => {
    const inCart = isCartContain(product._id);
    if (!inCart) {
      const { _id: id, title, price, quantity, photoUrl } = product;
      const newProduct: CartProduct = {
        _id: id,
        title,
        price,
        quantity,
        photoUrl,
        quantityCart: 1,
      };
      setCartValue((prev) => (prev ? [...prev, newProduct] : [newProduct]));
    }
  };

  const updateInCartQuantity = (_id: string, newQuantity: number) => {
    const calculateQuantity = (maxValue: number, newValue: number) => {
      if (newValue <= 0) {
        return 1;
      } if (newValue > maxValue) {
        return maxValue;
      }
      return newValue;
    };

    setCartValue((prev) => prev.map((product) => (product._id === _id
      ? {
        ...product,
        quantityCart: calculateQuantity(product.quantity, newQuantity),
      }
      : product)));
  };

  return { cartValue, addToCart, isCartContain, removeFromCart, updateInCartQuantity, resetCart };
};

export default useCart;
