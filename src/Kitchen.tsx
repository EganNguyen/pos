import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";

// Supabase client
const SUPABASE_URL = "https://gsymrhydnwutflpnzkid.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzeW1yaHlkbnd1dGZscG56a2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczOTE0MjQsImV4cCI6MjA3Mjk2NzQyNH0.IfkiaSSKmtcx0_42Vt_EI8M2_5eQG3rnpumVyO4qZEE";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch kitchen data (initial load)
const fetchKitchenData = async () => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/load-ordering`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Error fetching kitchen data: ${response.status}`);
    }

    const data = await response.json();

    const normalizedProducts = (data.products || []).map((p: any) => ({
      ...p,
      toppings: p.toppings
        ? typeof p.toppings === "string"
          ? JSON.parse(p.toppings)
          : p.toppings
        : [],
    }));

    return { tables: data.tables || [], products: normalizedProducts };
  } catch (err) {
    console.error(err);
    return { tables: [], products: [] };
  }
};


function Kitchen() {
  const [tables, setTables] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  interface Order {
    id: number;
    name: string;
    price: number;
    quantity: number;
    status: string;
    table: number;
    toppings: any[];
    created_at: string;
  }



  // Add this function inside the Kitchen component
  const handlePayment = async (tableId: number) => {
    try {
      // Get all order IDs for this table
      const orderIds = products
        .filter((p) => p.table === tableId)
        .map((p) => p.id);

      if (orderIds.length === 0) return;

      // Call payment API (replace endpoint with your function URL)
      const response = await fetch(`${SUPABASE_URL}/functions/v1/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_ids: orderIds }), // send as array
      });

      if (!response.ok) {
        throw new Error(`Payment API failed: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        console.error("Payment API error:", result.message);
      } else {
        console.log("Payment successful for table", tableId);
        // Realtime subscription will update local state automatically
      }
    } catch (err) {
      console.error("Error processing payment:", err);
    }
  };

  useEffect(() => {
    // Load initial data
    fetchKitchenData().then((data) => {
      setTables(data.tables);
      setProducts(data.products);
      setLoading(false);
    });

    // ✅ Realtime subscription
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          console.log("Realtime order event:", payload);

          if (payload.eventType === "INSERT") {
            const newOrder: Order = {
              ...(payload.new as Order), // cast payload.new to Order
              toppings: Array.isArray(payload.new.toppings)
                ? payload.new.toppings
                : JSON.parse(payload.new.toppings || "[]"),
            };

            // Add order to products
            setProducts((prev) => [...prev, newOrder]);

            // Add table if not exists
            setTables((prev) => {
              if (!prev.some((t) => t.id === newOrder.table)) {
                return [...prev, { id: newOrder.table, name: `Table ${newOrder.table}` }];
              }
              return prev;
            });
          }
          // Handle UPDATE
          if (payload.eventType === "UPDATE") {
            const raw = payload.new as any;

            const updatedOrder: Order = {
              id: Number(raw.id), // ensure id is number
              name: raw.name,
              price: raw.price,
              quantity: raw.quantity,
              status: raw.status,
              table: raw.table,
              created_at: raw.created_at,
              toppings: Array.isArray(raw.toppings)
                ? raw.toppings
                : raw.toppings
                  ? JSON.parse(raw.toppings)
                  : [],
            };

            setProducts((prev) => {
              if (updatedOrder.status === "Paid") {
                // Remove this order from products
                const remainingProducts = prev.filter(p => p.id !== updatedOrder.id);

                // Remove table if no remaining orders for this table
                const tableHasOrders = remainingProducts.some(p => p.table === updatedOrder.table);
                if (!tableHasOrders) {
                  setTables((prevTables) =>
                    prevTables.filter(t => t.id !== updatedOrder.table)
                  );
                }

                return remainingProducts;
              }

              // Otherwise, update the order normally
              return prev.map((p) =>
                p.id === updatedOrder.id ? updatedOrder : p
              );
            });
          }




        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Handle status change manually
  const handleStatusChange = async (productId: number) => {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/complete-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: productId }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        console.error("API error:", result.message);
      }
      // ✅ Realtime will push update, so no local update needed
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Loading Kitchen...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Kitchen Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => {
          // Determine if table is a takeaway table
          const isTakeaway = table.id === 20 || table.id === 21 || table.id === 22 || table.id === 23;

          const takeawayLabel =
            table.id === 20
              ? "Takeaway 1"
              : table.id === 21
                ? "Takeaway 2"
                : table.id === 22
                  ? "Takeaway 3"
                  : table.id === 23
                    ? "Takeaway 4"
                    : table.name;

          return (
            <div
              key={table.id}
              className={`shadow-md rounded-lg p-4 flex flex-col ${isTakeaway ? "bg-yellow-100 border-2 border-yellow-400" : "bg-white"
                }`}
            >
              <h2 className="text-lg md:text-xl font-semibold mb-3">
                {takeawayLabel}
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left text-xs md:text-sm font-medium text-gray-500">
                        Products
                      </th>
                      <th className="px-2 py-1 text-left text-xs md:text-sm font-medium text-gray-500">
                        Toppings
                      </th>
                      <th className="px-2 py-1 text-left text-xs md:text-sm font-medium text-gray-500">
                        Status
                      </th>
                      <th className="px-2 py-1 text-left text-xs md:text-sm font-medium text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products
                      .filter((p) => p.table === table.id)
                      .map((product) => (
                        <tr key={product.id}>
<td className="px-2 py-1 text-gray-700 text-xs md:text-sm">
  {product.name} {product.quantity > 1 && `(x${product.quantity})`}
</td>

                          <td className="px-2 py-1 text-gray-700 text-xs md:text-sm">
                            {Array.isArray(product.toppings) &&
                              product.toppings.length > 0
                              ? product.toppings
                                .map((t: any) =>
                                  typeof t === "string"
                                    ? t
                                    : `${t.name} (x${t.quantity || 1})`
                                )
                                .join(", ")
                              : "-"}
                          </td>
                          <td
                            className={`px-2 py-1 font-semibold text-xs md:text-sm ${product.status === "Cooking"
                                ? "text-green-600"
                                : product.status === "Completed"
                                  ? "text-gray-400"
                                  : "text-yellow-600"
                              }`}
                          >
                            {product.status}
                          </td>
                          <td className="px-2 py-1 text-xs md:text-sm">
                            {product.status === "Pending" && (
                              <button
                                className="px-2 py-1 text-xs md:text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={() => handleStatusChange(product.id)}
                              >
                                Complete
                              </button>
                            )}

                            {product.status === "Completed" && (
                              <button
                                className="px-2 py-1 text-xs md:text-sm bg-gray-400 text-white rounded cursor-not-allowed"
                                disabled
                              >
                                Completed
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Payment button */}
              {products.filter((p) => p.table === table.id).length > 0 &&
                products
                  .filter((p) => p.table === table.id)
                  .every((p) => p.status === "Completed") && (
                  <div className="mt-4">
                    <button
                      className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={() => handlePayment(table.id)}
                    >
                      Proceed to Payment
                    </button>
                  </div>
                )}
            </div>
          );
        })}

      </div>
    </div>
  );

}

export default Kitchen;
