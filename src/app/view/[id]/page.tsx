import FileTreeWrapper from '@/components/TreeViewWrapper';
import { PrismaClient } from '@/generated/prisma';
import { NextPage } from 'next';
const prisma = new PrismaClient()


type props = {
  params: any
  searchParams?: any
}
const ViewPage :NextPage<props> = async ({ params })=>{
 
  const fileTree = await prisma.fileTree.findUnique({
    where: { id: params.id }
  });

  if (!fileTree) {
    return <div>File tree not found.</div>;
  }

  return (
    <div className="w-full p-6 text-white bg-gray-900">
      <h1 className="text-2xl font-semibold mb-4">File Tree</h1>
      <FileTreeWrapper tree={fileTree.data} />
    </div>
  );
}


export default ViewPage;