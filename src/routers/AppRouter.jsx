import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../Components/MainLayout";
import StudioWorkspace from "../pages/StudioWorkspace";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import RecuperarPassword from "../pages/RecuperarPassword";
import RestablecerPassword from "../pages/RestablecerPassword";

const RedirectLoggedIn = ({children}) => 
  localStorage.getItem("aiva_token") && localStorage.getItem("aiva_user_id")
    ? <Navigate to="/workspace" replace />
    : children;

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/workspace" replace/>,
      },
      {
        path: "workspace",
        element: <StudioWorkspace />,
      },
      {
        path: "login",
        element: <RedirectLoggedIn ><Login /></RedirectLoggedIn>,
      },
          {
        path: "registro",
        element: <RedirectLoggedIn ><Registro /></RedirectLoggedIn>,
      },
      { path: "recuperar-password", 
        element: <RecuperarPassword /> 
      },
      { path: "restablecer-password", 
        element: <RestablecerPassword /> 
      },
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
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default AppRouter;