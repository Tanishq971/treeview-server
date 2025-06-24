// /lib/flowTransform.ts
import { FileNode } from './fsUtils';
import { Node, Edge } from 'reactflow';

let id = 0;
const getId = () => `node-${id++}`;

type LayoutResult = {
  nodes: Node[];
  edges: Edge[];
};

 function buildFlowLayout(file: FileNode, x = 0, y = 0, parentId?: string): LayoutResult {
  const nodeId = getId();
  const isFolder = file.type === 'folder';

  const current: Node = {
    id: nodeId,
    type: 'default',
    position: { x, y },
    data: { label: file.name, type: file.type },
    style: {
      padding: 8,
      borderRadius: 12,
      backgroundColor: isFolder ? '#2563eb' : '#1e293b',
      color: 'white',
      minWidth: 120,
      border: '1px solid #64748b',
    },
  };

  const nodes = [current];
  const edges: Edge[] = [];

  if (parentId) {
    edges.push({ id: `${parentId}->${nodeId}`, source: parentId, target: nodeId });
  }

  if (isFolder && file.children) {
    let offsetY = y + 120;
    let offsetX = x - (file.children.length * 120) / 2;

    for (const child of file.children) {
      const { nodes: childNodes, edges: childEdges } = buildFlowLayout(child, offsetX, offsetY, nodeId);
      nodes.push(...childNodes);
      edges.push(...childEdges);
      offsetX += 160;
    }
  }

  return { nodes, edges };
}


export default buildFlowLayout;