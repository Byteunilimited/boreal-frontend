import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginBoreal,  UserAndRols, Dashboard, DepartmentsAndCities, Equipment, Bills, Procedures, Offices,  Inventory, Store } from "../Pages";
import { BaseSideBar, Error404 } from "../Layouts";
import { useAuth } from "../Contexts";
import Profile from "../Pages/Profile/ProfileIndex/Profile";
import Owners from "../Pages/Owners/ownersIndex/Owners";


export const Router = () => {
  const { isAutenticated } = useAuth();
  const Protected = ({ element }) => {
    switch (true) {
      case !isAutenticated():
        return <Navigate to="/boreal/login" />;
      default:
        return <BaseSideBar>{element}</BaseSideBar>;
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
            element={<Protected element={<Dashboard />} />}
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
        <Route path="*" element={<Protected element={<Error404 />} />}
        />

      </Routes>
    </BrowserRouter>
  );
}


