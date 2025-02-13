import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../assets/styles/planDeEstudio.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const PlanDeEstudio = () => {
  const { carrera } = useParams();
  const [planDeEstudio, setPlanDeEstudio] = useState(null);
  const [openYear, setOpenYear] = useState(null);
  const [selectedMateria, setSelectedMateria] = useState(null);
  const [usaCuatrimestres, setUsaCuatrimestres] = useState(false);

  useEffect(() => {
    import(`../data/${carrera}.json`)
      .then((data) => {
        setPlanDeEstudio(data.default);
        // Detectar si el JSON tiene "CU1" o "CU2"
        const tieneCuatrimestres = Object.values(data.default).some(materias =>
          materias.some(materia => materia.duracion === "CU1" || materia.duracion === "CU2")
        );
        setUsaCuatrimestres(tieneCuatrimestres);
      })
      .catch((error) => console.error("Error cargando el plan de estudio:", error));
  }, [carrera]);

  const toggleYear = (year) => {
    setOpenYear(openYear === year ? null : year);
  };

  const obtenerMateriaPorCodigo = (codigo) => {
    const codigoLimpio = codigo.replace(/\(R\)|\(A\)/g, ""); // Elimina (R) y (A)
    
    for (const materias of Object.values(planDeEstudio)) {
      const materiaEncontrada = materias.find((m) => m.codigo.toString() === codigoLimpio);
      if (materiaEncontrada) return materiaEncontrada;
    }
    return null;
  };
  

  const handleClickCorrelativa = (codigo) => {
    const materia = obtenerMateriaPorCodigo(codigo);
    if (materia) setSelectedMateria(materia);
  };

  const formatYear = (anio) => {
    const mapping = {
      primerAnio: "Primer Año",
      segundoAnio: "Segundo Año",
      tercerAnio: "Tercer Año",
      cuartoAnio: "Cuarto Año",
      quintoAnio: "Quinto Año"
    };
    return mapping[anio] || anio;
  };

  if (!planDeEstudio) return <p>Cargando...</p>;

  return (
    <div className="plan-de-estudio-container">
      {Object.entries(planDeEstudio).map(([anio, materias]) => {
        if (usaCuatrimestres) {
          const cu1Materias = materias.filter(m => m.duracion === "CU1");
          const cu2Materias = materias.filter(m => m.duracion === "CU2");

          return (
            <section key={anio} className="year-section">
            <div className="year-header" onClick={() => toggleYear(anio)}>
              <h2>{formatYear(anio)}</h2>
              {openYear === anio ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {openYear === anio && (
              <div className="cuatrimestres-container">
                
                {/* Primer Cuatrimestre (CU1) */}
                <div className="cuatrimestre">
                  <h3>Primer Cuatrimestre (CU1)</h3>
                  <div className="materias-grid">
                    {cu1Materias.map((materia) => (
                      <div key={materia.codigo} className="card-materia">
                        <h3>{materia.asignatura} ({materia.codigo})</h3>
                        <p><strong>Horas:</strong> {materia.horas}h</p>
                        {materia.correlativas.length > 0 ? (
                          <p className="correlativas">
                            <strong>Correlativas:</strong>{" "}
                            {materia.correlativas.map((correlativa, index) => (
                              <span key={index} className="correlativa-link" onClick={() => handleClickCorrelativa(correlativa)}>
                                {correlativa}
                              </span>
                            ))}
                          </p>
                        ) : (
                          <p className="correlativas"><strong>Correlativas:</strong> Ninguna</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Segundo Cuatrimestre (CU2) */}
                <div className="cuatrimestre">
                  <h3>Segundo Cuatrimestre (CU2)</h3>
                  <div className="materias-grid">
                    {cu2Materias.map((materia) => (
                      <div key={materia.codigo} className="card-materia">
                        <h3>{materia.asignatura} ({materia.codigo})</h3>
                        <p><strong>Horas:</strong> {materia.horas}h</p>
                        {materia.correlativas.length > 0 ? (
                          <p className="correlativas">
                            <strong>Correlativas:</strong>{" "}
                            {materia.correlativas.map((correlativa, index) => (
                              <span key={index} className="correlativa-link" onClick={() => handleClickCorrelativa(correlativa)}>
                                {correlativa}
                              </span>
                            ))}
                          </p>
                        ) : (
                          <p className="correlativas"><strong>Correlativas:</strong> Ninguna</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </section>
        );
        } else {
          return (
                <section key={anio} className="study-year">
                  <div className="study-year-header" onClick={() => toggleYear(anio)}>
                    <h2>{formatYear(anio)}</h2>
                    {openYear === anio ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  {openYear === anio && (
                    <div className="subject-list">
                      {materias.map((materia) => (
                        <div key={materia.codigo} className="subject-card">
                          <h3>{materia.asignatura} ({materia.codigo})</h3>
                          <p><strong>Horas:</strong> {materia.horas}h</p>
                          <p><strong>Duración:</strong> {materia.duracion}</p>
                          {materia.correlativas.length > 0 ? (
                            <p className="subject-correlatives">
                              <strong>Correlativas:</strong>{" "}
                              {materia.correlativas.map((correlativa, index) => (
                                <span key={index} className="correlative-link" onClick={() => handleClickCorrelativa(correlativa)}>
                                  {correlativa}
                                </span>
                              ))}
                            </p>
                          ) : (
                            <p className="subject-correlatives"><strong>Correlativas:</strong> Ninguna</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
          );
          
        }
      })}

      {selectedMateria && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedMateria(null)}>&times;</span>
            <h3>{selectedMateria.asignatura} ({selectedMateria.codigo})</h3>
            <p><strong>Horas:</strong> {selectedMateria.horas}h</p>
            <p><strong>Correlativas:</strong> {selectedMateria.correlativas.length > 0 ? selectedMateria.correlativas.join(", ") : "Ninguna"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanDeEstudio;
