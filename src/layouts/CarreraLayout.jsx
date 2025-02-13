import React from "react";
import { Outlet, useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import SubNavbar from "../components/SubNavbar";

const CarreraLayout = () => {
  const { carrera } = useParams();

  return (
    <>
      <Navbar />
      {carrera && <SubNavbar />} {/* ⬅️ SubNavbar aparece solo dentro de una carrera */}
      <main className="flex-grow">
        <Outlet /> {/* ⬅️ Aquí se renderizan PlanDeEstudio o DiagramNodos */}
      </main>
    </>
  );
};

export default CarreraLayout;
