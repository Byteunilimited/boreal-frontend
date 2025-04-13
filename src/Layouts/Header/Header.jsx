import { useState } from "react";
import { useAuth } from "../../Contexts";
import { RiUser3Line, RiLogoutBoxRLine } from "react-icons/ri";
import { Button } from '@/Components/Atoms/Button/Button';
import './Header.css';

export const Header = ({ props }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { logOut } = useAuth();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            <Button props={props} />
            <div className="profileContainer" onClick={toggleMenu}>
                <RiUser3Line className="profileIcon" />
            </div>
            {menuOpen && (
                <div className="logOutMenu">
                    <ul>
                        <li onClick={ logOut } className="menuItem">
                            <RiLogoutBoxRLine className="menuIcon" />
                            Cerrar sesión
                        </li>
                    </ul>
                </div>
            )}
        </>
    );
};
