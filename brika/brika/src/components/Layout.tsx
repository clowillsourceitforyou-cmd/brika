import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementBar from "./AnnouncementBar";
import CartDrawer from "./CartDrawer";

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
