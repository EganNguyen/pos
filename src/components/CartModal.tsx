import React from "react";

interface CartModalProps {
  cart: any[];
  onClose: () => void;
  onCompleteOrder: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ cart, onClose, onCompleteOrder }) => {

  const getItemTotal = (item: any) => {
    const basePrice = Number(item.price.replace(/\D/g, ""));
    const toppingTotal = item.toppings
      ? item.toppings.reduce((sum: number, t: any) => sum + Number(t.price.replace(/\D/g, "")) * (t.quantity || 0), 0)
      : 0;
      
    return (basePrice + toppingTotal) * (item.quantity || 1);
  };

  const totalPrice = cart.reduce((acc, item) => acc + getItemTotal(item), 0);

  
  return (
    <div className="fixed inset-0 bg-white bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-96 max-h-[80vh] overflow-y-auto relative shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Items in cart</h2>

        {cart.length === 0 ? (
          <p className="text-gray-500">No products in the cart.</p>
        ) : (
          <ul className="space-y-4">
            {cart.map((item, index) => (
              <li key={index} className="flex flex-col gap-2 border-b pb-3">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-500">x {item.quantity || 1}</p>
                    {item.toppings && item.toppings.length > 0 && (
                      <ul className="mt-1 ml-2 text-gray-600 text-sm">
                        {item.toppings.map((t: any) => (
                          <li key={t.id}>{t.name} x {t.quantity}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="text-black font-bold">{getItemTotal(item).toLocaleString()} VND</div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {cart.length > 0 && (
          <div className="mt-6 pt-4 flex flex-col gap-3">
            <div className="flex justify-between text-gray-700 font-medium">
              <span>Total ({cart.reduce((acc, item) => acc + (item.quantity || 1), 0)} Items)</span>
              <span className="text-black font-bold">{totalPrice.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={onClose}>Cancel</button>
              <button className="px-4 py-2 bg-black text-white rounded hover:bg-red-700" onClick={onCompleteOrder}>Complete Order</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
