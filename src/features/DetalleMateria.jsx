import React from 'react';
import { useParams } from 'react-router-dom';
import planDeEstudio from '../data/planDeEstudio.json';

const DetalleMateria = () => {
  const { codigo } = useParams();
  const materia = Object.values(planDeEstudio).flat().find(m => m.codigo === parseInt(codigo));

  if (!materia) {
    return <p>Materia no encontrada</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{materia.asignatura}</h1>
      <p><strong>Código:</strong> {materia.codigo}</p>
      <p><strong>Duración:</strong> {materia.duracion}</p>
      <p><strong>Horas:</strong> {materia.horas}</p>
      <p><strong>Correlativas:</strong> {materia.correlativas.length ? materia.correlativas.join(', ') : 'Ninguna'}</p>
    </div>
  );
};

export default DetalleMateria;
