// import { useState, useEffect } from "react";
// import { categories, fetchProductsByCategory, fetchToppingsByProduct, fetchToppingsForRice } from "./utils/api";
// import { useCart } from "./hooks/useCart";
// import { ProductCard } from "./components/ProductCard";
// import { ProductModal } from "./components/ProductModal";
// import { Header } from "./components/Header";
// import { Sidebar } from "./components/Sidebar";
// import { FloatingCart } from "./components/FloatingCart";
// import { CartModal } from "./components/CartModal";
// import { CompleteModal } from "./components/CompleteModal";

// function App() {
//   const [activeSection, setActiveSection] = useState(categories[0]);
//   const [menuItems, setMenuItems] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Product detail modal
//   const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
//   const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
//   const [toppings, setToppings] = useState<any[]>([]);

//   // Cart & UI states
//   const { cart, addToCart, addToCartWithToppings, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
//   const [isFloatingCartVisible, setIsFloatingCartVisible] = useState(true);

//   const handleCompleteOrder = () => {
//   // Example: clear cart + close modal
//   clearCart();
//   setIsCartOpen(false);

//   // You could also send an API request here, etc.
//   console.log("Order completed!");
// };

//   // Load menu items when section changes
//   useEffect(() => {
//     setLoading(true);
//     fetchProductsByCategory(activeSection).then(items => {
//       setMenuItems(items);
//       setLoading(false);
//     });
//   }, [activeSection]);

//   // Load toppings dynamically when modal opens
//   useEffect(() => {
//     if (!isDetailModalOpen || !selectedProduct) return;

//     if (activeSection === "Noodles") {
//       fetchToppingsByProduct(selectedProduct.id).then(setToppings);
//     } else if (activeSection === "Rice") {
//       fetchToppingsForRice(selectedProduct.id).then(setToppings);
//     } else {
//       setToppings([]);
//     }
//   }, [isDetailModalOpen, selectedProduct, activeSection]);

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-red-100">
//       <Header
//         cartCount={totalItems}
//         onCartClick={() => {
//           setIsCartOpen(true);
//           setIsFloatingCartVisible(false);
//         }}
//       />

//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar
//           categories={categories}
//           activeSection={activeSection}
//           setActiveSection={setActiveSection}
//         />

//         <main className="w-3/4 flex-1 p-6 overflow-y-auto">
//           {loading ? null : (
//             <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {menuItems.map(item => (
// <ProductCard
//   key={item.id}
//   product={item}
//   onClick={() => {
//     setSelectedProduct(item);
//     setIsDetailModalOpen(true);
//   }}
// />

//               ))}
//             </div>
//           )}
//         </main>

//         {isDetailModalOpen && selectedProduct && (
// <ProductModal
//   product={selectedProduct}
//   onAddToCart={() => {
//     addToCartWithToppings(selectedProduct, toppings); // modal uses internal toppings state
//     setIsDetailModalOpen(false);
//   }}
//   onClose={() => setIsDetailModalOpen(false)}
// />

//         )}
//       </div>

// <CartModal
//   cart={cart}
//   onClose={() => setIsCartOpen(false)}
//   onCompleteOrder={() => {
//     clearCart();
//     setIsCartOpen(false);
//     console.log("Order completed!");
//   }}
// />



// {isCompleteModalOpen && (
//   <CompleteModal onClose={() => setIsCompleteModalOpen(false)} />
// )}


// {isFloatingCartVisible && (
//   <FloatingCart
//     cartCount={totalItems}
//     cartTotal={totalPrice}
//     onClick={() => setIsCartOpen(true)}
//   />
// )}

//     </div>
//   );
// }

// export default App;
