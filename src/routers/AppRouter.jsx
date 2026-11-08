import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import Home from "../pages/Home";
import StudioWorkspace from "../pages/StudioWorkspace";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import RecuperarPassword from "../pages/RecuperarPassword";
import RestablecerPassword from "../pages/RestablecerPassword";

const AppRouter = createBrowserRouter([
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
      { path: "recuperar-password", 
        element: <RecuperarPassword /> 
      },
      { path: "restablecer-password", 
        element: <RestablecerPassword /> 
      },
      {
        path: "registro",
        element: <Registro />,
      },
      // Enlaces del Aside / Header que dirigen al espacio de trabajo
      {
        path: "proyectos",
        element: <StudioWorkspace />,
      },
      {
        path: "modelos",
        element: <StudioWorkspace />,
      },
      {
        path: "creditos",
        element: <StudioWorkspace />,
      },
      {
        path: "preferencias",
        element: <StudioWorkspace />,
      },
      // Redirección para cualquier ruta no encontrada
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default AppRouter;