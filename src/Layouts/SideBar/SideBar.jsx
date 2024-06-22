import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "react-feather";
import "./SideBar.css";
import {BorealLogo} from "../../assets";
import {RiListCheck2,RiFileListLine,RiLoginBoxLine,RiAdminLine,RiParentLine,RiTable2,RiRoadMapLine,
  RiAlignItemHorizontalCenterLine,RiCaravanLine,RiDashboardHorizontalLine,RiFileCopy2Line,RiDashboardLine
} from "react-icons/ri";
import { useAuth } from "../../Contexts";

const sideBarItems = [
  {
    label: "Panel",
    path: "/boreal/panel",
    icon: <RiDashboardLine />,
  },
  /*{
    label: "Informe técnico",
    path: "/boreal/informe",
    icon: <RiFileListLine />,
  },*/
  /*{
    label: "Facturas",
    path: "/boreal/facturas",
    icon: <RiFileCopy2Line />,
  },*/
  {
    label: "Administrativo",
    path: "",
    icon: <RiListCheck2 />,
    submenu: [
      {
        label: "Usuarios y roles",
        path: "/boreal/usuariosYRoles",
        icon: <RiAdminLine />,
      },
      /*{ label: "Clientes", path: "/boreal/clientes", icon: <RiParentLine /> },*/
      {
        label: "Inventario",
        path: "/boreal/inventario",
        icon: <RiTable2 />,
      },
      {
        label: "Departamentos y ciudades",
        path: "/boreal/departamentosYCiudades",
        icon: <RiRoadMapLine />,
      },
      {
        label: "Procedimientos",
        path: "/boreal/procedimientos",
        icon: <RiAlignItemHorizontalCenterLine />,
      },
      { label: "Equipos", path: "/boreal/equipos", icon: <RiCaravanLine /> },
      { label: "Bodegas", path: "/boreal/bodegas", icon: <RiDashboardHorizontalLine /> },,
    ],
  },
];

export const Sidebar = () => {
  const { LogOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="sidebar">
      <div >
      <Link to="/boreal/panel">
          <img src={BorealLogo} alt="" className="imgLogo" />
        </Link>
        <ul >
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
                          <Link to={subitem.path} active className="active">
                            <span className="icon">{subitem.icon}</span>
                            {subitem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link to={item.path} className="menuItem active">
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
          <li>
            <Link className="menuItem" onClick={LogOut}>
              <span className="icon">
                <RiLoginBoxLine />
              </span>
              Salir
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
