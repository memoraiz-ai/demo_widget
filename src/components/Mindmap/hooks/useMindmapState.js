import { useState, useRef, useMemo, useEffect } from 'react';
import mindmapDataHigh from '../../../data/mindmap.json';
import mindmapDataMedium from '../../../data/mindmap_medium.json';
import mindmapDataLow from '../../../data/mindmap_low.json';

/**
 * Custom hook to manage mindmap state
 */
export const useMindmapState = (detailLevel = 'high') => {
  // Select the appropriate data file based on detail level
  const mindmapData = useMemo(() => {
    switch (detailLevel) {
      case 'low':
        return mindmapDataLow;
      case 'medium':
        return mindmapDataMedium;
      case 'high':
      default:
        return mindmapDataHigh;
    }
  }, [detailLevel]);

  const initialNodes = useMemo(() => {
    const jsonNodes = mindmapData.nodes || [];
    if (!jsonNodes.length) return [];

    // Extract original positions from JSON (they may be outside 0-100 range)
    const positions = jsonNodes.map((node) => ({
      x: typeof node.position?.x === 'number' ? node.position.x : 0,
      y: typeof node.position?.y === 'number' ? node.position.y : 0
    }));

    // Compute radial distance from the origin (0,0) used in the JSON
    const radii = positions.map((p) => Math.sqrt(p.x * p.x + p.y * p.y));
    const maxRadius = Math.max(...radii) || 1;

    // How far from the center the outermost nodes can go (in % of canvas)
    const MAX_RADIUS_PERCENT = 50;
    // Exponent closer to 1.0 preserves distances better, giving longer edges
    const RADIAL_EXPONENT = 1;

    const toPercentCoordinates = (x, y) => {
      const r = Math.sqrt(x * x + y * y);
      if (r === 0) {
        // Root node stays exactly at the center
        return { x: 50, y: 50 };
      }

      const angle = Math.atan2(y, x);
      const normalizedRadius =
        Math.pow(r / maxRadius, RADIAL_EXPONENT) * MAX_RADIUS_PERCENT;

      const px = 50 + normalizedRadius * Math.cos(angle);
      const py = 50 + normalizedRadius * Math.sin(angle);

      // Keep some margin so nodes are not cut off at the edges
      const margin = 3;
      return {
        x: Math.max(margin, Math.min(100 - margin, px)),
        y: Math.max(margin, Math.min(100 - margin, py))
      };
    };

    return jsonNodes.map((node, index) => {
      const pos = positions[index];
      const { x, y } = toPercentCoordinates(pos.x, pos.y);
      return {
        id: node.id,
        text: node.data?.label || '',
        x,
        y,
        color: node.data?.color || '#e0f2fe',
        icon: node.data?.icon || '🧠',
        description: node.data?.description || ''
      };
    });
  }, [mindmapData]);

  const initialConnections = useMemo(() => {
    const jsonEdges = mindmapData.edges || [];
    return jsonEdges.map((edge) => ({
      from: edge.source,
      to: edge.target,
      label: edge.label || ''
    }));
  }, [mindmapData]);

  const [nodes, setNodes] = useState(initialNodes);
  const [connections, setConnections] = useState(initialConnections);

  // Update state when detail level changes (which changes initialNodes/initialConnections)
  useEffect(() => {
    setNodes(initialNodes);
    setConnections(initialConnections);
    // Reset view/selection state when changing detail level
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
    setSelectedConnection(null);
  }, [initialNodes, initialConnections]);

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
