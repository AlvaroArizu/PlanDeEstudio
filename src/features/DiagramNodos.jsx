import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Network } from "vis-network";
import Modal from "react-modal";
import "../assets/styles/global.css";

Modal.setAppElement("#root"); // Evita errores de accesibilidad con React Modal

const DiagramNodos = () => {
  const { carrera } = useParams(); // Obtiene la carrera seleccionada desde la URL
  const networkContainer = useRef(null);
  const modalNetworkContainer = useRef(null);
  const [planDeEstudio, setPlanDeEstudio] = useState(null);
  const [selectedMateria, setSelectedMateria] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Cargar el plan de estudio dinámicamente según la carrera seleccionada
  useEffect(() => {
    import(`../data/${carrera}.json`)
      .then((data) => setPlanDeEstudio(data.default))
      .catch((error) => console.error("Error cargando el plan de estudio:", error));
  }, [carrera]);

  useEffect(() => {
    if (!planDeEstudio) return;

    const nodes = [];
    const edges = [];

    // Generar nodos y aristas
    Object.entries(planDeEstudio).forEach(([anio, materias]) => {
      materias.forEach((materia) => {
        nodes.push({
          id: materia.codigo,
          label: `${materia.codigo}\n${materia.asignatura}\nAño: ${formatYear(anio)}, ${materia.duracion}`,
          shape: "box",
          color: {
            background: "#D2E5FF",
            border: "#2B7CE9",
            highlight: { background: "#FFD700", border: "#FF5733" }
          },
          font: { color: "#333", size: 14, face: "Arial" },
          margin: 10,
          anio
        });

        // Agregar correlativas como conexiones en el grafo
        materia.correlativas.forEach((correlativa) => {
          const correlativaCode = parseInt(correlativa.match(/\d+/)?.[0], 10);
          if (correlativaCode) {
            edges.push({
              from: correlativaCode,
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
        stabilization: {
          enabled: true,
          iterations: 2000
        }
      },
      interaction: {
        zoomView: true,
        dragView: true,
        hover: true,
        tooltipDelay: 200
      }
    };

    const network = new Network(networkContainer.current, data, options);

    // Evento para abrir modal al seleccionar un nodo
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

  // Generar diagrama reducido dentro del modal
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

  // Función para formatear correctamente los nombres de los años
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

  // Función auxiliar para extraer el número del año (Ej: "tercerAnio" -> 3)
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
            <p>
              <strong>Código:</strong> {selectedMateria.id}
            </p>
            <p>
              <strong>Asignatura:</strong> {selectedMateria.label}
            </p>
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
