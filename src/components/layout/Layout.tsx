import { useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import logo from "../../../assets/Images/logo.png";
import { BackToTop } from "../BackToTop";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useEffect(() => {
    // Update title
    document.title = "Uttarakhand Netra Hospital";

    // Update favicon
    const link = (document.querySelector("link[rel*='icon']") as HTMLLinkElement) || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'shortcut icon';
    link.href = logo;
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-28">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
