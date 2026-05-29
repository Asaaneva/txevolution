import React from "react";

export const Header = () => {
  return (
    <header className="main-header">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
          <img src="/logo(3).webp" alt="C3"   className="logo"/>
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="border border-gray-200 rounded-lg px-4 py-1.5 bg-gray-50/50 text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-all">
          Mi cuenta
        </div>
        <span className="text-blue-600 text-lg cursor-pointer" role="img" aria-label="book">📘</span>
      </div>
    </header>
  );
};