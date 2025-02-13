import React from 'react';
import { Link } from 'react-router-dom';
import "../assets/styles/Home.css";

const Home = () => {
  const carreras = [
    { nombre: "Ingeniería en Informática", ruta: "ingenieria-informatica" },
    { nombre: "Licenciatura en Sistemas", ruta: "licenciatura-sistemas" }
  ];

  return (
    <div className="Home-container">
      <h1 className="Home-title">Bienvenido</h1>
      <h2>Selecciona una carrera:</h2>
      <div className="carrera-list">
        {carreras.map((carrera) => (
          <Link key={carrera.ruta} to={`/${carrera.ruta}/plan`} className="carrera-link">
            {carrera.nombre}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
