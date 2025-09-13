import { useState } from "react";

export const useCart = () => {
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.id === product.id && (!item.toppings || item.toppings.length === 0)
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].quantity = (updated[existingIndex].quantity || 1) + 1;
        return updated;
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const addToCartWithToppings = (product: any, toppings: any[]) => {
    const selectedToppings = toppings.filter(t => t.quantity > 0).map(t => ({ ...t }));

    const normalize = (toppings: any[]) =>
      (toppings || []).map(t => ({ id: t.id, quantity: t.quantity || 0 })).sort((a, b) => a.id.localeCompare(b.id));

    setCart(prev => {
      const existingIndex = prev.findIndex(
        item =>
          item.id === product.id &&
          JSON.stringify(normalize(item.toppings)) === JSON.stringify(normalize(selectedToppings))
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex].quantity = (updated[existingIndex].quantity || 1) + 1;
        return updated;
      }

      return [...prev, { ...product, quantity: 1, toppings: selectedToppings }];
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, idx) => idx !== index));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const totalPrice = cart.reduce((acc, item) => {
    const numericPrice = Number(item.price.toString().replace(/\D/g, ""));
    const toppingTotal = item.toppings
      ? item.toppings.reduce((sum: number, t: any) => sum + Number(t.price.toString().replace(/\D/g, "")) * (t.quantity || 0), 0)
      : 0;
    return acc + numericPrice * (item.quantity || 1) + toppingTotal;
  }, 0);

  return {
    cart,
    addToCart,
    addToCartWithToppings,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
    setCart,
  };
};
