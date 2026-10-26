import { Outlet } from "react-router-dom";
import Header from "./Header";

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
      <main className="flex-1">
        {/* Aquí React Router renderiza dinámicamente las páginas hijas */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;