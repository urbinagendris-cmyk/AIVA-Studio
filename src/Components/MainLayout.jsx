import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Aside from "./Aside";
import Footer from "./Footer";

const WORKSPACE_ROUTES = ["/workspace", "/proyectos", "/modelos", "/creditos", "/preferencias"];
const AUTH_ROUTES = ["/login", "/registro", "/recuperar-password", "/restablecer-password"];

export const MainLayout = () => {
  const { pathname } = useLocation();

  // El workspace trae su propio layout
  if (WORKSPACE_ROUTES.includes(pathname)) {
    return <Outlet />;
  }

  // Pantallas de acceso: solo el panel, sin menús
  if (AUTH_ROUTES.includes(pathname)) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <Outlet />
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
      <div className="flex flex-1">
        <Aside />
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;