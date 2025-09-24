import { useEffect, useState } from "react";

interface Topping {
  id: string;
  name: string;
  price: string;
  quantity: number;
}

interface Item {
  id: string;
  image: string;
  name: string;
  description: string;
  price: string;
  quantity: number;
  toppings: Topping[];
}

interface Order {
  items: Item[];
  total: number;
  createdAt: string;
}

export default function PastOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const stored: Order[] = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(stored)
  }, []);

  if (orders.length === 0) return <p>Chưa có đơn hàng nào.</p>;

  return (
    <div className="space-y-6">
      {orders
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((order, index) => (
          <div
            key={index}
            className="rounded-2xl border p-4 shadow-md bg-white"
          >
            <p className="text-sm text-gray-500">
              Đặt lúc {new Date(order.createdAt).toLocaleString()}
            </p>

            <div className="mt-3 space-y-3">
              {order.items.map((item) => {
                const itemPrice = parseInt(item.price.replace(/,/g, ""), 10);
                const toppingsTotal = item.toppings.reduce(
                  (acc, top) => acc + parseInt(top.price.replace(/,/g, ""), 10) * top.quantity,
                  0
                );
                return (
                  <div key={item.id} className="flex flex-col border-b pb-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          x{item.quantity} — {(itemPrice + toppingsTotal).toLocaleString()}₫
                        </p>
                      </div>
                    </div>
                    {item.toppings.length > 0 && (
                      <div className="ml-20 mt-1 space-y-1 text-sm text-gray-500">
                        {item.toppings.map((top) => (
                          <p key={top.id}>
                            {top.name} x{top.quantity} — {parseInt(top.price.replace(/,/g, ""), 10).toLocaleString()}₫
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="mt-3 font-bold">
              Tổng cộng: {order.total.toLocaleString()}₫
            </p>
          </div>
        ))}
    </div>
  );
}
