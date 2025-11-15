import { useEffect } from 'react';
import { findFreePosition } from '../utils/mindmapUtils';

/**
 * Custom hook containing all event handlers for the mindmap
 */
export const useMindmapHandlers = (state) => {
  const {
    nodes,
    setNodes,
    connections,
    setConnections,
    draggedNode,
    setDraggedNode,
    setEditingNode,
    setSelectedNode,
    setHoveredNode,
    setEditingConnection,
    setSelectedConnection,
    draggingConnection,
    setDraggingConnection,
    connectionTarget,
    setConnectionTarget,
    offset,
    setOffset,
    zoom,
    setZoom,
    pan,
    setPan,
    isPanning,
    setIsPanning,
    panStart,
    setPanStart,
    canvasRef,
    justDraggedRef
  } = state;

  // Handle node mouse down (start drag)
  const handleMouseDown = (e, nodeId) => {
    if (e.detail === 2) return; // Prevent drag on double click
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    
    const nodeXpx = (node.x / 100) * rect.width;
    const nodeYpx = (node.y / 100) * rect.height;
    
    const startPos = { x: e.clientX, y: e.clientY };
    const offset = {
      x: (e.clientX - rect.left) / zoom - pan.x - nodeXpx,
      y: (e.clientY - rect.top) / zoom - pan.y - nodeYpx
    };
    
    e.currentTarget.dragData = { nodeId, startPos, offset, hasMoved: false };
  };

  // Handle mouse move (drag node or connection)
  const handleMouseMove = (e) => {
    // Handle panning
    if (isPanning && !draggedNode) {
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      setPan({ 
        x: pan.x + deltaX / zoom,
        y: pan.y + deltaY / zoom
      });
      setPanStart({ x: e.clientX, y: e.clientY });
      return;
    }
    
    // Check for potential drag
    const nodeElements = document.querySelectorAll('.mindmap-node');
    let dragData = null;
    
    nodeElements.forEach(el => {
      if (el.dragData) dragData = el.dragData;
    });
    
    if (dragData && !draggedNode) {
      const distance = Math.sqrt(
        Math.pow(e.clientX - dragData.startPos.x, 2) +
        Math.pow(e.clientY - dragData.startPos.y, 2)
      );
      
      if (distance > 5) {
        setDraggedNode(dragData.nodeId);
        setOffset(dragData.offset);
        dragData.hasMoved = true;
      }
    }
    
    // Handle node drag
    if (draggedNode) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newXpx = (e.clientX - rect.left) / zoom - pan.x - offset.x;
      const newYpx = (e.clientY - rect.top) / zoom - pan.y - offset.y;
      const newXpercent = (newXpx / rect.width) * 100;
      const newYpercent = (newYpx / rect.height) * 100;
      
      setNodes(prevNodes =>
        prevNodes.map(node =>
          node.id === draggedNode
            ? {
                ...node,
                x: Math.max(0, Math.min(100, newXpercent)),
                y: Math.max(0, Math.min(100, newYpercent))
              }
            : node
        )
      );
    } else if (draggingConnection) {
      // Update dragging connection position
      setDraggingConnection({
        ...draggingConnection,
        mouseX: e.clientX,
        mouseY: e.clientY
      });
    }
  };

  // Handle mouse up (end drag)
  const handleMouseUp = () => {
    const nodeElements = document.querySelectorAll('.mindmap-node');
    let hasMoved = false;
    nodeElements.forEach(el => {
      if (el.dragData && el.dragData.hasMoved) {
        hasMoved = true;
      }
    });
    
    if (hasMoved) {
      justDraggedRef.current = true;
      setTimeout(() => {
        justDraggedRef.current = false;
      }, 50);
    }
    
    nodeElements.forEach(el => {
      delete el.dragData;
    });
    
    // Complete connection if dragging
    if (draggingConnection && connectionTarget) {
      addConnection(draggingConnection.from, connectionTarget);
    }
    
    setDraggedNode(null);
    setDraggingConnection(null);
    setConnectionTarget(null);
    setIsPanning(false);
  };

  // Handle canvas mouse down (start panning)
  const handleCanvasMouseDown = (e) => {
    const isNodeOrButton = e.target.closest('.mindmap-node') || 
                          e.target.closest('button') || 
                          e.target.closest('input') ||
                          e.target.closest('textarea') ||
                          e.target.closest('.connection-label');
    
    if (!isNodeOrButton) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setSelectedNode(null);
      setSelectedConnection(null);
      e.preventDefault();
    }
  };

  // Zoom handlers
  const handleZoomIn = () => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const newZoom = Math.min(zoom * 1.2, 3);
    const zoomRatio = newZoom / zoom;
    
    setPan({
      x: pan.x + (centerX / zoom) * (1 - zoomRatio),
      y: pan.y + (centerY / zoom) * (1 - zoomRatio)
    });
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const newZoom = Math.max(zoom / 1.2, 0.3);
    const zoomRatio = newZoom / zoom;
    
    setPan({
      x: pan.x + (centerX / zoom) * (1 - zoomRatio),
      y: pan.y + (centerY / zoom) * (1 - zoomRatio)
    });
    setZoom(newZoom);
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.3, Math.min(3, zoom * zoomDelta));
    const zoomRatio = newZoom / zoom;
    
    setPan({
      x: pan.x + (mouseX / zoom) * (1 - zoomRatio),
      y: pan.y + (mouseY / zoom) * (1 - zoomRatio)
    });
    setZoom(newZoom);
  };

  // Node handlers
  const handleNodeTextChange = (nodeId, newText) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId ? { ...node, text: newText } : node
      )
    );
  };

  const handleColorChange = (nodeId, newColor) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId ? { ...node, color: newColor } : node
      )
    );
  };

  const handleIconChange = (nodeId, newIcon) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId ? { ...node, icon: newIcon } : node
      )
    );
  };

  const addNode = () => {
    const position = findFreePosition(nodes);

    // Generate a unique string id that won't conflict with existing ids
    const existingIds = new Set(nodes.map(n => String(n.id)));
    let counter = 1;
    let newId = `custom-${counter}`;
    while (existingIds.has(newId)) {
      counter += 1;
      newId = `custom-${counter}`;
    }

    const newNode = {
      id: newId,
      text: 'Nuovo nodo',
      x: position.x,
      y: position.y,
      color: '#f5f5f5',
      // Default to a generic icon name compatible with lucide-react mapping
      icon: 'Lightbulb'
    };
    setNodes(prevNodes => [...prevNodes, newNode]);
  };

  const deleteNode = (nodeId) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setConnections(connections.filter(c => c.from !== nodeId && c.to !== nodeId));
  };

  // Connection handlers
  const handleConnectionLabelChange = (fromId, toId, newLabel) => {
    setConnections(connections.map(conn => 
      conn.from === fromId && conn.to === toId ? { ...conn, label: newLabel } : conn
    ));
  };

  const addConnection = (fromId, toId) => {
    if (fromId === toId) return;
    const exists = connections.some(conn => conn.from === fromId && conn.to === toId);
    if (exists) return;
    
    setConnections([...connections, { from: fromId, to: toId, label: 'relazione' }]);
  };

  const deleteConnection = (fromId, toId) => {
    setConnections(connections.filter(conn => !(conn.from === fromId && conn.to === toId)));
  };

  // Setup event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggedNode, draggingConnection, isPanning, offset, pan, panStart, zoom]);

  // Setup wheel listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const wheelHandler = (e) => {
      e.preventDefault();
      handleWheel(e);
    };

    canvas.addEventListener('wheel', wheelHandler, { passive: false });
    return () => canvas.removeEventListener('wheel', wheelHandler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, pan]);

  // Force initial render and handle window resize
  useEffect(() => {
    if (canvasRef.current) {
      const timer = setTimeout(() => {
        setNodes(n => [...n]);
      }, 100);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setNodes(prevNodes => [...prevNodes]);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setNodes]);

  return {
    handleMouseDown,
    handleCanvasMouseDown,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
    handleNodeTextChange,
    handleColorChange,
    handleIconChange,
    handleConnectionLabelChange,
    addNode,
    deleteNode,
    addConnection,
    deleteConnection,
    setEditingNode,
    setSelectedNode,
    setHoveredNode,
    setEditingConnection,
    setSelectedConnection,
    setDraggingConnection,
    setConnectionTarget
  };
};
