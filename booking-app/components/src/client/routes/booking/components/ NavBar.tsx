// components/NavBar.tsx
import React, { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DatabaseContext } from "../../components/Provider";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { PagePermission } from "@/components/src/types";

const NavBar: React.FC = () => {
  const { pagePermission } = useContext(DatabaseContext);
  const router = useRouter();

  const isActive = (pathname: string) => router.pathname === pathname;

  return (
    <Navbar expand="md" className="bg-body-tertiary z-10">
      <Container fluid>
        <Navbar.Brand>
          <Link href="/">
            <a className={isActive("/") ? "active nav-link" : "nav-link"}>
              Media Commons Booking
            </a>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Item>
              <Link href="/my-bookings">
                <a
                  className={
                    isActive("/my-bookings") ? "active nav-link" : "nav-link"
                  }
                >
                  My Bookings
                </a>
              </Link>
            </Nav.Item>
            {pagePermission === PagePermission.ADMIN && (
              <Nav.Item>
                <Link href="/admin">
                  <a
                    className={
                      isActive("/admin") ? "active nav-link" : "nav-link"
                    }
                  >
                    Admin
                  </a>
                </Link>
              </Nav.Item>
            )}
            {(pagePermission === PagePermission.ADMIN ||
              pagePermission === PagePermission.PA) && (
              <Nav.Item>
                <Link href="/pa">
                  <a
                    className={isActive("/pa") ? "active nav-link" : "nav-link"}
                  >
                    PA
                  </a>
                </Link>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
