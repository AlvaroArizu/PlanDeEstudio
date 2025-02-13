import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Network } from "vis-network";
import Modal from "react-modal";
import "../assets/styles/global.css";

Modal.setAppElement("#root");

const DiagramNodos = () => {
  const { carrera } = useParams();
  const networkContainer = useRef(null);
  const modalNetworkContainer = useRef(null);
  const [planDeEstudio, setPlanDeEstudio] = useState(null);
  const [selectedMateria, setSelectedMateria] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    import(`../data/${carrera}.json`)
      .then((data) => setPlanDeEstudio(data.default))
      .catch((error) => console.error("Error cargando el plan de estudio:", error));
  }, [carrera]);

  useEffect(() => {
    if (!planDeEstudio) return;

    const nodes = [];
    const edges = [];

    Object.entries(planDeEstudio).forEach(([anio, materias]) => {
      if (!Array.isArray(materias)) return; // Evitar errores si materias no es un array

      materias.forEach((materia) => {
        let colorFondo = "#D2E5FF"; // Default
        if (materia.duracion === "CU1") colorFondo = "#A0C4FF"; // Primer Cuatrimestre
        else if (materia.duracion === "CU2") colorFondo = "#FFA07A"; // Segundo Cuatrimestre
        else if (materia.duracion === "CU") colorFondo = "#FFD700"; // Cursada Única
        else if (materia.duracion === "AN") colorFondo = "#90EE90"; // Anual

        nodes.push({
          id: materia.codigo,
          label: `${materia.codigo}\n${materia.asignatura}\n${formatYear(anio)} - ${materia.duracion}`,
          shape: "box",
          color: {
            background: colorFondo,
            border: "#2B7CE9",
            highlight: { background: "#FFD700", border: "#FF5733" }
          },
          font: { color: "#333", size: 14, face: "Arial" },
          margin: 10,
          anio
        });

        materia.correlativas.forEach((correlativa) => {
          // Extraer solo los números, eliminando (A), (R) y caracteres no numéricos
          const correlativaCode = correlativa.replace(/\D/g, "").trim(); 

          // Verificar si realmente existe la materia en el plan de estudios
          const correlativaExiste = Object.values(planDeEstudio)
            .filter(materias => Array.isArray(materias)) // Asegurar solo listas de materias
            .flat()
            .some((m) => m.codigo.toString() === correlativaCode);

          if (correlativaCode && correlativaExiste) {
            edges.push({
              from: parseInt(correlativaCode, 10),
              to: materia.codigo,
              color: { color: "#FF5733" },
              arrows: { to: { enabled: true, scaleFactor: 1.2 } },
              width: 2
            });
          }
        });
      });
    });

    const data = { nodes, edges };
    const options = {
      layout: { hierarchical: false },
      physics: {
        enabled: true,
        solver: "forceAtlas2Based",
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springLength: 200,
          springConstant: 0.08
        },
        stabilization: { enabled: true, iterations: 2000 }
      },
      interaction: {
        zoomView: true,
        dragView: true,
        hover: true,
        tooltipDelay: 200
      }
    };

    const network = new Network(networkContainer.current, data, options);

    network.on("click", (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const selected = nodes.find((node) => node.id === nodeId);
        setSelectedMateria(selected);
        generateMiniFlow(nodeId, nodes, edges);
        setModalVisible(true);
      }
    });

    return () => network.destroy();
  }, [planDeEstudio]);


  const generateMiniFlow = (codigo, allNodes, allEdges) => {
    const relatedEdges = allEdges.filter((edge) => edge.from === codigo || edge.to === codigo);
    const relatedNodesIds = [...new Set(relatedEdges.flatMap((edge) => [edge.from, edge.to]))];
    const filteredNodes = allNodes.filter((node) => relatedNodesIds.includes(node.id));

    const selectedMateria = filteredNodes.find((node) => node.id === codigo);
    if (selectedMateria) {
      const selectedYear = extractYear(selectedMateria.anio);

      filteredNodes.forEach((node) => {
        const nodeYear = extractYear(node.anio);

        if (node.id === selectedMateria.id) {
          node.color = { background: "#A0C4FF", border: "#3D5A80" };
        } else if (nodeYear < selectedYear) {
          node.color = { background: "#4CAF50", border: "#2E7D32" };
        } else if (nodeYear > selectedYear) {
          node.color = { background: "#FFA500", border: "#FF6F00" };
        }
      });
    }

    const miniData = { nodes: filteredNodes, edges: relatedEdges };

    setTimeout(() => {
      const options = {
        layout: { hierarchical: false },
        physics: { enabled: false },
        interaction: { dragView: true, zoomView: true }
      };
      new Network(modalNetworkContainer.current, miniData, options);
    }, 100);
  };

  const formatYear = (anioStr) => {
    const mapping = {
      primerAnio: "Primer Año",
      segundoAnio: "Segundo Año",
      tercerAnio: "Tercer Año",
      cuartoAnio: "Cuarto Año",
      quintoAnio: "Quinto Año"
    };
    return mapping[anioStr] || anioStr;
  };

  const extractYear = (anioStr) => {
    const yearMapping = {
      primerAnio: 1,
      segundoAnio: 2,
      tercerAnio: 3,
      cuartoAnio: 4,
      quintoAnio: 5
    };
    return yearMapping[anioStr] || 0;
  };

  if (!planDeEstudio) return <p>Cargando...</p>;

  return (
    <div>
      <div ref={networkContainer} style={{ height: "800px", border: "1px solid #ddd" }} />

      <Modal
        isOpen={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        contentLabel="Detalle de Asignatura"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        {selectedMateria && (
          <>
            <h3>Detalle de Asignatura</h3>
            <p><strong>Código:</strong> {selectedMateria.id}</p>
            <p><strong>Asignatura:</strong> {selectedMateria.label}</p>
            <div
              id="mini-flow"
              ref={modalNetworkContainer}
              style={{ height: "400px", width: "100%", marginTop: "20px" }}
            />
            <button onClick={() => setModalVisible(false)} style={{ marginTop: "20px" }}>
              Cerrar
            </button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default DiagramNodos;
