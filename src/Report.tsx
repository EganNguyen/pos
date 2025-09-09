import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "./App.css";

type Product = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
};

function Report() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Date range state
  const [startDate, setStartDate] = useState<string>("2025-09-01");
  const [endDate, setEndDate] = useState<string>("2025-09-30");

  // Fake API to fetch monthly report
  const fetchMonthlyProducts = async () => {
    return new Promise<Product[]>((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: "Tonkotsu Ramen", category: "Ramen", quantity: 30, price: 85000 },
          { id: 2, name: "Shoyu Ramen", category: "Ramen", quantity: 25, price: 75000 },
          { id: 3, name: "Katsu Don", category: "Rice", quantity: 20, price: 95000 },
          { id: 4, name: "Gyoza", category: "Side Dish", quantity: 40, price: 45000 },
          { id: 5, name: "Matcha Latte", category: "Drink", quantity: 15, price: 55000 },
        ]);
      }, 1000);
    });
  };

  useEffect(() => {
    fetchMonthlyProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  // Calculate summary
  const totalOrders = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalRevenue = products.reduce((sum, p) => sum + p.quantity * p.price, 0);

  // Export to Excel with Summary + Product List
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    // 1️⃣ Sales Summary Sheet
    const summaryData = [
      ["Sales Report"],
      [`Date Range`, `${startDate} → ${endDate}`],
      ["Total Orders", totalOrders],
      ["Total Revenue", `${totalRevenue.toLocaleString()} VND`],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Sales Summary");

    // 2️⃣ Product Details Sheet
    const productSheet = XLSX.utils.json_to_sheet(products);
    XLSX.utils.book_append_sheet(workbook, productSheet, "Product Details");

    // Save file
    XLSX.writeFile(workbook, "Monthly_Report.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Admin Report</h1>

      {/* Date Filter */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-600">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 px-3 py-2 border rounded-lg shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 px-3 py-2 border rounded-lg shadow-sm"
          />
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Sales Summary</h2>
        <p className="text-gray-600">📅 Date Range: <span className="font-bold">{startDate} → {endDate}</span></p>
        <p className="text-gray-600">🛒 Total Orders: <span className="font-bold">{totalOrders}</span></p>
        <p className="text-gray-600">💰 Total Revenue: <span className="font-bold">{totalRevenue.toLocaleString()} VND</span></p>
      </div>

      {/* Products Table */}
      <div className="mt-8 bg-white shadow-lg rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="py-3 px-4 border-b">#</th>
              <th className="py-3 px-4 border-b">Product</th>
              <th className="py-3 px-4 border-b">Category</th>
              <th className="py-3 px-4 border-b">Quantity</th>
              <th className="py-3 px-4 border-b">Price (VND)</th>
              <th className="py-3 px-4 border-b">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Loading report...
                </td>
              </tr>
            ) : (
              products.map((p, i) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{i + 1}</td>
                  <td className="py-3 px-4 border-b">{p.name}</td>
                  <td className="py-3 px-4 border-b">{p.category}</td>
                  <td className="py-3 px-4 border-b">{p.quantity}</td>
                  <td className="py-3 px-4 border-b">{p.price.toLocaleString()}</td>
                  <td className="py-3 px-4 border-b">
                    {(p.quantity * p.price).toLocaleString()}
                  </td>
                </tr>
              ))
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
