import { useEffect, useState } from "react";
import "./App.css";

// Fake API function for a Ramen restaurant with 9 tables
const fetchKitchenData = () => {
  return new Promise((resolve) => {
    resolve({
      tables: [
        { id: 1, name: "Table 1" },
        { id: 2, name: "Table 2" },
        { id: 3, name: "Table 3" },
        { id: 4, name: "Table 4" },
        { id: 5, name: "Table 5" },
        { id: 6, name: "Table 6" },
        { id: 7, name: "Table 7" },
        { id: 8, name: "Table 8" },
        { id: 9, name: "Table 9" },
        { id: 10, name: "Take away 1" },
        { id: 11, name: "Take away 2" },
      ],
      products: [
        { id: 1, name: "Shoyu Ramen", tableId: 1, status: "Cooking", toppings: ["Nori", "Chashu", "Scallions"] },
        { id: 2, name: "Miso Ramen", tableId: 1, status: "Cooking", toppings: ["Corn", "Butter", "Bean Sprouts"] },
        { id: 3, name: "Spicy Ramen", tableId: 2, status: "Cooking", toppings: ["Chili Oil", "Chashu", "Soft Boiled Egg"] },
        { id: 4, name: "Tonkotsu Ramen", tableId: 3, status: "Cooking", toppings: ["Chashu", "Nori", "Mushrooms"] },
        { id: 5, name: "Gyoza", tableId: 2, status: "Cooking", toppings: [] },
        { id: 6, name: "Karaage", tableId: 4, status: "Cooking", toppings: [] },
        { id: 7, name: "Green Tea", tableId: 5, status: "Ready", toppings: [] },
        { id: 8, name: "Chashu Don", tableId: 6, status: "Cooking", toppings: ["Chashu", "Scallions"] },
        { id: 9, name: "Shio Ramen", tableId: 7, status: "Cooking", toppings: ["Nori", "Soft Boiled Egg", "Spinach"] },
        { id: 10, name: "Soft Drink", tableId: 8, status: "Ready", toppings: [] },
        { id: 11, name: "Miso Ramen", tableId: 9, status: "Cooking", toppings: ["Corn", "Butter", "Bean Sprouts"] },
        { id: 12, name: "Karaage", tableId: 9, status: "Cooking", toppings: [] },
        { id: 13, name: "Miso Ramen", tableId: 10, status: "Cooking", toppings: ["Corn", "Butter", "Bean Sprouts"] },
        { id: 14, name: "Miso Ramen", tableId: 11, status: "Cooking", toppings: ["Corn", "Butter", "Bean Sprouts"] },
      ],
    });
  });
};


function Kitchen() {
  const [tables, setTables] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKitchenData().then((data) => {
      setTables(data.tables);
      setProducts(data.products);
      setLoading(false);
    });
  }, []);

  const handleStatusChange = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === productId ? { ...p, status: "Completed" } : p
      )
    );
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
                  .filter((p) => p.tableId === table.id)
                  .map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-2 text-gray-700">{product.name}</td>
                      <td className="px-4 py-2 text-gray-700">{product.toppings.join(", ") || "-"}</td>
                      <td
                        className={`px-4 py-2 font-semibold ${
                          product.status === "Cooking"
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
