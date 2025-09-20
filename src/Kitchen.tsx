// "Create a React component for a restaurant kitchen dashboard with the following features:
// Fetch initial tables and orders from a backend (e.g., Supabase).
// Display all active tables in a responsive grid layout. Highlight takeaway tables.
// Show a list of orders per table, including product name, quantity, toppings, and status.
// Allow updating the status of individual orders (e.g., Pending → Completed).
// Enable moving all orders from one table to another via a dropdown and button.
// Enable processing payment for a table once all orders are completed.
// Support realtime updates via Supabase Realtime or WebSocket so the UI updates automatically when orders are added, updated, or paid.
// Use Tailwind CSS for styling with a clean, responsive design.
// Normalize data as needed (e.g., toppings as an array).
// Allow cancel the order that is in Pending status, request api cancel-order. - to do
// Enable choosing payment method (cash, tranfer) when processing payment. - to do

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./App.css";

// Supabase client
const SUPABASE_URL = "https://gsymrhydnwutflpnzkid.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzeW1yaHlkbnd1dGZscG56a2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczOTE0MjQsImV4cCI6MjA3Mjk2NzQyNH0.IfkiaSSKmtcx0_42Vt_EI8M2_5eQG3rnpumVyO4qZEE";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Hard-coded table list
const HARD_CODED_TABLES = [
  "Bàn 1A",
  "Bàn 1B",
  "Bàn 2A",
  "Bàn 2B",
  "Bàn 3A",
  "Bàn 3B",
  "Bàn 4",
  "Bàn 5",
  "Bàn 6",
  "Bàn 7",
  "Bàn 8",
  "Bàn 9",
  "Mang về 1",
  "Mang về 2",
];


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

  const [processingOrders, setProcessingOrders] = useState<Set<number>>(new Set());

const playNotificationSound = () => {
  const audio = new Audio("/ding.mp3"); // put ding.mp3 inside /public
  audio.play().catch((err) => {
    console.warn("Sound blocked until user interacts:", err);
  });
};

