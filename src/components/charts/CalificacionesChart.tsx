"use client";
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function CalificacionesChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(d => {
      setData(d.calificacionesPorMateria || [
        { materia: 'Matemáticas', promedio: 8.5 },
        { materia: 'Español', promedio: 9.2 },
        { materia: 'Ciencias', promedio: 7.8 },
      ]);
    });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="materia" />
        <YAxis domain={[0, 10]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="promedio" fill="#2563eb" name="Promedio" />
      </BarChart>
    </ResponsiveContainer>
  );
}
