import React from "react";

interface FloatingCartProps {
  cartCount: number;
  cartTotal: number;
  onClick: () => void;
}

export const FloatingCart: React.FC<FloatingCartProps> = ({ cartCount, cartTotal, onClick }) => {
  return (
    <div
      className="fixed bottom-6 right-6 left-6 flex justify-between items-center bg-black text-white rounded-xl shadow-lg px-6 py-4 hover:bg-black transition cursor-pointer z-40"
      onClick={onClick}
    >
      <h1 className="text-xl font-bold">Cart ({cartCount})</h1>
      <h1 className="text-xl font-bold">{cartTotal.toLocaleString()} VND</h1>
    </div>
  );
};
