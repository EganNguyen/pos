import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase client
const SUPABASE_URL = "https://gsymrhydnwutflpnzkid.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // shorten for readability
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch data
const fetchCashierData = async () => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/load-ordering`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok)
      throw new Error(`Error fetching cashier data: ${response.status}`);
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

// Cashier screen
function Cashier() {
  const navigate = useNavigate();
  const [tables, setTables] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTables, setSelectedTables] = useState<
    Record<string, string>
  >({});

  // Auth check
  useEffect(() => {
    const admin = localStorage.getItem("admin");
    const adminpassword = localStorage.getItem("adminpassword");

    if (!(admin === "admin" && adminpassword === "reportforadmin321")) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Utility
  const generateGUID = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(8);
    });

  // Payment
  const handlePayment = async (
    tableId: number,
    method: "cash" | "transfer"
  ) => {
    try {
      const orderIds = products
        .filter((p) => p.table === tableId && p.status === "Completed")
        .map((p) => p.id);

      if (orderIds.length === 0) return;

      const unique = `${tableId}-${generateGUID()}`;
      const response = await fetch(`${SUPABASE_URL}/functions/v1/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_ids: orderIds, method, unique }),
      });

      if (!response.ok) throw new Error(`Payment API failed: ${response.status}`);
      const result = await response.json();

      if (!result.success) console.error("Payment API error:", result.message);
      else console.log(`Payment successful for table ${tableId}`);

      setSelectedTables((prev) => {
        const updated = { ...prev };
        delete updated[`payment-${tableId}`];
        return updated;
      });
    } catch (err) {
      console.error("Error processing payment:", err);
    }
  };

  // Load + realtime subscription
  useEffect(() => {
    // initial fetch
    fetchCashierData().then((data) => {
      setTables(data.tables);
      setProducts(data.products);
      setLoading(false);
    });

    // listen to payment_ready table
    const channel = supabase
      .channel("payment-ready")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "payment_ready" },
        (payload) => {
          console.log("Payment ready event:", payload);

          // reload fresh state after event
          fetchCashierData().then((data) => {
            setTables(data.tables);
            setProducts(data.products);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Loading Cashier...</p>
      </div>
    );
  }

  // ✅ Only show tables where all orders are completed
  const readyTables = tables.filter(
    (table) =>
      products.some((p) => p.table === table.id) &&
      products
        .filter((p) => p.table === table.id)
        .every((p) => p.status === "Completed")
  );

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Thu Ngân - Bàn chờ thanh toán
      </h1>

      {readyTables.length === 0 ? (
        <p className="text-gray-600">
          Không có bàn nào sẵn sàng thanh toán
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {readyTables.map((table) => (
            <div key={table.id} className="shadow-md rounded-lg p-4 bg-white">
              <h2 className="font-semibold mb-2">{table.id}</h2>

              <div className="overflow-x-auto mb-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-left text-xs md:text-sm">
                        Món
                      </th>
                      <th className="px-2 py-1 text-left text-xs md:text-sm">
                        SL
                      </th>
                      <th className="px-2 py-1 text-left text-xs md:text-sm">
                        Giá
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter((p) => p.table === table.id)
                      .map((p) => (
                        <tr key={p.id}>
                          <td className="px-2 py-1">{p.name}</td>
                          <td className="px-2 py-1">x{p.quantity}</td>
                          <td className="px-2 py-1">
                            {(p.price * p.quantity).toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="mb-2 font-semibold text-gray-700">
                Tổng cộng:{" "}
                {products
                  .filter((p) => p.table === table.id)
                  .reduce((sum, p) => sum + p.price * p.quantity, 0)
                  .toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
              </div>

              {/* Payment */}
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
                  <option value="">--Phương thức--</option>
                  <option value="cash">Tiền mặt</option>
                  <option value="transfer">Chuyển khoản</option>
                </select>

                <button
                  className={`py-2 px-4 rounded text-white ${
                    selectedTables[`payment-${table.id}`]?.trim()
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!selectedTables[`payment-${table.id}`]?.trim()}
                  onClick={() =>
                    handlePayment(
                      table.id,
                      selectedTables[`payment-${table.id}`] as
                        | "cash"
                        | "transfer"
                    )
                  }
                >
                  Thanh Toán
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cashier;
