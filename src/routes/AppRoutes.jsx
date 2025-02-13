import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../features/Home";
import CarreraLayout from "../layouts/CarreraLayout"; // Nuevo layout
import PlanDeEstudio from "../features/PlanDeEstudio";
import DiagramNodos from "../features/DiagramNodos";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Grupo de rutas para cada carrera con layout */}
      <Route path="/:carrera/*" element={<CarreraLayout />}>
        <Route path="plan" element={<PlanDeEstudio />} />
        <Route path="diagram-nodos" element={<DiagramNodos />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
