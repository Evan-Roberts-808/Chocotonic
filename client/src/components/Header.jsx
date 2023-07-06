import React, { useState, useContext } from "react";
import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import UserContext from "../context/UserContext";

function Header() {
  const { user, setUser } = useContext(UserContext);
  const [isShopOpen, setShopOpen] = useState(false);
  const [isAboutOpen, setAboutOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  const handleMouseEnterShop = () => {
    setShopOpen(true);
  };

  const handleMouseLeaveShop = () => {
    setShopOpen(false);
  };

  const handleMouseEnterAbout = () => {
    setAboutOpen(true);
  };

  const handleMouseLeaveAbout = () => {
    setAboutOpen(false);
  };

  const handleMouseEnterProfile = () => {
    setProfileOpen(true);
  };

  const handleMouseLeaveProfile = () => {
    setProfileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "same-origin",
      });
      setUser(null); // Clear the user context after successful logout
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar expand="lg">
      <Container>
        {user ? (
          <>
            <Navbar.Brand>
              <Link to="/">
                <img
                  className="logo"
                  alt="Chocotonic Logo"
                  src="https://raw.githubusercontent.com/Evan-Roberts-808/Capstone/e119a8f5571e8cb5786ec0f3f7305594a9d4393d/.github/images/logo/Chocotonic.svg"
                />
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="custom-header justify-content-end">
                <NavDropdown
                  title="Shop"
                  id="nav-dropdown"
                  show={isShopOpen}
                  onMouseEnter={handleMouseEnterShop}
                  onMouseLeave={handleMouseLeaveShop}
                >
                  <NavDropdown.Item>Shop All</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <div className="category-label">
                    <span>Shop by Category</span>
                  </div>
                  <NavDropdown.Item>Chocolate Bars</NavDropdown.Item>
                  <NavDropdown.Item>Chocolate Bells</NavDropdown.Item>
                  <NavDropdown.Item>Chocolate Squares</NavDropdown.Item>
                  <NavDropdown.Item>Hot Chocolate</NavDropdown.Item>
                  <NavDropdown.Item>Chocolate Truffles</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title="About Us"
                  id="nav-dropdown"
                  show={isAboutOpen}
                  onMouseEnter={handleMouseEnterAbout}
                  onMouseLeave={handleMouseLeaveAbout}
                >
                  <NavDropdown.Item>About Us</NavDropdown.Item>
                  <NavDropdown.Item>Sustainability</NavDropdown.Item>
                  <NavDropdown.Item>Causes</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title="Profile"
                  id="nav-dropdown"
                  show={isProfileOpen}
                  onMouseEnter={handleMouseEnterProfile}
                  onMouseLeave={handleMouseLeaveProfile}
                >
                  <NavDropdown.Item>View Profile</NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
            <div className="shopping-cart-container">
              <AiOutlineShoppingCart className="shopping-cart" />
            </div>
          </>
        ) : (
          <>
            <Navbar.Brand>
              <Link to="/">
                <img
                  className="logo"
                  alt="Chocotonic Logo"
                  src="https://raw.githubusercontent.com/Evan-Roberts-808/Capstone/e119a8f5571e8cb5786ec0f3f7305594a9d4393d/.github/images/logo/Chocotonic.svg"
                />
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="custom-header justify-content-end">
                <NavDropdown
                  title="Shop"
                  id="nav-dropdown"
                  show={isShopOpen}
                  onMouseEnter={handleMouseEnterShop}
                  onMouseLeave={handleMouseLeaveShop}
                >
                  <NavDropdown.Item>Shop All</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <div className="category-label">
                    <span>Shop by Category</span>
                  </div>
                  <NavDropdown.Item>Chocolate Bars</NavDropdown.Item>
                  <NavDropdown.Item>Chocolate Bells</NavDropdown.Item>
                  <NavDropdown.Item>Chocolate Squares</NavDropdown.Item>
                  <NavDropdown.Item>Hot Chocolate</NavDropdown.Item>
                  <NavDropdown.Item>Chocolate Truffles</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  title="About Us"
                  id="nav-dropdown"
                  show={isAboutOpen}
                  onMouseEnter={handleMouseEnterAbout}
                  onMouseLeave={handleMouseLeaveAbout}
                >
                  <NavDropdown.Item>About Us</NavDropdown.Item>
                  <NavDropdown.Item>Sustainability</NavDropdown.Item>
                  <NavDropdown.Item>Causes</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link as={Link} to="/signup">
                  Sign Up
                </Nav.Link>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
            <div className="shopping-cart-container">
              <AiOutlineShoppingCart className="shopping-cart" />
            </div>
          </>
        )}
      </Container>
    </Navbar>
  );
}

export default Header;
