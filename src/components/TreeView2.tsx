'use client';

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  Position,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

type TreeNode = { [key: string]: TreeNode | null };

let globalId = 0;

export default function FileTreeFlow({ tree }: { tree: TreeNode }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
const toggleFolder = useCallback(
  (
    nodeId: string,
    treeNode: TreeNode,
    depth: number,
    x: number
  ) => {
    const children: Node[] = [];
    const newEdges: Edge[] = [];

    const entries = Object.entries(treeNode).filter(([key]) => key !== 'node_modules');

    const folders = entries.filter(([_, val]) => val && typeof val === 'object');
    const files = entries.filter(([_, val]) => !val || typeof val !== 'object');

    const leftFolders = folders.slice(0, Math.ceil(folders.length / 2));
    const rightFolders = folders.slice(Math.ceil(folders.length / 2));

    const spacingX = 180;
    const spacingY = 140;

    // Layout folders (left)
    leftFolders.forEach(([key, value], index) => {
      const id = `${nodeId}-${globalId++}`;
      const isFolder = true;
      const offset = -(index + 1) * spacingX;

      children.push({
        id,
        position: { x: x + offset, y: (depth + 1) * spacingY },
        data: { label: key, treeNode: value, isFolder, depth: depth + 1 },
        style: {
          background: '#a7f3d0',
          padding: 10,
          borderRadius: 10,
          cursor: 'pointer',
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      });

      newEdges.push({ id: `e-${nodeId}-${id}`, source: nodeId, target: id });
    });

    // Layout folders (right)
    rightFolders.forEach(([key, value], index) => {
      const id = `${nodeId}-${globalId++}`;
      const isFolder = true;
      const offset = (index + 1) * spacingX;

      children.push({
        id,
        position: { x: x + offset, y: (depth + 1) * spacingY },
        data: { label: key, treeNode: value, isFolder, depth: depth + 1 },
        style: {
          background: '#a7f3d0',
          padding: 10,
          borderRadius: 10,
          cursor: 'pointer',
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      });

      newEdges.push({ id: `e-${nodeId}-${id}`, source: nodeId, target: id });
    });

    files.forEach(([key, value], index) => {
      const id = `${nodeId}-${globalId++}`;

      children.push({
        id,
        position: { x: x, y: (depth + 2 + index) * spacingY },
        data: { label: key, treeNode: value, isFolder: false, depth: depth + 1 },
        style: {
          background: '#93c5fd',
          padding: 10,
          borderRadius: 10,
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      });

      newEdges.push({ id: `e-${nodeId}-${id}`, source: nodeId, target: id });
    });

    setNodes((prev) => [...prev, ...children]);
    setEdges((prev) => [...prev, ...newEdges]);
  },
  [setNodes, setEdges]
);


  const onNodeClick = useCallback(
    (_: any, node: Node) => {
      if (!node.data?.isFolder) return;

      const id = node.id;
      const isOpen = expanded.has(id);
      const newSet = new Set(expanded);

      if (isOpen) {
        const toRemove = nodes.filter((n) => n.id.startsWith(`${id}-`)).map((n) => n.id);
        setNodes((prev) => prev.filter((n) => !toRemove.includes(n.id)));
        setEdges((prev) => prev.filter((e) => !toRemove.includes(e.target)));
        newSet.delete(id);
      } else {
        toggleFolder(id, node.data.treeNode, node.data.depth ?? 0, node.position.x);
        newSet.add(id);
      }

      setExpanded(newSet);
    },
    [expanded, toggleFolder, nodes, setNodes, setEdges]
  );

  const rootNode = useMemo(() => {
    const id = `node-${globalId++}`;
    return {
      id,
      position: { x: 0, y: 0 },
      data: {
        label: 'root',
        treeNode: tree,
        isFolder: true,
        depth: 0,
      },
      style: {
        background: '#a7f3d0',
        padding: 10,
        borderRadius: 10,
        cursor: 'pointer',
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    } as Node;
  }, [tree]);

  useEffect(() => {
    setNodes([rootNode]);
    setEdges([]);
  }, [rootNode]);

  return (
    <div style={{ height: '90vh', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
