"use client"

import dynamic from 'next/dynamic';

const TreeView2 = dynamic(() => import('@/components/TreeView2'), { ssr: false });

export default function FileTreeWrapper({ tree }: { tree: any }) {
  return <TreeView2 tree={tree} />;
}