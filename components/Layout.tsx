import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => (
	<div className="app-shell flex min-h-screen flex-col px-4 md:px-8 lg:px-12">
		<Header />
		<main className="app-main flex-1">{children}</main>
		<Footer />
	</div>
);

export default Layout;
