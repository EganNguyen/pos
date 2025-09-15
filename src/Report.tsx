import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import "./App.css";

type Product = {
  id: number;
  name: string;
  toppings: { name: string; quantity: number }[];
  quantity: number;
  total_cash: number;
  total_transfer: number;
  price: number;

};

type OrderProduct = {
  name: string;
  quantity: number;
  price: number;
  payment_method: "cash" | "transfer";
  toppings: { name: string; quantity: number }[];
};

type Order = {
  unique: string;
  products: OrderProduct[];
};


function Report() {
  const navigate = useNavigate();
  const today = new Date();
  const formattedDay = today.toISOString().split("T")[0]; // YYYY-MM-DD
  const formattedMonth = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
  const formattedYear = today.getFullYear().toString();

  const [products, setProducts] = useState<Product[]>([]);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Report type: "day" | "month" | "year"
  const [reportType, setReportType] = useState<"day" | "month" | "year">("day");

  // Input states
  const [day, setDay] = useState<string>(formattedDay);
  const [monthYear, setMonthYear] = useState<string>(formattedMonth);
  const [yearOnly, setYearOnly] = useState<string>(formattedYear);
  const [viewType, setViewType] = useState<"products" | "orders">("products");
  const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
    const username = localStorage.getItem("admin");
    const password = localStorage.getItem("adminpassword");

    if (username != 'admin' && password != 'reportforadmin321') {
      // If credentials not found, redirect to login
      navigate("/login", { replace: true });
    }
  }, [navigate]);

