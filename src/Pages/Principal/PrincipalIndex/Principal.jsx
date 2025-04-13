import { useEffect } from "react";
import { Button } from "../../../Components";
import { Link } from "react-router-dom";
import { imgDashboard } from "../../../assets";
import "./Principal.css";

export const Principal = () => {
    useEffect(() => {
        document.title = "Panel";
    }, []);

    return (
        <div className="principarContainer">
            <div className="welcomeBanner">
                <div className="welcomeText">
                    <h2>Bienvenido a tu</h2>
                    <h1>Administrador de tareas diarias</h1>
                </div>
            </div>
            <div className="content">
                <img src={imgDashboard} alt="Ilustración inventario" className="image" />
                <div className="message">
                    <h2>Consulta y gestiona tu inventario al instante. Mantén el control y optimiza cada movimiento de tus productos.</h2>
                    <Link className="dashboardButton" to="/boreal/inventario"><Button text="Ver inventario" /></Link>
                </div>
            </div>
        </div>
    );
};
