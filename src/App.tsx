import { useState, useEffect } from "react";
import "./App.css";

// Categories
const categories = [
  "Noodles",
  "Rice",
  "Side Dish",
  "Specialty",
  "Drink",
];

// Hardcoded products grouped by category
const productsByCategory: Record<string, any[]> = {
  Noodles: [
    {
      id: "noodles-1",
      image: "/ramen.jpg",
      name: "Classic Ramen",
      price: "70,000 VND",
    },
    {
      id: "noodles-2",
      image: "/spicy-ramen.jpg",
      name: "Spicy Ramen",
      price: "80,000 VND",
    },
  ],
  Rice: [
    {
      id: "rice-1",
      image: "/fried-rice.jpg",
      name: "Fried Rice",
      price: "60,000 VND",
    },
    {
      id: "rice-2",
      image: "/egg-rice.jpg",
      name: "Egg Rice",
      price: "55,000 VND",
    },
  ],
  "Side Dish": [
    {
      id: "side-1",
      image: "/tempura.jpg",
      name: "Tempura",
      price: "20,000 VND",
    },
    {
      id: "side-2",
      image: "/tonkatsu.jpg",
      name: "Tonkatsu",
      price: "35,000 VND",
    },
  ],
  Specialty: [
    {
      id: "Specialty-1",
      image: "/ramen.jpg",
      name: "Special Ramen",
      price: "100,000 VND",
    },
  ],
  Drink: [
    {
      id: "drink-1",
      image: "/coca.jpg",
      name: "Coca Cola",
      price: "20,000 VND",
    },
    {
      id: "drink-2",
      image: "/matcha.jpg",
      name: "Green Tea",
      price: "30,000 VND",
    },
  ],
};


// Fake API function
const fetchProductsByCategory = (category: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(productsByCategory[category] || []);
    }, 500); // optional fake delay
  });
};

// API function to complete order
const completeOrderApi = async (cart: any[]) => {
  const url = "https://gsymrhydnwutflpnzkid.supabase.co/functions/v1/create-order";
  const params = new URLSearchParams(window.location.search);
  const table = params.get("table") || null;

  const parsePrice = (p: any) => {
    if (typeof p === "number") return p;
    const s = String(p ?? "");
    const n = Number(s.replace(/\D/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  // Build payload: price = (unitPrice + toppingsTotal) * quantity
  const payload = cart.map((item) => {
    const unitPrice = parsePrice(item.price);
    const qty = item.quantity ?? 1;

    const toppingsArr = (item.toppings || []).map((t: any) => ({
      name: t.name,
      price: parsePrice(t.price),
      quantity: t.quantity ?? 0,
    }));

    const toppingsTotal = toppingsArr.reduce(
      (sum: number, t: any) => sum + (t.price || 0) * (t.quantity || 0),
      0
    );

    const totalLinePrice = (unitPrice + toppingsTotal) * qty;

    return {
      table,
      name: item.name,
      // send numeric total for this cart line (in VND units, e.g. 75000)
      price: totalLinePrice,
      quantity: qty,
      toppings: toppingsArr,
      status: "pending",
    };
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orders: payload }),
    });

    if (!response.ok) {
      console.error("Create order failed:", response.status, await response.text());
      return false;
    }

    const data = await response.json();
    console.log("Create order success:", data);
    return true;
  } catch (error) {
    console.error("Create order API error:", error);
    return false;
  }
};



// Fake API to get toppings for a product
const fetchToppingsByProduct = (_productId: string) => {
  return new Promise((resolve) => {
    const toppings = [
      {
        id: "1",
        name: "Noddles",
        price: "5,000 VND",
        quantity: 0,
      },
      {
        id: "2",
        name: "Seaweed",
        price: "5,000 VND",
        quantity: 0,
      },
      {
        id: "3",
        name: "Pork",
        price: "15,000 VND",
        quantity: 0,
      },
      {
        id: "4",
        name: "Egg",
        price: "5,000 VND",
        quantity: 0,
      },
    ];
    resolve(toppings);
  });
};

