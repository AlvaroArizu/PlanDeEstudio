import React from 'react';

const CardMateria = ({ codigo, asignatura, duracion, horas, correlativas }) => (
  <div className="border rounded-lg p-4 shadow-lg">
    <h2 className="text-xl font-bold">{asignatura}</h2>
    <p><strong>Código:</strong> {codigo}</p>
    <p><strong>Duración:</strong> {duracion}</p>
    <p><strong>Horas:</strong> {horas}</p>
    <p><strong>Correlativas:</strong> {correlativas.length ? correlativas.join(', ') : 'Ninguna'}</p>
  </div>
);

export default CardMateria;
