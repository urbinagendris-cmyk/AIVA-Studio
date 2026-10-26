import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import Home from "../pages/Home";
import StudioWorkspace from "../pages/StudioWorkspace";

// Vistas secundarias / temporales
const Login = () => <div className="p-8 text-center text-slate-300">Página de Inicio de Sesión</div>;
const Registro = () => <div className="p-8 text-center text-slate-300">Página de Registro</div>;

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "workspace",
        element: <StudioWorkspace />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "registro",
        element: <Registro />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default AppRouter;