import { RiListCheck2, RiAdminLine, RiTable2, RiRoadMapLine, RiDashboardHorizontalLine, RiBuilding2Line, RiTableLine} from "react-icons/ri";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "react-feather";
import { BorealLogo } from "../../assets";
import "./Menu.css";

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

export const Menu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className='menu'>
            <Link to="/boreal/panel" className="logoCotainer">
                <img src={BorealLogo} alt="" className="logo" />
            </Link>
            <ul>
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
                                            <li className="itemSub" key={subindex}>
                                                <Link
                                                    to={subitem.path}
                                                    className={
                                                        location.pathname === subitem.path ? "active" : ""
                                                    }
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
