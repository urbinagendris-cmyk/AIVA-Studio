import { Outlet } from "react-router-dom";
import Header from "./Header";
import Aside from "./Aside";
import Footer from "./Footer";

export const MainLayout = () => {
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