import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import StudioWorkspace from "../pages/StudioWorkspace";

// Si aún no has creado Login o Registro, dejamos vistas placeholder temporales:
const Login = () => <div className="p-8 text-center">Página de Inicio de Sesión</div>;
const Registro = () => <div className="p-8 text-center">Página de Registro</div>;

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
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