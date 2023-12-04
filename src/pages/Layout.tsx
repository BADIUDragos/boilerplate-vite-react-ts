import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Container } from "react-bootstrap";
import { useIdle } from "../functions/hooks/useIdle";

const Layout: React.FC = () => {

  useIdle()

  return (
    <Container fluid className="p-0 d-flex flex-column min-vh-100">
      <Header className="mb-5" />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <hr />
      <Footer />
    </Container>
  );
};

export default Layout;
