import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "./navBarApp.css";
import { useContext } from "react";
import { TrioContext } from "../../context/TrioContextProvider";

export const NavBarApp = () => {
  const { user, setUser, setToken } = useContext(TrioContext);
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("token");
    setToken();
    setUser();
    navigate("/");
  };
  const url = `${location.pathname}`;
  const partes = url.split("/");
  const currentPage = partes[1];

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary ">
        <Container fluid="xl">
          <Navbar.Brand as={Link} to={user ? "/allActivities" : "/"}>
            <img className="nav-logo" src={logo} alt="logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-lg`}
            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                Menú
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-start flex-grow-1 pe-3">
              {user?.type === 1 && (
                <Nav
                  variant="underline"
                  defaultActiveKey="/allActivities"
                  className="justify-content-start flex-grow-1 pe-3"
                >
                  <Nav.Link
                    as={Link}
                    to="/admin"
                    className={
                      currentPage === "admin" ? "select-borde" : null
                    }
                  >
                    Panel administrador
                  </Nav.Link>
                </Nav>
              )}
              {user?.type === 2 && (
                <Nav
                  variant="underline"
                  defaultActiveKey="/allActivities"
                  className="justify-content-start flex-grow-1 pe-3"
                >
                  {user && (
                    <Nav.Link
                      as={Link}
                      to="/allActivities"
                      className={
                        currentPage === "allActivities" ? "select-borde" : null
                      }
                    >
                      Actividades
                    </Nav.Link>
                  )}
                  {user && (
                    <Nav.Link
                      as={Link}
                      to="/addActivity"
                      className={
                        currentPage === "addActivity" ? "select-borde" : null
                      }
                    >
                      Crear Actividad
                    </Nav.Link>
                  )}
                  {user && (
                    <Nav.Link
                      as={Link}
                      to="/addSport"
                      className={
                        currentPage === "addSport" ? "select-borde" : null
                      }
                    >
                      Crear Deporte
                    </Nav.Link>
                  )}
                  {user && (
                    <Nav.Link
                      as={Link}
                      to="/allUsers"
                      className={
                        currentPage === "allUsers" ? "select-borde" : null
                      }
                    >
                      Búsqueda
                    </Nav.Link>
                  )}
                  {user && (
                    <Nav.Link
                      as={Link}
                      to="/chats"
                      className={
                        currentPage === "chats" ? "select-borde" : null
                      }
                    >
                      Mensajes
                    </Nav.Link>
                  )}
                  {user && (
                    <Nav.Link
                      as={Link}
                      to="/profile"
                      className={
                        currentPage === "profile" ? "select-borde" : null
                      }
                    >
                      Perfil
                    </Nav.Link>
                  )}
                </Nav>
              )}
              </Nav>
              <Nav className="d-flex">
                {!user ? (
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="trio-outline-btn"
                  >
                    Iniciar Sesión
                  </button>
                ) : (
                  <button
                    type="button"
                    className="trio-outline-btn"
                    onClick={logOut}
                  >
                    Cerrar Sesión
                  </button>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};
