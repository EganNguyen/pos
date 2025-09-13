import { useState, useEffect } from "react";
import { productsByCategory } from "../utils/api"; // your hardcoded data

export const useProduct = (category: string) => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchProductsByCategory = async (category: string) => {
      return new Promise<any[]>((resolve) => {
        setTimeout(() => {
          resolve(productsByCategory[category] || []);
        }, 300); // optional delay
      });
    };

    fetchProductsByCategory(category).then((items) => {
      setMenuItems(items);
      setLoading(false);
    });
  }, [category]);

  return { menuItems, loading };
};
