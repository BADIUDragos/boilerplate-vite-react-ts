import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Container } from "react-bootstrap";

import Idle from "idle-js"

import { useLogoutMutation, useTokens } from "../store";
import { useEffect } from "react";

const Layout: React.FC = () => {

  const [blacklistToken] = useLogoutMutation();
  const tokens = useTokens();

  useEffect(() => {
    if (tokens) {
      const idle = new Idle({
        idle: 900000,
        onIdle: async () => {
          if (tokens) {
            blacklistToken({ refresh: tokens.refresh });
          }
        },
        events: ["mousemove", "keydown", "mousedown"],
      });

      idle.start();

      return () => {
        idle.stop();
      };
    }
  }, [blacklistToken, tokens]);

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
