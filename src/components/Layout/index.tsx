import { Outlet } from "react-router-dom";
import Header from "./Header/index";
import Footer from "./Footer/index";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      <Header />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />

    </div>
  );
}
