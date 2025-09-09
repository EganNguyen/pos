import { useEffect, useState } from "react";
import "./App.css";

// Fetch kitchen data from Supabase Edge Function
const fetchKitchenData = async () => {
  try {
    const response = await fetch(
      "https://gsymrhydnwutflpnzkid.supabase.co/functions/v1/load-ordering",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching kitchen data: ${response.status}`);
    }

    const data = await response.json();

    // Normalize toppings (parse string into array)
    const normalizedProducts = data.products.map((p: any) => ({
      ...p,
      toppings: typeof p.toppings === "string" ? JSON.parse(p.toppings) : p.toppings,
    }));

    return { tables: data.tables, products: normalizedProducts };

  } catch (err) {
    console.error(err);
    return { tables: [], products: [] }; // fallback
  }
};


function Kitchen() {
  const [tables, setTables] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKitchenData().then((data) => {
      setTables(data.tables);
      setProducts(data.products);
      setLoading(false);
    });
  }, []);

const handleStatusChange = async (productId: number) => {
  try {
    const response = await fetch(
      "https://gsymrhydnwutflpnzkid.supabase.co/functions/v1/complete-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_id: productId }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      // ✅ update local state
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === productId ? { ...p, status: "Completed" } : p
        )
      );
    } else {
      console.error("API error:", result.message);
    }
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Kitchen Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tables.map((table) => (
          <div
            key={table.id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col"
          >
            <h2 className="text-xl font-semibold mb-3">{table.name}</h2>

            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Product</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Toppings</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products
                  .filter((p) => p.table === table.id) // ✅ changed from tableId → table
                  .map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-2 text-gray-700">{product.name}</td>
                      <td className="px-4 py-2 text-gray-700">
                        {Array.isArray(product.toppings) && product.toppings.length > 0
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
                        className={`px-4 py-2 font-semibold ${product.status === "Cooking"
                            ? "text-green-600"
                            : product.status === "Completed"
                              ? "text-gray-400"
                              : "text-yellow-600"
                          }`}
                      >
                        {product.status}
                      </td>
                      <td className="px-4 py-2">
                        {product.status !== "Completed" && (
                          <button
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={() => handleStatusChange(product.id)}
                          >
                            Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Kitchen;
