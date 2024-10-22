import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./Dashboard.css";
import { useAuth } from "../../../Contexts";

const yearlyData = [
  { year: "2019", valor: 310 },
  { year: "2020", valor: 330 },
  { year: "2021", valor: 280 },
  { year: "2022", valor: 320 },
  { year: "2023", valor: 350 },
];

const barData = [
  { name: "Servicio A", valor: 450 },
  { name: "Servicio B", valor: 320 },
  { name: "Servicio C", valor: 210 },
  { name: "Servicio D", valor: 150 },
];

// Colores degradados para cada barra
const gradientColors = [
  { start: "#67D5B5", end: "#1C8EF3" }, // 2019
  { start: "#58C9B9", end: "#1186E6" }, // 2020
  { start: "#4BA6D2", end: "#0B67C1" }, // 2021
  { start: "#348DC4", end: "#0952A3" }, // 2022
  { start: "#2A6FA8", end: "#073D84" }, // 2023
];

export const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState("2023");
  const { user } = useAuth();
  
  useEffect(() => {
    document.title = "Panel";
  }, []);

  return (
    <div className="contentMain">
      <div className="welcomeBanner">
        <div className="welcomeText">
          <h2>Bienvenido de nuevo a tu</h2>
          <h1>Administrador de tareas diarias</h1>
        </div> 
      </div>
      <div className="chartContainer">
        <div className="chartItem">
          <h4>Valor por año</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={yearlyData}
              margin={{ top: 20, right: 50, left: 20, bottom: 5 }}
            >
              <defs>
                {yearlyData.map((entry, index) => (
                  <linearGradient
                    id={`colorUv${index}`}
                    key={index}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={gradientColors[index].start} />
                    <stop offset="100%" stopColor={gradientColors[index].end} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="valor"
                fillOpacity={1}
                shape={<CustomBar />}
                barSize={35}
                radius={[10, 10, 0, 0]} // Solo bordes superiores redondeados
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Segunda gráfica: Barras por servicio */}
        <div className="chartItem">
          <h4>Distribución por servicio</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="valor"
                fill="#8884d8"
                barSize={35}
                radius={[10, 10, 0, 0]} // Solo bordes superiores redondeados
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Custom Bar component for rounded and modern bars (Primera gráfica)
const CustomBar = (props) => {
  const { x, y, width, height, index, payload } = props; // Ajuste en props
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={10} // Borde superior redondeado
        ry={10} // Borde superior redondeado
        fill={`url(#colorUv${index})`} // Degradado aplicado a cada barra
      />
      
      <circle cx={x + width / 2} cy={y - 10} r={15} fill="#fff" />
      <text
        x={x + width / 2}
        y={y - 5}
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight="bold"
        fill="#333"
      >
        {payload.valor}
      </text>
    </g>
  );
};
