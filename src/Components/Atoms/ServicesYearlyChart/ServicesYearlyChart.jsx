import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./ServicesYearlyChart.css";

const data = [
  { year: "2021", servicios: 100 },
  { year: "2022", servicios: 150 },
  { year: "2023", servicios: 200 },
  { year: "2024", servicios: 180 },
  { year: "2025", servicios: 250 },
];

export const ServicesYearlyChart = () => {
  return (
    <div className="chartContainer">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="servicios" stroke="#1C68C6" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ServicesYearlyChart;
