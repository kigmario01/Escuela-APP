"use client";
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AsistenciaChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(d => {
      setData(d.asistenciaMensual || [
        { name: 'Ene', presentes: 400, ausentes: 24, retardos: 24 },
        { name: 'Feb', presentes: 300, ausentes: 13, retardos: 22 },
        { name: 'Mar', presentes: 200, ausentes: 98, retardos: 29 },
      ]);
    });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="presentes" fill="#10b981" name="Presentes" />
        <Bar dataKey="ausentes" fill="#ef4444" name="Ausentes" />
        <Bar dataKey="retardos" fill="#eab308" name="Retardos" />
      </BarChart>
    </ResponsiveContainer>
  );
}
