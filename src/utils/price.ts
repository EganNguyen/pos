// Convert "70,000 VND" or "70000" to number
export const parsePrice = (price: string | number): number => {
  if (typeof price === "number") return price;
  const numeric = Number(price.toString().replace(/\D/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
};

// Format number to "70,000 VND"
export const formatPrice = (amount: number): string => {
  return `${amount.toLocaleString()} VND`;
};

// Calculate total price for a product line including toppings
export const calculateLineTotal = (item: any) => {
  const basePrice = parsePrice(item.price);
  const toppingsTotal = item.toppings
    ? item.toppings.reduce((sum: number, t: any) => sum + parsePrice(t.price) * (t.quantity || 0), 0)
    : 0;
  return (basePrice + toppingsTotal) * (item.quantity || 1);
};