const fetchToppingsForRice = (_productId: string) => {
  return new Promise((resolve) => {
    const toppings = [
      {
        id: "1",
        name: "Rice",
        price: "5,000 VND",
        quantity: 0,
      }
    ];
    resolve(toppings);
  });
};



function App() {
  const [activeSection, setActiveSection] = useState(categories[0]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const addToCartWithToppings = (product: any, toppings: any[]) => {
    const selectedToppings = toppings.filter(t => t.quantity > 0);

    setCart((prev) => {
      // Check if same product + same toppings already exist
      const existingIndex = prev.findIndex(
        (item) =>
          item.id === product.id &&
          JSON.stringify(item.toppings) === JSON.stringify(selectedToppings)
      );

      if (existingIndex !== -1) {
        // Merge by increasing quantity
        const updatedCart = [...prev];
        updatedCart[existingIndex].quantity =
          (updatedCart[existingIndex].quantity || 1) + 1;
        return updatedCart;
      }

      // Otherwise add as a new cart entry
      return [...prev, { ...product, quantity: 1, toppings: selectedToppings }];
    });
  };



  // states for detail modal
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [toppings, setToppings] = useState<any[]>([]);

  const addToCart = (product: any) => {
    setCart((prev) => [...prev, product]);
  };

  useEffect(() => {
    setLoading(true);
    fetchProductsByCategory(activeSection).then((items: any) => {
      setMenuItems(items);
      setLoading(false);
    });
  }, [activeSection]);

  // Load toppings dynamically depending on category
  useEffect(() => {
    if (isDetailModalOpen && selectedProduct) {
      if (activeSection === "Noodles") {
        fetchToppingsByProduct(selectedProduct.id).then((items: any) => {
          setToppings(items);
        });
      } else if (activeSection === "Rice") {
        fetchToppingsForRice(selectedProduct.id).then((items: any) => {
          setToppings(items);
        });
      } else {
        setToppings([]); // no toppings for other categories
      }
    }
  }, [isDetailModalOpen, selectedProduct, activeSection]);



  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-red-100">
      {/* Header */}
      <header className="bg-white shadow-lg px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="Mama Ramen Logo"
            className="w-14 h-14 object-contain"
          />
          <h1 className="text-xl font-bold text-gray-900">Mama ramen</h1>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex gap-3 items-center">
            <button
              className="p-2 rounded-full hover:bg-red-100 transition relative"
              onClick={() => setIsCartOpen(true)}
            >
              🛒
              <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs px-1">
                {cart.length}
              </span>
            </button>
          </div>

        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar always visible (25%) */}
        <aside className="w-1/4 bg-white shadow-inner border-r-2 border-red-100 overflow-y-auto">
          {categories.map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`block w-full text-left px-4 py-3 mb-2 rounded-lg font-medium transition-all
                ${activeSection === section
                  ? "bg-black text-white font-semibold shadow-md scale-105"
                  : "text-gray-700 hover:bg-black hover:text-white hover:scale-105"
                }`}
            >
              {section}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="w-3/4 flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg animate-pulse h-64"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedProduct(item);
                    setIsDetailModalOpen(true);
                  }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 relative cursor-pointer"
                >
                  {/* Image wrapper */}
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    {/* Add to Cart button (stops click bubbling) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeSection === "Noodles" || activeSection === "Rice") {
                          setSelectedProduct(item);
                          setIsDetailModalOpen(true);
                        } else {
                          addToCart(item);
                        }
                      }}
                      className="absolute bottom-2 right-2 bg-black text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-700 transition border-white border-4"
                    >
                      +
                    </button>


                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <div className="text-black font-bold">{item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* === Product Detail Modal === */}
        {isDetailModalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-white backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-96 max-w-md shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
                onClick={() => setIsDetailModalOpen(false)}
              >
                ✖
              </button>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
              <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
              <p className="text-gray-600 mb-4">
                This is a delicious {selectedProduct.name}. Perfect for your meal!
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold">{selectedProduct.price}</span>
              </div>

              {/* === Toppings Section  */}
              {(activeSection === "Noodles" || activeSection === "Rice") && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Choose Toppings</h3>
                  <ul className="space-y-2">
                    {toppings.map((topping, index) => (
                      <li key={topping.id} className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-800">{topping.name}</p>
                          <p className="text-gray-500 text-sm">{topping.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const updated = [...toppings];
                              if (updated[index].quantity > 0) updated[index].quantity -= 1;
                              setToppings(updated);
                            }}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span>{topping.quantity}</span>
                          <button
                            onClick={() => {
                              const updated = [...toppings];
                              updated[index].quantity += 1;
                              setToppings(updated);
                            }}
                            className="px-2 py-1 bg-black text-white rounded hover:bg-red-700"
                          >
                            +
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}



              {/* Add to Cart button */}
              <div className="mt-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCartWithToppings(selectedProduct, toppings);
                    setIsDetailModalOpen(false);
                  }}
                  className="w-full bg-black text-white py-3 rounded-xl font-semibold text-lg 
               shadow-md hover:bg-red-700 transition"
                >
                  Add to Cart 🛒
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-40 backdrop-blur-sm flex items-center justify-center ">
          <div className="bg-white rounded-xl p-6 w-96 max-h-[80vh] overflow-y-auto relative shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3.825C2 3.36781 2.37471 3 2.84046 3H4.43383C5.20426 3 5.88713 3.44 6.2058 4.1H20.5987C21.5197 4.1 22.1921 4.95938 21.9504 5.8325L20.5146 11.0678C20.217 12.1472 19.2189 12.9 18.0808 12.9H7.97778L8.16688 13.8797C8.24392 14.2681 8.59061 14.55 8.99333 14.55H19.0894C19.5551 14.55 19.9298 14.9178 19.9298 15.375C19.9298 15.8322 19.5551 16.2 19.0894 16.2H8.99333C7.78167 16.2 6.7416 15.3544 6.51748 14.1891L4.71049 4.87344C4.68597 4.74281 4.57041 4.65 4.43383 4.65H2.84046C2.37471 4.65 2 4.28219 2 3.825ZM6.48246 18.95C6.48246 18.7333 6.52593 18.5188 6.61041 18.3186C6.69488 18.1184 6.8187 17.9365 6.97479 17.7833C7.13087 17.6301 7.31618 17.5085 7.52012 17.4256C7.72406 17.3427 7.94264 17.3 8.16338 17.3C8.38412 17.3 8.6027 17.3427 8.80664 17.4256C9.01058 17.5085 9.19588 17.6301 9.35197 17.7833C9.50806 17.9365 9.63187 18.1184 9.71635 18.3186C9.80082 18.5188 9.8443 18.7333 9.8443 18.95C9.8443 19.1667 9.80082 19.3812 9.71635 19.5814C9.63187 19.7816 9.50806 19.9635 9.35197 20.1167C9.19588 20.2699 9.01058 20.3915 8.80664 20.4744C8.6027 20.5573 8.38412 20.6 8.16338 20.6C7.94264 20.6 7.72406 20.5573 7.52012 20.4744C7.31618 20.3915 7.13087 20.2699 6.97479 20.1167C6.8187 19.9635 6.69488 19.7816 6.61041 19.5814C6.52593 19.3812 6.48246 19.1667 6.48246 18.95ZM18.2489 17.3C18.6947 17.3 19.1223 17.4738 19.4375 17.7833C19.7527 18.0927 19.9298 18.5124 19.9298 18.95C19.9298 19.3876 19.7527 19.8073 19.4375 20.1167C19.1223 20.4262 18.6947 20.6 18.2489 20.6C17.8031 20.6 17.3755 20.4262 17.0603 20.1167C16.7451 19.8073 16.568 19.3876 16.568 18.95C16.568 18.5124 16.7451 18.0927 17.0603 17.7833C17.3755 17.4738 17.8031 17.3 18.2489 17.3Z" fill="currentColor"></path>
              </svg>
              Items in cart</h2>

            {cart.length === 0 ? (
              <p className="text-gray-500">No products in the cart.</p>
            ) : (
              <ul className="space-y-4">
                {cart.map((item, index) => (
                  <li key={index} className="flex gap-4 items-center border-b pb-3">
                    {/* Optional: image placeholder */}
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                      Img
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-gray-500">x {item.quantity || 1}</p>
                    </div>

                    <div className="text-black font-bold">{item.price}</div>
                  </li>
                ))}
              </ul>
            )}

            {/* Summary */}
            {cart.length > 0 && (
              <div className="mt-6 pt-4 flex flex-col gap-3">
                <div className="flex justify-between text-gray-700 font-medium">
                  <span>Total ({cart.reduce((acc, item) => acc + (item.quantity || 1), 0)} Items)</span>
                  <span className="text-black font-bold">
                    {cart.reduce((acc, item) => {
                      const numericPrice = Number(item.price.replace(/\D/g, ""));

                      // Add topping prices too
                      const toppingTotal = item.toppings
                        ? item.toppings.reduce((sum: number, t: any) => {
                          const toppingPrice = Number(t.price.replace(/\D/g, ""));
                          return sum + toppingPrice * (t.quantity || 0);
                        }, 0)
                        : 0;

                      return acc + (numericPrice + toppingTotal) * (item.quantity || 1);
                    }, 0).toLocaleString()} VND

                  </span>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-black text-white rounded hover:bg-red-700"
                    onClick={async () => {
                      if (cart.length === 0) return;

                      const success = await completeOrderApi(cart);
                      if (success) {
                        setCart([]);
                        setIsCartOpen(false);
                        setIsCompleteModalOpen(true); // open Complete modal
                      } else {
                        alert("Checkout failed! Please try again.");
                      }
                    }}
                  >
                    Complete Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== Complete Modal ===== */}
      {isCompleteModalOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 max-w-sm shadow-lg text-center">
            <h2 className="text-3xl font-bold text-green-600 mb-4">Complete!</h2>
            <p className="text-gray-700 mb-6">Your order has been successfully placed.</p>
            <button
              className="px-6 py-2 bg-black text-white rounded hover:bg-red-700"
              onClick={() => setIsCompleteModalOpen(false)}
            >
              Close
            </button>
            <div className="mt-4 text-sm text-gray-400">Powered by Mama Ramen</div>
          </div>
        </div>
      )}

      {/* Floating Cart Button (bottom, wide with cart + total) */}
      <div
        className="fixed bottom-6 right-6 left-6 flex justify-between items-center bg-black text-white rounded-xl shadow-lg px-6 py-4 hover:bg-black transition cursor-pointer"
        onClick={() => setIsCartOpen(true)}
      >
        <h1 className="text-xl font-bold">Cart ({cart.length})</h1>
        <h1 className="text-xl font-bold">
          {cart.reduce((acc, item) => {
            const numericPrice = Number(item.price.replace(/\D/g, ""));

            // Add topping prices too
            const toppingTotal = item.toppings
              ? item.toppings.reduce((sum: number, t: any) => {
                const toppingPrice = Number(t.price.replace(/\D/g, ""));
                return sum + toppingPrice * (t.quantity || 0);
              }, 0)
              : 0;

            return acc + (numericPrice * (item.quantity || 1)) + toppingTotal;
          }, 0).toLocaleString()} VND
        </h1>
      </div>

    </div>
  );
}

export default App;
