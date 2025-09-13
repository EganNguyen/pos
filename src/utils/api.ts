// Categories
export const categories = ["Noodles", "Rice", "Side Dish", "Specialty", "Drink"];

// Hardcoded products grouped by category
export const productsByCategory: Record<string, any[]> = {
  Noodles: [
    { id: "noodles-1", image: "/ramen.jpg", name: "Classic Ramen", price: "70,000 VND" },
    { id: "noodles-2", image: "/spicy-ramen.jpg", name: "Spicy Ramen", price: "80,000 VND" },
  ],
  Rice: [
    { id: "rice-1", image: "/fried-rice.jpg", name: "Fried Rice", price: "60,000 VND" },
    { id: "rice-2", image: "/egg-rice.jpg", name: "Egg Rice", price: "55,000 VND" },
  ],
  "Side Dish": [
    { id: "side-1", image: "/tempura.jpg", name: "Tempura", price: "20,000 VND" },
    { id: "side-2", image: "/tonkatsu.jpg", name: "Tonkatsu", price: "35,000 VND" },
  ],
  Specialty: [
    { id: "Specialty-1", image: "/ramen.jpg", name: "Special Ramen", price: "100,000 VND" },
  ],
  Drink: [
    { id: "drink-1", image: "/coca.jpg", name: "Coca Cola", price: "20,000 VND" },
    { id: "drink-2", image: "/matcha.jpg", name: "Green Tea", price: "30,000 VND" },
  ],
};

// Fake API to fetch products
export const fetchProductsByCategory = (category: string) => {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => resolve(productsByCategory[category] || []), 300);
  });
};

// Fake API to fetch toppings for products
export const fetchToppingsByProduct = (_productId: string) => {
  return new Promise<any[]>((resolve) => {
    const toppings = [
      { id: "1", name: "Noodles", price: "5,000 VND", quantity: 0 },
      { id: "2", name: "Seaweed", price: "5,000 VND", quantity: 0 },
      { id: "3", name: "Pork", price: "15,000 VND", quantity: 0 },
      { id: "4", name: "Egg", price: "5,000 VND", quantity: 0 },
    ];
    resolve(toppings);
  });
};

export const fetchToppingsForRice = (_productId: string) => {
  return new Promise<any[]>((resolve) => {
    const toppings = [{ id: "1", name: "Rice", price: "5,000 VND", quantity: 0 }];
    resolve(toppings);
  });
};