// Fetch report data based on type
const fetchProducts = async () => {
  setLoading(true);
  try {
    let url = "https://gsymrhydnwutflpnzkid.supabase.co/functions/v1/load-ordered";

    if (reportType === "day" && day) {
      const date = new Date(day);
      const dayInt = date.getDate(); // 1-31
      const monthInt = date.getMonth() + 1; // 1-12
      const yearInt = date.getFullYear();
      url += `?day=${dayInt}&month=${monthInt}&year=${yearInt}`;
    } else if (reportType === "month" && monthYear) {
      const [year, month] = monthYear.split("-").map(Number);
      url += `?month=${month}&year=${year}`;
    } else if (reportType === "year" && yearOnly) {
      url += `?year=${yearOnly}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Failed to fetch report data");

    const data = await response.json();

if (viewType === "products") {
  const mappedProducts: Product[] = data.products.map((p: any, i: number) => ({
    id: i + 1,
    name: p.name,
    toppings: p.toppings || [],
    quantity: p.quantity,
    total_cash: p.total_cash,
    total_transfer: p.total_transfer,
    price: p.price,
  }));
  setProducts(mappedProducts);
  setTotalOrders(data.total_order);
} else {
  // Orders view
  const mappedOrders: Order[] = data.orders.map((o: any) => ({
    unique: o.unique,
    products: o.products,
  }));
  setOrders(mappedOrders);
  setTotalOrders(mappedOrders.length);
}
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  fetchProducts();
}, [day, monthYear, yearOnly, reportType, viewType]);



  const totalProducts = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalRevenue = products.reduce((sum, p) => sum + p.price, 0);
  const bestseller = products.sort((a, b) => b.quantity - a.quantity)[0]?.name || "-";

  // Export Excel
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const title =
      reportType === "day"
        ? "Daily Report"
        : reportType === "month"
        ? "Monthly Report"
        : "Yearly Report";

    const summaryData = [
      [title],
      [
        reportType === "day" ? "Date" : reportType === "month" ? "Month" : "Year",
        reportType === "day" ? day : reportType === "month" ? monthYear : yearOnly,
      ],
      ["Total Products", totalProducts],
      ["Total Revenue", `${totalRevenue.toLocaleString()} VND`],
      ["Bestseller", bestseller],
    ];
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(summaryData), "Summary");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(products), "Product Details");
    XLSX.writeFile(workbook, `${title.replace(" ", "_")}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Admin Report</h1>

      {/* Report Type Selector */}
      <div className="flex items-center gap-4 mb-4">
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value as "day" | "month" | "year")}
          className="border p-2 rounded"
        >
          <option value="day">Daily Report</option>
          <option value="month">Monthly Report</option>
          <option value="year">Yearly Report</option>
        </select>
  <select
    value={viewType}
    onChange={(e) => setViewType(e.target.value as "products" | "orders")}
    className="border p-2 rounded"
  >
    <option value="products">Products</option>
    <option value="orders">Orders</option>
  </select>



        {/* Input based on report type */}
        {reportType === "day" && (
          <input
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="border p-2 rounded"
          />
        )}
        {reportType === "month" && (
          <input
            type="month"
            value={monthYear}
            onChange={(e) => setMonthYear(e.target.value)}
            className="border p-2 rounded"
          />
        )}
        {reportType === "year" && (
          <input
            type="number"
            value={yearOnly}
            onChange={(e) => setYearOnly(e.target.value)}
            min={2000}
            max={2100}
            className="border p-2 rounded w-24"
          />
        )}
      </div>

{/* Top Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
  {/* Total Products Card */}
  <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
  <div className="text-blue-500 text-3xl">📋</div>
  <div>
    <h2 className="text-gray-500">
      {viewType === "products"
        ? reportType === "day" ? "Products Today" : reportType === "month" ? "Products This Month" : "Products This Year"
        : reportType === "day" ? "Orders Today" : reportType === "month" ? "Orders This Month" : "Orders This Year"}
    </h2>
    <p className="text-xl font-bold">{totalOrders}</p>
  </div>
</div>


  {/* Bestseller Card */}
  <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
    <div className="text-yellow-500 text-3xl">⭐</div>
    <div>
      <h2 className="text-gray-500">Bestseller</h2>
      <p className="text-xl font-bold">{bestseller}</p>
    </div>
  </div>

  {/* Total Revenue Card */}
  <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
    <div className="text-green-500 text-3xl">📈</div>
    <div>
      <h2 className="text-gray-500">
        {reportType === "day"
          ? "Today's Revenue"
          : reportType === "month"
          ? "Monthly Revenue"
          : "Yearly Revenue"}
      </h2>
      <p className="text-xl font-bold">{totalRevenue.toLocaleString()} VND</p>
    </div>
  </div>
</div>


      {/* Products Table */}
      <div className="mt-8 bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
<table className="w-full text-left border-collapse">
  <thead>
    <tr className="bg-gray-50 text-gray-700">
      <th className="py-3 px-4 border-b">#</th>
      <th className="py-3 px-4 border-b">{viewType === "products" ? "Product" : "Order"}</th>
      <th className="py-3 px-4 border-b">Toppings</th>
      <th className="py-3 px-4 border-b">Quantity</th>
      <th className="py-3 px-4 border-b">Cash</th>
      <th className="py-3 px-4 border-b">Transfer</th>
      <th className="py-3 px-4 border-b">Revenue (VND)</th>
    </tr>
  </thead>
  <tbody>
    {loading ? (
      <tr>
        <td colSpan={7} className="text-center py-6 text-gray-500">
          Loading report...
        </td>
      </tr>
    ) : viewType === "products" ? (
      products.map((p) => (
        <tr key={p.id} className="hover:bg-gray-50">
          <td className="py-3 px-4 border-b">{p.id}</td>
          <td className="py-3 px-4 border-b">{p.name}</td>
          <td className="py-3 px-4 border-b">
            {p.toppings.length > 0 ? (
              <ul className="list-disc list-inside">
                {p.toppings.map((t, idx) => (
                  <li key={idx}>{t.name} ({t.quantity})</li>
                ))}
              </ul>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </td>
          <td className="py-3 px-4 border-b">{p.quantity}</td>
          <td className="py-3 px-4 border-b text-green-600">{p.total_cash.toLocaleString()}</td>
          <td className="py-3 px-4 border-b text-blue-600">{p.total_transfer.toLocaleString()}</td>
          <td className="py-3 px-4 border-b">{p.price.toLocaleString()}</td>
        </tr>
      ))
    ) : (
      orders.map((o, idx) => {
        const orderTotalQty = o.products.reduce((sum, p) => sum + p.quantity, 0);
        const orderTotalCash = o.products
          .filter(p => p.payment_method === "cash")
          .reduce((sum, p) => sum + p.price, 0);
        const orderTotalTransfer = o.products
          .filter(p => p.payment_method === "transfer")
          .reduce((sum, p) => sum + p.price, 0);
        const orderRevenue = o.products.reduce((sum, p) => sum + p.price, 0);

        return (
          <tr key={o.unique} className="hover:bg-gray-50">
            <td className="py-3 px-4 border-b">{idx + 1}</td>
            <td className="py-3 px-4 border-b">{o.unique}</td>
            <td className="py-3 px-4 border-b">
              {o.products.map((p, i) => (
                <div key={i}>{p.toppings.map(t => `${t.name} (${t.quantity})`).join(", ") || "-"}</div>
              ))}
            </td>
            <td className="py-3 px-4 border-b">{orderTotalQty}</td>
            <td className="py-3 px-4 border-b text-green-600">{orderTotalCash.toLocaleString()}</td>
            <td className="py-3 px-4 border-b text-blue-600">{orderTotalTransfer.toLocaleString()}</td>
            <td className="py-3 px-4 border-b">{orderRevenue.toLocaleString()}</td>
          </tr>
        );
      })
    )}
  </tbody>
</table>

      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={exportToExcel}
          className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow"
        >
          📥 Export Excel
        </button>

        <a
          href="/"
          className="px-5 py-2 bg-black text-white rounded-lg hover:bg-red-700 shadow"
        >
          ⬅ Back to App
        </a>
      </div>
    </div>
  );
}

export default Report;