useEffect(() => {
  const unlockAudio = () => {
    const a = new Audio("/ding.mp3");
    a.play().catch(() => {});
    document.removeEventListener("click", unlockAudio);
  };
  document.addEventListener("click", unlockAudio);
}, []);




  const navigate = useNavigate();
  const [tables, setTables] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTables, setSelectedTables] = useState<Record<string, string>>({});

  useEffect(() => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const admin = localStorage.getItem("admin");
    const adminpassword = localStorage.getItem("adminpassword");

    if (!(
      (username === 'nhanvien' && password === 'mamaramen321') ||
      (admin === 'admin' && adminpassword === 'reportforadmin321')
    )) {
      navigate("/login", { replace: true });
    }

  }, [navigate]);



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

  // 🔹 Update table function (multiple orders at once)
  const handleUpdateTable = async (tableId: number, newTableName: string) => {
    try {
      // Get all order IDs from this table
      const orderIds = products
        .filter((p) => p.table === tableId)
        .map((p) => p.id);

      if (orderIds.length === 0) return;

      const response = await fetch(`${SUPABASE_URL}/functions/v1/update-table`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_ids: orderIds, table: newTableName }), // ✅ send array + new table
      });

      if (!response.ok) throw new Error(`Failed to update table`);

      const result = await response.json();
      if (!result.success) {
        console.error("API error:", result.message);
      } else {
        console.log(`Orders [${orderIds.join(", ")}] moved to ${newTableName}`);
        // realtime will update UI
      }
    } catch (err) {
      console.error("Error updating table:", err);
    }
  };

  const handleCancelOrder = async (productId: number) => {
    if (processingOrders.has(productId)) return; // tránh double click

    setProcessingOrders((prev) => new Set(prev).add(productId));
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/cancel-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: productId }),
      });

      if (!response.ok) throw new Error(`Failed to cancel order: ${response.status}`);
      const result = await response.json();
      if (!result.success) console.error("Cancel API error:", result.message);
    } catch (err) {
      console.error("Error cancelling order:", err);
    } finally {
      // không cần bỏ khỏi processingOrders vì realtime sẽ xoá order khỏi UI
    }
  };

  // Utility to generate a simple GUID
  const generateGUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(8);
    });
  };



  // Add this function inside the Kitchen component
  const handlePayment = async (tableId: number, method: "cash" | "transfer") => {
    try {
      const orderIds = products
        .filter((p) => p.table === tableId && p.status === "Completed")
        .map((p) => p.id);

      if (orderIds.length === 0) return;

      // Create unique payload for each order: tableId + GUID
      const unique = `${tableId}-${generateGUID()}`;

      const response = await fetch(`${SUPABASE_URL}/functions/v1/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_ids: orderIds, method, unique }), // unique id for each payment
      });

      if (!response.ok) throw new Error(`Payment API failed: ${response.status}`);

      const result = await response.json();
      if (!result.success) console.error("Payment API error:", result.message);
      else console.log(`Payment successful for table ${tableId} via ${method}`);

      // ✅ Clear selected payment method for this table
      setSelectedTables((prev) => {
        const updated = { ...prev };
        delete updated[`payment-${tableId}`];
        return updated;
      });

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
            playNotificationSound();
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
              id: Number(raw.id),
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
              let updatedProducts: Order[];

              if (updatedOrder.status === "Paid") {
                // remove the paid order
                updatedProducts = prev.filter((p) => p.id !== updatedOrder.id);
              } else if (updatedOrder.status === "Cancelled") {
                // remove cancelled order from the UI immediately
                updatedProducts = prev.filter((p) => p.id !== updatedOrder.id);
              } else {
                // update existing order
                updatedProducts = prev.map((p) =>
                  p.id === updatedOrder.id ? updatedOrder : p
                );
              }


              // ✅ Recalculate tables based on updated products
              setTables(() => {
                const tableMap = new Map<number, string>();

                updatedProducts.forEach((p) => {
                  if (!tableMap.has(p.table)) {
                    tableMap.set(p.table, `${p.table}`);
                  }
                });

                return Array.from(tableMap.entries()).map(([id, name]) => ({ id, name }));
              });

              return updatedProducts;
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
    if (processingOrders.has(productId)) return;

    setProcessingOrders((prev) => new Set(prev).add(productId));
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/complete-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: productId }),
      });

      if (!response.ok) throw new Error(`Failed to update status: ${response.status}`);
      const result = await response.json();
      if (!result.success) console.error("API error:", result.message);
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
        Những Bàn đang có đơn
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => {
          // Determine if table is a takeaway table
          return (
            <div
              key={table.id}
              className={`shadow-md rounded-lg p-4 flex flex-col ${table.id.includes("Mang về")
                ? "bg-yellow-100 border-2 border-yellow-400"
                : "bg-white"
                }`}
            >
              {/* ✅ Update Table section should be here (ONCE per table) */}
              <div className="mb-4 p-3 bg-white rounded shadow flex items-center justify-between">
                {/* Left side: table info */}
                <h2 className="font-medium">{table.id}</h2>

                {/* Right side: dropdown + button */}
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedTables[table.id] || ""}
                    onChange={(e) =>
                      setSelectedTables((prev) => ({
                        ...prev,
                        [table.id]: e.target.value,
                      }))
                    }
                    className="border rounded p-1"
                  >
                    <option value="">--Chọn Bàn--</option>
                    {HARD_CODED_TABLES.map((t, i) => (
                      <option key={i} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>

                  <button
                    className="bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"
                    onClick={() =>
                      handleUpdateTable(table.id, selectedTables[table.id] || "")
                    }
                    disabled={!selectedTables[table.id]}
                  >
                    Cập nhật Bàn
                  </button>

                </div>
              </div>

              {/* ✅ Products list table */}
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left text-xs md:text-sm font-medium text-gray-500">
                        Món ăn
                      </th>
                      <th className="px-2 py-1 text-left text-xs md:text-sm font-medium text-gray-500">
                        Topping
                      </th>
                      <th className="px-2 py-1 text-left text-xs md:text-sm font-medium text-gray-500">
                        Trạng thái
                      </th>
                      <th className="px-2 py-1 text-left text-xs md:text-sm font-medium text-gray-500">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products
                      .filter((p) => p.table === table.id)
                      .map((product) => (
                        <tr key={product.id}>
                          <td className="px-2 py-1 text-gray-800 font-bold text-sm md:text-base">
                            {product.name}{" "}
                            {product.quantity > 1 && (
                              <span className="ml-1 bg-indigo-100 text-indigo-800 text-xs px-1 rounded">
                                x{product.quantity}
                              </span>
                            )}
                          </td>

                          <td className="px-2 py-1 text-gray-700 text-sm md:text-base flex flex-wrap gap-1">
                            {Array.isArray(product.toppings) && product.toppings.length > 0
                              ? product.toppings.map((t: any, i: number) => (
                                <span
                                  key={i}
                                  className="bg-yellow-100 text-yellow-800 text-xs md:text-sm px-2 py-0.5 rounded-full"
                                >
                                  {typeof t === "string" ? t : `${t.name} (x${t.quantity || 1})`}
                                </span>
                              ))
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
  <div className="flex space-x-1">
    <button
      className={`px-2 py-1 text-xs md:text-sm rounded text-white ${
        processingOrders.has(product.id)
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-red-600 hover:bg-red-700"
      }`}
      onClick={() => handleCancelOrder(product.id)}
      disabled={processingOrders.has(product.id)}
    >
      Hủy
    </button>
    <button
      className={`px-2 py-1 text-xs md:text-sm rounded text-white ${
        processingOrders.has(product.id)
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      }`}
      onClick={() => handleStatusChange(product.id)}
      disabled={processingOrders.has(product.id)}
    >
      Hoàn tất
    </button>
  </div>
)}



                            {product.status === "Completed" && (
                              <button
                                className="px-2 py-1 text-xs md:text-sm bg-gray-400 text-white rounded cursor-not-allowed"
                                disabled
                              >
                                Đã hoàn tất
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* ✅ Payment button for table */}
              {/* ✅ Total price for the table */}
              {products.filter((p) => p.table === table.id).length > 0 && (
                <div className="mb-2 font-semibold text-gray-700">
                  Tổng cộng:{" "}
                  {products
                    .filter((p) => p.table === table.id)
                    .reduce((sum, p) => sum + p.price * p.quantity, 0)
                    .toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                </div>
              )}

              {products.filter((p) => p.table === table.id).length > 0 &&
                products.filter((p) => p.table === table.id).every((p) => p.status != "Pending") && (

                  <div className="mt-2 flex space-x-2">
                    <select
                      value={selectedTables[`payment-${table.id}`] || ""}
                      onChange={(e) =>
                        setSelectedTables((prev) => ({
                          ...prev,
                          [`payment-${table.id}`]: e.target.value,
                        }))
                      }
                      className="border rounded p-1"
                    >
                      <option value="">--Chọn phương thức--</option>
                      <option value="cash">Tiền mặt</option>
                      <option value="transfer">Chuyển khoản</option>
                    </select>


                    <button
                      className={`py-2 px-4 rounded text-white ${selectedTables[`payment-${table.id}`]?.trim()
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400 cursor-not-allowed"
                        }`}
                      disabled={!selectedTables[`payment-${table.id}`]?.trim()}
                      onClick={() =>
                        handlePayment(table.id, selectedTables[`payment-${table.id}`] as "cash" | "transfer")
                      }
                    >
                      Thanh Toán
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
