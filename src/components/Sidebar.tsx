import React from "react";

interface SidebarProps {
  categories: string[];
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>; // <-- add this
}

export const Sidebar: React.FC<SidebarProps> = ({ categories, activeSection, setActiveSection }) => {
  return (
    <aside className="w-1/4 bg-white p-4 border-r overflow-y-auto">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`block w-full text-left p-2 mb-2 rounded ${
            activeSection === cat ? "bg-red-500 text-white" : "bg-gray-100"
          }`}
          onClick={() => setActiveSection(cat)}
        >
          {cat}
        </button>
      ))}
    </aside>
  );
};
