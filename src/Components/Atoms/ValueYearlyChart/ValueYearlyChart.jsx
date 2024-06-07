import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { year: "2021", value: 10000 },
  { year: "2022", value: 15000 },
  { year: "2023", value: 20000 },
  { year: "2024", value: 18000 },
  { year: "2025", value: 25000 },
];

export const ValueYearlyChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

