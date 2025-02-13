import React from 'react';
import { Link, useParams } from 'react-router-dom';
import "../assets/styles/NavBar.css";

const Navbar = () => {
  const { carrera } = useParams();

  return (
    <nav className="bg-blue-600 text-white p-4">
      <ul className="flex space-x-4">
        <li><Link to="/">Inicio</Link></li>
        
      </ul>
    </nav>
  );
};

export default Navbar;
