import { RiListCheck2, RiAdminLine, RiTable2, RiRoadMapLine, RiDashboardHorizontalLine, RiBuilding2Line, RiTableLine} from "react-icons/ri";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "react-feather";
import { BorealLogo } from "../../assets";
import "./Menu.css";

export const Menu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const [activeIndex, setActiveIndex] = useState(null);
    const [prevActiveIndex, setPrevActiveIndex] = useState(null);
    const [nextActiveIndex, setNextActiveIndex] = useState(null);

    const sideBarItems = [
        {
            label: "Administrativo", path: "", icon: <RiListCheck2 />,
            submenu: [
                { label: "Usuarios y roles", path: "/boreal/usuariosYRoles", icon: <RiAdminLine /> },
                { label: "Inventario", path: "/boreal/inventario", icon: <RiTable2 /> },
                { label: "Departamentos y ciudades", path: "/boreal/departamentosYCiudades", icon: <RiRoadMapLine /> },
                { label: "Sucursales", path: "/boreal/sucursales", icon: <RiBuilding2Line /> },
                { label: "Propietarios", path: "/boreal/propietarios", icon: <RiTableLine /> },
                { label: "Bodegas", path: "/boreal/bodegas", icon: <RiDashboardHorizontalLine /> },
            ],
        },
    ];

    const menuActiveHandler = index => {
        setActiveIndex(index);
        setPrevActiveIndex(index - 1);
        setNextActiveIndex(index + 1);
    };

    return (
        <div className='menu'>
            <Link
                to="/boreal/panel"
                onClick={() => menuActiveHandler(-2)}
                className="logoCotainer"
            >
                <img src={BorealLogo} alt="" className="logo" />
            </Link>
            <ul className='menuContainer'>
                {sideBarItems.map((item, index) => (
                    <li key={index} className={item.submenu ? "relative" : ""}>
                        {item.submenu ? (
                            <>
                                <Link className="ToggleMenu" onClick={toggleMenu}>
                                    <span className="icon">{item.icon}</span>
                                    {item.label}
                                    <ChevronDown className="ChevronDown" />
                                </Link>
                                {isMenuOpen && (
                                    <ul className="submenu">
                                        {item.submenu.map((subitem, subindex) => (
                                            <li 
                                                key={subindex}
                                                className={`itemSub ${subindex === prevActiveIndex ? 'prevActive' : subindex === nextActiveIndex ? 'nextActive' : ''}`}
                                            >
                                                <Link
                                                    to={subitem.path}
                                                    onClick={(event) => menuActiveHandler(subindex)}
                                                    className={subindex === activeIndex ? 'active' : ''}
                                                >
                                                    <span className="icon">{subitem.icon}</span>
                                                    {subitem.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        ) : (
                            <Link
                                to={item.path}
                                className={location.pathname === item.path ? "active" : ""}
                            >
                                <span className="icon">{item.icon}</span>
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};
