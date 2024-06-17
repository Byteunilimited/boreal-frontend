import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./ValueYearlyChart.css";

const data = [
  { año: "2021", valor: 10000 },
  { año: "2022", valor: 15000 },
  { año: "2023", valor: 20000 },
  { año: "2024", valor: 18000 },
  { año: "2025", valor: 25000 },
];

export const ValueYearlyChart = () => {
  return (
    <div className="chartContainer">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="año" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="valor" fill="#1C68C6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ValueYearlyChart;
