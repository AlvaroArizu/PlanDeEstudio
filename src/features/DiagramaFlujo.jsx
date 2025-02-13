import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import planDeEstudio from '../data/planDeEstudio.json';

const DiagramaFlujo = () => {
  const diagramContainer = useRef(null);

  useEffect(() => {
    // Configurar Mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      flowchart: {
        curve: 'linear'
      }
    });

    // Generar el diagrama de flujo dinámico
    let diagramDefinition = 'flowchart LR\n';
    Object.entries(planDeEstudio).forEach(([anio, materias]) => {
      materias.forEach((materia) => {
        const nodeId = materia.codigo;
        const nodeLabel = `${materia.asignatura}`;
        diagramDefinition += `  ${nodeId}["${nodeLabel}"]\n`;

        // Añadir las relaciones de correlativas
        materia.correlativas.forEach((correlativa) => {
          const correlativaCode = correlativa.match(/\d+/)?.[0];
          if (correlativaCode) {
            diagramDefinition += `  ${correlativaCode} --> ${nodeId}\n`;
          }
        });
      });
    });

    // Renderizar el diagrama
    const diagramId = 'diagram-flujo-academico';
    mermaid.render(diagramId, diagramDefinition, (svgCode) => {
      if (diagramContainer.current) {
        diagramContainer.current.innerHTML = svgCode;
      }
    });
  }, []);

  return <div ref={diagramContainer} style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }} />;
};

export default DiagramaFlujo;
