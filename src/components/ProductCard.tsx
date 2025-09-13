import React from "react";

interface ProductCardProps {
  product: any;
  onClick: (product: any) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center cursor-pointer hover:scale-105 transition"
      onClick={() => onClick(product)}
    >
      <div className="w-32 h-32 mb-2 rounded-lg overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <h3 className="font-semibold text-gray-800">{product.name}</h3>
      <p className="text-gray-600">{product.price}</p>
    </div>
  );
};
