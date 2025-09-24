// 1. Categories & Products

// Display menu items grouped into categories (e.g., Mì Ramen/Udon, Cơm, Món Đặc Biệt, Món ăn kèm, Đồ uống, Tráng miệng).

// Categories are shown as buttons/tabs at the top, allowing users to filter products by category.

// Each product card shows:

// Name, description, and image.

// Price (formatted with toLocaleString()).

// “Thêm vào giỏ” button to add it to the cart.

// 2. Cart Functionality

// The cart is displayed in a modal when clicking the cart button.

// Cart items include:

// Product name.

// Quantity with + / – buttons to adjust.

// Toppings (with their names, prices, and quantities).

// Line total (product price + toppings) × quantity.

// Users can remove products or toppings from the cart.

// The total price of the entire cart is shown at the bottom.

// 3. Toppings Modal

// When adding a product, a modal appears for selecting optional toppings.

// Each topping:

// Has a name, price, and + / – buttons to set quantity.

// Users confirm by clicking “Thêm vào giỏ.”

// Selected toppings are saved along with the product in the cart.

// 4. Utilities & Styling

// Utility functions for:

// Parsing prices from strings (e.g., "70,000" → 70000).

// Calculating line totals for cart items (product + toppings × quantity).

// Responsive grid layout for products.

// Tailwind CSS styling for buttons, modals, grid, and cards.

// Fixed cart button at the bottom-right corner, showing the current cart total.

// 5. Tech stack

// React (with hooks useState, useEffect).

// Tailwind CSS for styling.

// Custom CSS for extra styles.
import PastOrders from "./PastOrders";
import { useState, useEffect } from "react";
import "./App.css";

// Categories with display name + key for productsByCategory
const categories = [
  { key: "Noodles", label: "Mì Ramen/Udon" },
  { key: "Rice", label: "Cơm" },
  { key: "Specialty", label: "Món Đặc Biệt" },
  { key: "Side Dish", label: "Món ăn kèm" },
  { key: "Drink", label: "Nước uống" },
];


