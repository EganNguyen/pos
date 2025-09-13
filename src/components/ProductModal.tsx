import React, { useState } from "react";

interface Topping {
  id: string;
  name: string;
  price: number;
  selected?: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  toppings?: Topping[];
}

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (item: Product & { quantity: number; toppings?: Topping[] }) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [toppings, setToppings] = useState<Topping[]>(product.toppings || []);

  const handleAddToCart = () => {
    const selectedToppings = toppings.filter(t => t.selected);
    onAddToCart({
      ...product,
      quantity,
      toppings: selectedToppings,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 max-h-[80vh] overflow-y-auto shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{product.name}</h2>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-lg" />
            <p className="text-gray-700 font-semibold">{product.price}</p>
          </div>

          {toppings.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Toppings</h3>
              {toppings.map((t) => (
                <div key={t.id} className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={t.selected || false}
                    onChange={() =>
                      setToppings(toppings.map(tt => tt.id === t.id ? { ...tt, selected: !tt.selected } : tt))
                    }
                  />
                  <span>{t.name} (+{t.price})</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 mt-4">
            <button className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <span className="font-semibold">{quantity}</span>
            <button className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={onClose}>Cancel</button>
            <button className="px-4 py-2 bg-black text-white rounded hover:bg-red-700" onClick={handleAddToCart}>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};
