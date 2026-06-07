import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import PortfolioForm from "../components/admin/PortfolioForm";
import PortfolioCard from "../components/admin/PortfolioCard"; // 🌟 Importamos tu nueva Card unificada

export const PortfolioPage = () => {
  const [isOpen, setIsOpen] = useState(true);

  const [proyectos, setProyectos] = useState([
    { 
      id: 1, 
      titulo: "Zapatos Oxford Legítimos", 
      categoria_principal: "cuero", 
      subcategoria: "zapatos", 
      modelo_tipo: "Casuales", 
      genero: "Caballero",
      descripcion: "Cuero curtido de alta resistencia con costura reforzada a mano.", 
      imagen_url: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400" 
    },
    { 
      id: 2, 
      titulo: "Tapizado Asiento Moto Ninja", 
      categoria_principal: "tapiceria", 
      subcategoria: "motos", 
      modelo_tipo: "Deportivas / Racing", 
      genero: "",
      precio: "$75.00", 
      descripcion: "Material antideslizante sintético de alto agarre, impermeable y térmico.", 
      imagen_url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400" 
    }
  ]);

  const [editingProject, setEditingProject] = useState(null);

  const tipografiaEstetica = {
    fontFamily: '"Google Sans", roboto, "Noto Sans Myanmar UI", "Noto Sans Khmer", arial, sans-serif'
  };

  const handleSaveProject = (projectData) => {
    if (editingProject) {
      setProyectos((prev) => prev.map((p) => (p.id === editingProject.id ? { ...p, ...projectData } : p)));
      setEditingProject(null);
    } else {
      setProyectos((prev) => [{ ...projectData, id: Date.now() }, ...prev]);
    }
  };

  const handleDeleteProject = (id) => {
    if (window.confirm("¿Deseas remover este elemento de la vitrina?")) {
      setProyectos((prev) => prev.filter((p) => p.id !== id));
      if (editingProject?.id === id) setEditingProject(null);
    }
  };

  return (
    <div style={tipografiaEstetica} className="flex h-screen w-full bg-[#f4f4f4] overflow-hidden relative selection:bg-stone-200">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className={`flex-1 flex flex-col overflow-y-auto transition-all duration-300 ${isOpen ? "md:pl-64" : "md:pl-0"}`}>
        
        <header className="w-full bg-[#642121] border-b border-stone-200/80 px-6 py-4 flex items-center justify-between text-white font-sans " style={{border:"1px solid rgba(221, 221, 221, 0.64)",fontSize:"14px", fontWeight:"400"}}>
          {!isOpen ? (
            <button
              onClick={() => setIsOpen(true)}
              className="px-3 py-1.5 text-stone/40 bg-stone-50 hover:bg-stone-100 border border-stone/5 rounded-lg text-xs font-medium transition-all duration-200 active:scale-95 cursor-pointer"
            >
              ☰ Abrir Panel
            </button>
          ) : <div className="w-6 h-6 hidden md:block" />}
          <span className="text-[11px] text-stone-400 font-bold uppercase tracking-widest">Vitrina Administrativa</span>
        </header>

        <main className="p-6 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Columna de Controles */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h1 className="text-xl font-bold text-stone-900 tracking-tight">Gestión de Catálogo</h1>
            </div>
            <PortfolioForm 
              onSave={handleSaveProject} 
              currentProject={editingProject} 
              onCancelEdit={() => setEditingProject(null)} 
            />
          </div>

          {/* Columna del Catálogo Reutilizable */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Modelos Registrados ({proyectos.length})
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {proyectos.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-stone-200 bg-white rounded-xl text-xs text-stone-400">
                  La vitrina está vacía temporalmente.
                </div>
              ) : (
                // 🌟 Mapeo ultralimpio delegando el renderizado al nuevo componente modular
                proyectos.map((proyecto) => (
                  <PortfolioCard 
                    key={proyecto.id} 
                    proyecto={proyecto} 
                    onEdit={setEditingProject} 
                    onDelete={handleDeleteProject} 
                  />
                ))
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default PortfolioPage;