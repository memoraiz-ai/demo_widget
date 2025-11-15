import { useState, useRef, useMemo } from 'react';
import mindmapData from '../../../data/mindmap.json';

/**
 * Custom hook to manage mindmap state
 */
export const useMindmapState = () => {
  const initialNodes = useMemo(() => {
    const jsonNodes = mindmapData.nodes || [];
    return jsonNodes.map((node) => ({
      id: node.id,
      text: node.data?.label || '',
      x: node.position?.x ?? 0,
      y: node.position?.y ?? 0,
      color: node.data?.color || '#e0f2fe',
      icon: node.data?.icon || '🧠',
      description: node.data?.description || ''
    }));
  }, []);

  const initialConnections = useMemo(() => {
    const jsonEdges = mindmapData.edges || [];
    return jsonEdges.map((edge) => ({
      from: edge.source,
      to: edge.target,
      label: edge.label || ''
    }));
  }, []);

  const [nodes, setNodes] = useState(initialNodes);

  const [connections, setConnections] = useState(initialConnections);

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
