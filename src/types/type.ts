export interface Topping {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  price: string;
}

export interface CartItem extends Product {
  quantity: number;
  toppings?: Topping[];
}
