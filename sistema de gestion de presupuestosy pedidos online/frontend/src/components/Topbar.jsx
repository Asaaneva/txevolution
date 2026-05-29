import React from "react";

export const Topbar = ({ user }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-8 backdrop-blur-md bg-white/80 sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-400">Ruta /</span>
        <span className="text-xs font-semibold text-slate-700">Dashboard</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-semibold text-slate-800">{user.name}</p>
          <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
          {user.initials}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
