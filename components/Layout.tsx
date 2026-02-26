import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1 lg:px-12 md:px-8 max-md:px-4">{children}</main>
    <Footer />
  </div>
);

export default Layout;