// Hardcoded products grouped by category
const productsByCategory: Record<string, any[]> = {
  Noodles: [
    {
      id: "noodles-1",
      image: "/tonkotsu-ramen.jpg",
      name: "Mì Nước Truyền Thống Tonkotsu Ramen",
      description: "Nước dùng xương heo hầm trong 12 tiếng, thịt xá xíu, trứng lòng đào, nấm mèo, hành lá và rong biển \n\n Classic Tonkotsu ramen with pork broth simmered for 12 hours, sliced pork, half boiled egg, wood ear mushroom, green onion and seaweed.",
      price: "60,000",
    },
    {
      id: "noodles-2",
      image: "/spicy-ramen.jpg",
      name: "Mì cay phomai Spicy Tonkotsu ramen",
      description: "Nước dùng xương heo hầm trong 12 tiếng, thịt xá xíu, trứng lòng đào, nấm mèo, hành lá, phomai và rong biển \n\n Spicy Tonkotsu ramen with pork broth simmered for 12 hours, sliced pork, half boiled egg, wood ear mushroom, green onion, cheese and seaweed.",
      price: "70,000",
    },
    {
      id: "noodles-3",
      image: "/udon.jpg",
      name: "Mì udon ( Tempura Niku Udon )",
      description: "Mì udon sợi to ăn kèm thịt bò Mỹ, hành lá và tempura gà chiên giòn \n\n Thick udon noodles with sliced beef, green onion and crispy fried chicken tempura.",
      price: "70,000",
    },
    {
      id: "noodles-4",
      image: "/teriyaki-ramen.jpg",
      name: "Mì Trộn Teriyaki ramen",
      description: "Mì ramen trộn sốt teriyaki, thịt xá xíu, trứng lòng đào, nấm mèo, hành lá và rong biển \n\n Ramen noodles mixed with teriyaki sauce, sliced pork, half boiled egg, wood ear mushroom, green onion and seaweed.",
      price: "60,000",
    },
    {
      id: "noodles-5",
      image: "/miso-cheese-ramen.jpg",
      name: "Miso Cheese Ramen",
      description: "Nước dùng miso đậm đà, thịt xá xíu, trứng lòng đào, nấm mèo, hành lá, phomai và rong biển \n\n Rich miso ramen with sliced pork, half boiled egg, wood ear mushroom, green onion, cheese and seaweed.",
      price: "70,000",
    },
    {
      id: "noodles-6",
      image: "/miso.jpg",
      name: "Miso Tantanmen",
      description: "Nước dùng miso đậm đà, thịt xá xíu, trứng lòng đào, nấm mèo, hành lá và rong biển \n\n Rich miso ramen with sliced pork, half boiled egg, wood ear mushroom, green onion and seaweed.",
      price: "55,000",
    }
  ],
  Rice: [
    {
      id: "rice-1",
      image: "/gyudon.jpg",
      name: "Gyudon ( Cơm bò )",
      description: "Cơm bò Mỹ trứng lòng đào với sốt dashi đậm đà sánh quyện \n\n Beef rice bowl with half boiled egg, onion and special dashi sauce.",
      price: "70,000",
    },
    {
      id: "rice-2",
      image: "/omurice.jpg",
      name: "Omurice ( Cơm chiên trứng )",
      description: "Cơm chiên thịt heo bọc trứng kèm phomai lát và sốt bò hầm rau củ đặc biệt \n\n Omelette fried rice with beef demi glaze sauce and slided cheese",
      price: "70,000",
    },
    {
      id: "rice-3",
      image: "/katsudon.jpg",
      name: "Cơm heo ( Katsudon )",
      description: "Cơm trắng ăn kèm cốt lết heo chiên giòn, trứng và hành lá \n\n Pork cutlet rice bowl with egg and onion",
      price: "70,000",
    },
  ],
  Specialty: [
    {
      id: "Specialty-1",
      image: "/TSUKEMEN.jpg",
      name: "MÌ CHẤM SÚP TÔM TSUKEMEN",
      description: "Mì sợi to chấm với súp tôm đặc biệt, ăn kèm trứng và thịt xá xíu \n\n Thick noodles served with special shrimp soup, half boiled egg and sliced pork",
      price: "100,000",
    },
  ],
  "Side Dish": [
    {
      id: "side-1",
      image: "/toriten.jpg",
      name: "Toriten ( Tempura gà )",
      description: "Gà chiên giòn ăn kèm sốt chua ngọt \n\n Crispy fried chicken with sweet and sour sauce",
      price: "30,000",
    },
    {
      id: "side-2",
      image: "/tonkatsu.jpg",
      name: "Cốt lết heo ( Tonkatsu )",
      description: "Cốt lết heo chiên giòn ăn kèm sốt Tonkatsu đặc biệt \n\n Crispy pork cutlet with special tonkatsu sauce",
      price: "40,000",
    },
    {
      id: "side-3",
      image: "/miso-soup.jpg",
      name: "Miso soup",
      description: "Súp miso truyền thống \n\n Traditional miso soup",
      price: "15,000",
    },
  ],
  Drink: [
    {
      id: "drink-1",
      image: "/soda-ginger.jpg",
      name: "Soda Chanh Gừng",
      description: "Nước soda chanh gừng tươi mát \n\n Fresh ginger lemon soda",
      price: "25,000",
    },
    {
      id: "drink-2",
      image: "/rice-milk.jpg",
      name: "Sữa gạo rang",
      description: "Sữa gạo rang thơm béo \n\n Roasted rice milk",
      price: "25,000",
    },
    {
      id: "drink-3",
      image: "/jasmine-milk-tea.jpg",
      name: "Trà sữa lài ủ lạnh",
      description: "Trà sữa lài ủ lạnh thơm mát \n\n Iced jasmine milk tea",
      price: "25,000",
    },
    {
      id: "drink-4",
      image: "/water.jpg",
      name: "Nước suối",
      price: "10,000",
    },
    {
      id: "drink-5",
      image: "/matcha-latte.jpg",
      name: "Matcha Latte",
      price: "35,000",
    },
    {
      id: "drink-6",
      image: "/coca.jpg",
      name: "Coca",
      price: "20,000",
    },
    {
      id: "drink-7",
      image: "/soda-quyt.jpg",
      name: "Soda quýt nhài",
      price: "25,000",
    },
  ],
};

