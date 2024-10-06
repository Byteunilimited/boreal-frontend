import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Contexts";
import { RiUser3Line, RiLogoutBoxRLine, RiUserShared2Line } from "react-icons/ri";
import './NavBar.css';

export const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, LogOut } = useAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="navBarContainer">
      <div className="profileContainer" onClick={toggleMenu}>
        <RiUser3Line className="profileIcon" />
      </div>
      {menuOpen && (
        <div className="dropdownMenu">
          <ul>
            <li>
              <Link to={"/boreal/perfil"} className="menuItem">
                <RiUserShared2Line  className="menuIcon" />
                Perfil
              </Link>
            </li>
            <li onClick={LogOut} className="menuItem">
              <RiLogoutBoxRLine className="menuIcon" />
              Cerrar sesión
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
