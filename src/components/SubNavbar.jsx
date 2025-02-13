import React from "react";
import { Link, useParams } from "react-router-dom";
import "../assets/styles/SubNavbar.css";

const SubNavbar = () => {
  const { carrera } = useParams();

  console.log("📢 SubNavbar renderizado para:", carrera); // <-- Verifica si se ejecuta

  if (!carrera) return null; // No renderizar si no hay carrera en la URL

  return (
    <nav className="sub-navbar">
      <ul>
        <li>
          <Link to={`/${carrera}/plan`} className="sub-navbar-link">📖 Plan de Estudio</Link>
        </li>
        <li>
          <Link to={`/${carrera}/diagram-nodos`} className="sub-navbar-link">🔗 Diagrama de Nodos</Link>
        </li>
      </ul>
    </nav>
  );
};

export default SubNavbar;



