import { useState, useRef } from 'react';

/**
 * Custom hook to manage mindmap state
 */
export const useMindmapState = () => {
  // Initial nodes data
  const [nodes, setNodes] = useState([
    { id: 1, text: 'Museo e area archeologica di Sant\'Antioco', x: 50, y: 50, color: '#e8f5e9', icon: '🏛️' },
    { id: 2, text: 'Isola di Sant\'Antioco', x: 20, y: 45, color: '#e0f7fa', icon: '🏝️' },
    { id: 3, text: 'Via Sabatino Moscati', x: 20, y: 65, color: '#e0f7fa', icon: '📍' },
    { id: 4, text: 'Ubicazione e siti', x: 35, y: 80, color: '#e0f7fa', icon: '🗺️' },
    { id: 5, text: 'Storia e cronologia', x: 80, y: 55, color: '#e8eaf6', icon: '📜' },
    { id: 6, text: 'Sulky / Sulci', x: 80, y: 30, color: '#e8eaf6', icon: '🏺' },
    { id: 7, text: 'Percorso e fruizione', x: 50, y: 70, color: '#fff3e0', icon: '🚶' },
    { id: 8, text: 'Significato e dibattiti', x: 65, y: 70, color: '#ffebee', icon: '💡' },
    { id: 9, text: 'Valore didattico', x: 76, y: 85, color: '#ffebee', icon: '📚' },
    { id: 10, text: 'Reperti e decorazioni', x: 40, y: 30, color: '#fce4ec', icon: '💎' },
    { id: 11, text: 'Strutture e siti', x: 60, y: 30, color: '#e8eaf6', icon: '🏗️' },
    { id: 12, text: 'Plastico e ricostruzioni', x: 30, y: 15, color: '#fce4ec', icon: '🎨' },
    { id: 13, text: 'Inaugurazione museo 2006', x: 70, y: 10, color: '#e8eaf6', icon: '🎉' }
  ]);

  // Initial connections data
  const [connections, setConnections] = useState([
    { from: 1, to: 2, label: 'ubicazione' },
    { from: 1, to: 3, label: 'resti' },
    { from: 1, to: 4, label: 'ubicazione' },
    { from: 1, to: 5, label: 'contesto' },
    { from: 1, to: 6, label: 'nome storico' },
    { from: 1, to: 7, label: 'fruizione' },
    { from: 1, to: 8, label: 'importanza' },
    { from: 1, to: 10, label: 'reperti' },
    { from: 1, to: 11, label: 'struttura' },
    { from: 2, to: 3, label: 'indirizzo' },
    { from: 5, to: 6, label: 'periodo' },
    { from: 8, to: 9, label: 'valore' },
    { from: 10, to: 12, label: 'allestimento' },
    { from: 11, to: 13, label: 'apertura' }
  ]);

  // UI state
  const [draggedNode, setDraggedNode] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [editingConnection, setEditingConnection] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [draggingConnection, setDraggingConnection] = useState(null);
  const [connectionTarget, setConnectionTarget] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Zoom and pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Refs
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const justDraggedRef = useRef(false);

  return {
    // Data
    nodes,
    setNodes,
    connections,
    setConnections,
    
    // UI state
    draggedNode,
    setDraggedNode,
    editingNode,
    setEditingNode,
    selectedNode,
    setSelectedNode,
    hoveredNode,
    setHoveredNode,
    editingConnection,
    setEditingConnection,
    selectedConnection,
    setSelectedConnection,
    draggingConnection,
    setDraggingConnection,
    connectionTarget,
    setConnectionTarget,
    offset,
    setOffset,
    
    // Zoom/Pan
    zoom,
    setZoom,
    pan,
    setPan,
    isPanning,
    setIsPanning,
    panStart,
    setPanStart,
    
    // Refs
    canvasRef,
    svgRef,
    justDraggedRef
  };
};
