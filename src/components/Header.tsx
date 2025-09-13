import React from "react";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick }) => {
  return (
    <header className="bg-white shadow-lg px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <img src="/logo.png" alt="Mama Ramen Logo" className="w-14 h-14 object-contain" />
        <h1 className="text-xl font-bold text-gray-900">Mama Ramen</h1>
      </div>
      <div>
        <button
          className="p-2 rounded-full hover:bg-red-100 transition relative"
          onClick={onCartClick}
        >
          🛒
          <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs px-1">
            {cartCount}
          </span>
        </button>
      </div>
    </header>
  );
};