const saveOrderToLocalStorage = (cart: any[]) => {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");

  const newOrder = {
    items: cart,
    total: cart.reduce((acc, item) => {
      // Calculate base item total
      const itemPrice = (parseInt(item.price.replace(/\D/g, "")) || 0) * (item.quantity || 1);

      // Calculate toppings total
      const toppingsTotal = (item.toppings || []).reduce((tAcc, topping) => {
        return tAcc + (parseInt(topping.price.replace(/\D/g, "")) || 0) * (topping.quantity || 1);
      }, 0);

      return acc + itemPrice + toppingsTotal;
    }, 0),
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));
};


const getLastOrder = () => {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  return orders.length > 0 ? orders[orders.length - 1] : null;
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
  const table = params.get("table");

  if (!table) {
    window.location.href = "/error";
  }

  const parsePrice = (p: any) => {
    if (typeof p === "number") return p;
    const s = String(p ?? "");
    const n = Number(s.replace(/\D/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  // Build payload: send unit price and quantity, not total price
  const payload = cart.map((item) => {
    const unitPrice = parsePrice(item.price);
    const qty = item.quantity ?? 1;

    const toppingsArr = (item.toppings || []).map((t: any) => ({
      name: t.name,
      price: parsePrice(t.price), // unit price of topping
      quantity: t.quantity ?? 0,  // quantity of topping
    }));

    // Total topping price per unit
    const toppingsTotal = toppingsArr.reduce((sum: number, t: { price: number; quantity: number }) => {
      return sum + t.price * (t.quantity ?? 1);
    }, 0);



    return {
      table,
      name: item.name,
      price: unitPrice + toppingsTotal,
      quantity: qty,
      toppings: toppingsArr,
      status: "Pending",
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
        id: "topping-1",
        name: "Thêm rong biển lá",
        price: "5,000",
      },
      {
        id: "topping-2",
        name: "Thêm thịt xá xíu",
        price: "15,000",
      },
      {
        id: "topping-3",
        name: "Thêm rau",
        price: "5,000",
      },
      {
        id: "topping-4",
        name: "Thêm 1/2 trứng",
        price: "5,000",
      },
      {
        id: "topping-5",
        name: "Thêm mì",
        price: "5,000",
      },
      {
        id: "topping-6",
        name: "Thêm Phomai lát",
        price: "10,000",
      },
      {
        id: "topping-7",
        name: "Không hành",
        price: "0",
      },
      {
        id: "topping-8",
        name: "Thêm cay",
        price: "0",
      },
    ];
    resolve(toppings);
  });
};

const fetchToppingsForRice = (_productId: string) => {
  return new Promise((resolve) => {
    const toppings = [
      {
        id: "topping-1",
        name: "Thêm cơm",
        price: "5,000 ₫",
      },
    ];
    resolve(toppings);
  });
};



function App() {
  // Check table parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get("table");
    if (!table) {
      window.location.href = "/error";
    }
  }, []);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    if (storedOrders.length > 0) {
      setLastOrder(storedOrders[storedOrders.length - 1]);
    }
  }, []);


  const [isPastOrdersOpen, setIsPastOrdersOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(categories[0].key);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isFloatingCartVisible, setIsFloatingCartVisible] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // inside App component
  const [productQuantity, setProductQuantity] = useState(1);
  const getLineTotal = (item: any) => {
    const basePrice = Number(item.price.replace(/\D/g, ""));
    const toppingsTotal = item.toppings
      ? item.toppings.reduce(
        (sum: number, t: any) => sum + Number(t.price.replace(/\D/g, "")) * (t.quantity || 0),
        0
      )
      : 0;
    return (basePrice + toppingsTotal) * (item.quantity || 1);
  };

  // Inside your App component
  const totalItemsInCart = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);


  const parsePrice = (price: string | number | undefined): number => {
    if (!price) return 0;
    if (typeof price === "number") return price;
    // Remove anything that’s not a digit or dot
    const numeric = price.replace(/[^\d.]/g, "");
    return Number(numeric) || 0;
  };

  type Topping = { price?: string | number; quantity?: number };
  type CartItem = { price?: string | number; quantity?: number; toppings?: Topping[] };

  const getItemLineTotal = (item: CartItem): number => {
    if (!item) return 0;
    const unitPrice = parsePrice(item.price);

    const toppingsTotal = (item.toppings || []).reduce((sum, t) => {
      const toppingPrice = parsePrice(t.price);
      const toppingQty = Number(t.quantity) || 1;
      return sum + toppingPrice * toppingQty;
    }, 0);

    return (unitPrice + toppingsTotal);
  };









  const addToCartWithToppings = (product: any, toppings: any[] = [], productQuantity: number = 1) => {
    const selectedToppings = toppings
      .filter(t => t.quantity > 0)
      .map(t => ({ ...t }));

    setCart(prev => {
      const normalize = (toppings: any[]) =>
        (toppings || [])
          .map(t => ({ id: t.id, quantity: t.quantity || 0 }))
          .sort((a, b) => a.id.localeCompare(b.id));

      const existingIndex = prev.findIndex(
        item =>
          item.id === product.id &&
          JSON.stringify(normalize(item.toppings)) ===
          JSON.stringify(normalize(selectedToppings))
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 0) + productQuantity
        };
        return updated;
      }

      return [...prev, { ...product, quantity: productQuantity, toppings: selectedToppings }];
    });
  };



  // states for detail modal
  const [lastOrder, setLastOrder] = useState<any | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [toppings, setToppings] = useState<any[]>([]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(item => item.id === product.id && (!item.toppings || item.toppings.length === 0));
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: (updated[existingIndex].quantity || 1) + 1
        };
        return updated;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };


  useEffect(() => {
    setLoading(true);
    fetchProductsByCategory(activeSection).then((items: any) => {
      setMenuItems(items);
      setLoading(false);
    });
  }, [activeSection]);
  // Reset quantity when opening detail modal
  useEffect(() => {
    if (isDetailModalOpen) {
      setProductQuantity(1);
    }
  }, [isDetailModalOpen]);

  // Load toppings dynamically depending on category
  useEffect(() => {
    if (isDetailModalOpen && selectedProduct) {
      if (activeSection === "Noodles") {
        fetchToppingsByProduct(selectedProduct.id).then((items: any) => {
          setToppings(items.map((t: any) => ({ ...t, quantity: 0 })));

        });
      } else if (activeSection === "Rice") {
        fetchToppingsForRice(selectedProduct.id).then((items: any) => {
          setToppings(items.map((t: any) => ({ ...t, quantity: 0 })));

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
        {/* Logo */} <div className="flex items-center space-x-3"> <img src="/logo.png" alt="Mama Ramen Logo" className="w-14 h-14 object-contain" /> <h1 className="text-xl font-bold text-gray-900">Mama ramen</h1> </div>
        <div className="flex gap-3 items-center">
          <div className="flex gap-3 items-center">

            <button
              className="px-4 py-2 bg-black text-white rounded hover:bg-red-700"
              onClick={() => setIsPastOrdersOpen(true)}
            >
              Lịch sử đặt hàng
            </button>
            <button
              className="p-2 rounded-full hover:bg-red-100 transition relative"
              onClick={() => setIsCartOpen(true)}
            >
              🛒
              <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs px-1">
                {cart.reduce((acc, item) => acc + (item.quantity || 1), 0)}
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
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`block w-full text-left px-4 py-3 mb-2 rounded-lg font-medium transition-all
                ${activeSection === section.key
                  ? "bg-black text-white font-semibold shadow-md scale-105"
                  : "text-gray-700 hover:bg-black hover:text-white hover:scale-105"
                }`}
            >
              {section.label}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="w-3/4 flex-1 p-6 overflow-y-auto">
          {loading ? null : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {menuItems.map((item) => {
                // Compute total quantity in cart for this item
                const itemQuantity = cart
                  .filter(ci => ci.id === item.id)
                  .reduce((sum, ci) => sum + (ci.quantity || 1), 0);

                return (
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
                        {itemQuantity > 0 ? itemQuantity : "+"}
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <div className="text-black font-bold">{item.price} đ</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>


        {/* === Product Detail Modal === */}
        {isDetailModalOpen && selectedProduct && (
          <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg relative">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-56 object-cover rounded-lg mb-4"
              />

              <h2 className="text-xl md:text-2xl font-bold mb-2">{selectedProduct.name}</h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base whitespace-pre-line">
                {selectedProduct.description}
              </p>
              <div className="flex justify-between items-center mb-4 text-sm sm:text-base">
                <span className="font-semibold">{selectedProduct.price}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setProductQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="min-w-[24px] text-center">{productQuantity}</span>
                  <button
                    onClick={() => setProductQuantity((q) => q + 1)}
                    className="px-3 py-1 bg-black text-white rounded hover:bg-red-700"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Quantity Selector */}



              {(activeSection === "Noodles" || activeSection === "Rice") && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Chọn Toppings</h3>
                  <ul className="space-y-2 max-h-64 overflow-y-auto">
                    {toppings.map((topping, index) => (
                      <li key={topping.id} className="flex justify-between items-center text-sm sm:text-base">
                        <div>
                          <p className="text-gray-800">{topping.name}</p>
                          <p className="text-gray-500">{topping.price}</p>
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

              <div className="mt-4">
                {/* Add to Cart + Close button section */}
                <div className="mt-6 flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (selectedProduct) {
                        addToCartWithToppings(selectedProduct, toppings, productQuantity);
                      }
                      setIsDetailModalOpen(false);
                    }}
                    className="flex-[2] bg-black text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-red-700 transition flex items-center justify-center gap-2"
                  >
                    {/* Inline SVG icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                    >
                      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 3c0 .55.45 1 1 1h1l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h11c.55 0 1-.45 1-1s-.45-1-1-1H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.67-1.43c-.16-.35-.52-.57-.9-.57H2c-.55 0-1 .45-1 1zm16 15c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
                    </svg>
                    Thêm vào giỏ
                  </button>


                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="flex-[1] bg-white text-black py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-gray-200 transition border border-black"
                  >
                    X Đóng
                  </button>
                </div>


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
              Số món trong giỏ</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500">Chưa có sản phẩm trong giỏ.</p>
            ) : (
              <ul className="space-y-4">
                {cart.map((item, index) => (
                  <li key={index} className="flex flex-col gap-2 border-b pb-3">
                    <div className="flex gap-4 items-center">
                      {/* Product Image */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-1">
                          {/* Decrease quantity */}
                          <button
                            onClick={() => {
                              setCart(prev =>
                                prev
                                  .map((ci, i) =>
                                    i === index
                                      ? { ...ci, quantity: (ci.quantity || 1) - 1 } // new object
                                      : ci
                                  )
                                  .filter(ci => (ci.quantity || 0) > 0) // remove if quantity <= 0
                              );
                            }}
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            -
                          </button>

                          <span className="min-w-[24px] text-center">{item.quantity}</span>

                          {/* Increase quantity */}
                          <button
                            onClick={() => {
                              setCart(prev =>
                                prev.map((ci, i) =>
                                  i === index
                                    ? { ...ci, quantity: (ci.quantity || 1) + 1 } // new object
                                    : ci
                                )
                              );
                            }}
                            className="px-2 py-1 bg-black text-white rounded hover:bg-red-700"
                          >
                            +
                          </button>
                        </div>

                        {/* Toppings */}
                        {item.toppings && item.toppings.length > 0 && (
                          <ul className="mt-1 ml-2 text-gray-600 text-sm">
                            {item.toppings.map((t: any) => (
                              <li key={t.id}>
                                {t.name} x {t.quantity}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Line total */}
                      <div className="text-black font-bold">
                        {getItemLineTotal(item)?.toLocaleString() ?? "0"} đ
                      </div>
                    </div>
                  </li>
                ))}


              </ul>
            )}
            {/* Back to Menu button */}
            {cart.length === 0 && (

              <div className="mt-6 pt-4 flex flex-col gap-3">
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsFloatingCartVisible(true);
                    }}
                  >
                    ← Quay lại menu
                  </button>
                </div>
              </div>
            )}

            {/* Summary */}
            {cart.length > 0 && (
              <div className="mt-6 pt-4 flex flex-col gap-3">
                <div className="flex justify-between text-gray-700 font-medium">
                  <span>Tổng ({cart.reduce((acc, item) => acc + (item.quantity || 1), 0)} Items)</span>
                  <span className="text-black font-bold">
                    {cart.reduce((acc, item) => {
                      const total = acc + getLineTotal(item);
                      return total;
                    }, 0).toLocaleString()} đ

                  </span>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsFloatingCartVisible(true);
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => setIsConfirmModalOpen(true)}  // 👈 instead of calling API directly
                    className="w-full bg-black text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-red-700 transition"
                  >
                    Hoàn tất đơn hàng
                  </button>

                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isPastOrdersOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 max-h-[80vh] overflow-y-auto relative shadow-lg">
            <h2 className="text-xl font-bold mb-4">Lịch sử đơn hàng</h2>

            <PastOrders />

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsPastOrdersOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}


      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 max-h-[80vh] overflow-y-auto relative shadow-lg">
            <h2 className="text-xl font-bold mb-4">Xác nhận đơn hàng</h2>

            <ul className="divide-y divide-gray-200 mb-4">
              {cart.map((item, idx) => (
                <li key={idx} className="py-2">
                  <div className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{getItemLineTotal(item).toLocaleString()} ₫</span>
                  </div>
                  {item.toppings && item.toppings.length > 0 && (
                    <ul className="ml-4 text-sm text-gray-600">
                      {item.toppings.filter((t: any) => t.quantity > 0).map((t: any, i: number) => (
                        <li key={i}>
                          - {t.name} x{t.quantity}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <div className="font-bold text-right mb-4">
              Tổng:{" "}
              {cart.reduce((sum, item) => sum + getLineTotal(item), 0).toLocaleString()} ₫
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={async () => {
                  const ok = await completeOrderApi(cart);
                  if (ok) {
                    saveOrderToLocalStorage(cart);
                    setLastOrder(getLastOrder());   // refresh state from storage
                    setCart([]); // clear cart
                    setIsCartOpen(false);
                    setIsCompleteModalOpen(true); // open Complete modal
                    setIsFloatingCartVisible(true);
                  } else {
                    alert("Đặt món thất bại, vui lòng thử lại.");
                  }
                }}
                className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-red-700"
              >
                Xác nhận
              </button>

            </div>
          </div>
        </div>
      )}




      {/* ===== Complete Modal ===== */}


      {isCompleteModalOpen && lastOrder && (
        <div className="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl relative">

            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <span className="text-3xl">✅</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl md:text-2xl font-bold text-center mb-4">
              Đặt hàng thành công!
            </h2>

            {/* Order Items */}
            <div className="mb-4 max-h-60 overflow-y-auto">
              {lastOrder.items.map((item: any, idx: number) => (
                <li key={idx} className="py-2">
                <div key={idx} className="flex justify-between text-sm py-1 border-b border-gray-200">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="font-medium">{getItemLineTotal(item).toLocaleString()} đ</span>
                </div>
                {item.toppings && item.toppings.length > 0 && (
                    <ul className="ml-4 text-sm text-gray-600">
                      {item.toppings.filter((t: any) => t.quantity > 0).map((t: any, i: number) => (
                        <li key={i}>
                          - {t.name} x{t.quantity}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
                
              ))}
            </div>

            {/* Total */}
            <div className="text-right font-bold text-lg mb-6">
              Tổng cộng: {lastOrder.total.toLocaleString()} đ
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                className="w-full py-2 bg-black text-white rounded-lg hover:bg-red-700 transition"
                onClick={() => {
                  setIsCompleteModalOpen(false);
                  setIsConfirmModalOpen(false);
                  setIsPastOrdersOpen(true);
                }}
              >
                Xem lại lịch sử đặt hàng
              </button>

              <button
                className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                onClick={() => {
                  setIsCompleteModalOpen(false);
                  setIsConfirmModalOpen(false);
                }}
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}






      {/* Floating Cart Button */}
      {isFloatingCartVisible && !isCartOpen && (
        <div
          className="fixed bottom-6 right-6 left-6 flex justify-between items-center bg-black text-white rounded-xl shadow-lg px-6 py-4 hover:bg-black transition cursor-pointer z-40"
          onClick={() => {
            setIsCartOpen(true);
            setIsFloatingCartVisible(false);
          }}
        >
          <h1 className="text-xl font-bold">
            Giỏ hàng ({totalItemsInCart})
          </h1>

          <h1 className="text-xl font-bold">
            {cart.reduce(() => {
              const total = cart.reduce((acc, item) => acc + getLineTotal(item), 0);
              return total;
            }, 0).toLocaleString()} đ
          </h1>
        </div>
      )}

    </div>
  );
}

export default App;
