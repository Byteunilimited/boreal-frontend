import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Error404 } from "@/Layouts";
import { useAuth } from "../Contexts";
import {Bills} from '../Pages/Bills/BillsIndex/Bills'
import {LoginBoreal} from '../Pages/LoginBoreal/LoginIndex/LoginBoreal'
import {UserAndRols} from '../Pages/UsersAndRols/UsersAndRolsIndex/UserAndRols'
import {Profile} from '../Pages/Profile/ProfileIndex/Profile'
import {Offices} from '@/Pages/offices/OfficcesIndex/Offices'
import {DepartmentsAndCities} from '@/Pages/departmentsAndCities/DepartamentsAndCitiesIndex/DepartmentsAndCities'
import {Inventory} from '../Pages/Inventory/InventoryIndex/Inventory'
import {Equipment} from '../Pages/Equipment/EquipmentIndex/Equipment'
import {Owners} from '../Pages/Owners/ownersIndex/Owners'
import {Procedures} from '../Pages/Procedures/ProceduresIndex/Procedures'
import {Store} from '../Pages/Stores/StoreIndex/Store'
import { Principal } from '@/Pages/Principal/PrincipalIndex/Principal.jsx'
import { Image } from '@/Components/Atoms/Image/Image';
import menuImage from '@/assets/Images/menu.png';

export const Router = () => {
    const { isAutenticated } = useAuth();

    const dashboard = {
        header: {
            style: 'menu',
            action: () => {
                const sidebar = document.querySelector(".sidebar");
                if(sidebar) sidebar.classList.toggle("menuVisible");
            },
            child: <Image props={{style: 'menu', src : menuImage, alt: 'Show Menu'}}/>,
        },
    };

    const Protected = ({ element }) => {
        switch (true) {
            case !isAutenticated():
                return <Navigate to="/boreal/login" />;
            default:
                dashboard['children'] = element;

                (() => {
                    const sidebar = document.querySelector(".sidebar");
                    if(sidebar) sidebar.classList.remove("menuVisible");
                })()

                return <Dashboard props={dashboard} />;
        }
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/boreal/login" />} />
                <Route path="/boreal/login" element={<LoginBoreal />} />
                <Route path="/boreal/panel">
                    <Route
                        path="/boreal/panel"
                        element={<Protected element={<Principal />} />}
                    />
                </Route>

                <Route path="/boreal/usuariosYRoles">
                    <Route
                        path="/boreal/usuariosYRoles"
                        element={<Protected element={<UserAndRols />} />}
                    />
                </Route>

                <Route path="/boreal/perfil">
                    <Route
                        path="/boreal/perfil"
                        element={<Protected element={<Profile />} />}
                    />
                </Route> 

                <Route path="/boreal/sucursales">
                    <Route
                        path="/boreal/sucursales"
                        element={<Protected element={<Offices />} />}
                    />
                </Route>

                <Route path="/boreal/propietarios">
                    <Route
                        path="/boreal/propietarios"
                        element={<Protected element={<Owners />} />}
                    />
                </Route>

                <Route path="/boreal/inventario">
                    <Route
                        path="/boreal/inventario"
                        element={<Protected element={<Inventory />} />}
                    />
                </Route>

                <Route path="/boreal/departamentosYCiudades">
                    <Route
                        path="/boreal/departamentosYCiudades"
                        element={<Protected element={<DepartmentsAndCities />} />}
                    />
                </Route>

                <Route path="/boreal/bodegas">
                    <Route
                        path="/boreal/bodegas"
                        element={<Protected element={<Store />} />}
                    />
                </Route>

                <Route path="/boreal/equipos">
                    <Route
                        path="/boreal/equipos"
                        element={<Protected element={<Equipment />} />}
                    />
                </Route>
                
                <Route path="/boreal/procedimientos">
                    <Route
                        path="/boreal/procedimientos"
                        element={<Protected element={<Procedures />} />}
                    />
                </Route>

                <Route path="/boreal/facturas">
                    <Route
                        path="/boreal/facturas"
                        element={<Protected element={<Bills />} />}
                    />
                </Route>

                <Route path="*" element={<Protected element={<Error404 />} />} />
            </Routes>
        </BrowserRouter>
    );
}


