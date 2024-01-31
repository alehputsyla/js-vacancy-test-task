import { useLocalStorage } from '@mantine/hooks';

import { Product } from 'types';

type CartProduct = Pick<Product, '_id' | 'title' | 'price' | 'quantity' | 'photoUrl'> & {
  quantityCart: number;
};

const useCart = () => {
  const [cartValue, setCartValue] = useLocalStorage<CartProduct[]>({
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
      const newProduct: CartProduct = {
        _id: product._id,
        title: product.title,
        price: product.price,
        quantity: product.quantity,
        photoUrl: product.photoUrl,
        quantityCart: 1,
      };
      setCartValue((prev) => [...prev, newProduct]);
    }
  };

  const updateInCartQuantity = (_id: string, newQuantity: number) => {
    setCartValue((prev) => prev.map((product) => (product._id === _id
      ? {
        ...product,
        quantityCart: newQuantity <= product.quantity ? newQuantity : product.quantityCart,
      }
      : product)));
  };

  return { cartValue, addToCart, isCartContain, removeFromCart, updateInCartQuantity };
};

export default useCart;
