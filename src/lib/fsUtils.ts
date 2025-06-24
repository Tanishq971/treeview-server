// import fs from 'fs';
// import path from 'path';

// export type FileNode = {
//   name: string;
//   path: string;
//   type: 'file' | 'folder';
//   children?: FileNode[];
// };

// export function getFileTree(dirPath: string): FileNode {
//   const stats = fs.statSync(dirPath);
//   const node: FileNode = {
//     name: path.basename(dirPath),
//     path: dirPath,
//     type: stats.isDirectory() ? 'folder' : 'file',
//   };

//   if (stats.isDirectory()) {
//     const children = fs.readdirSync(dirPath);
//     node.children = children.map(child =>
//       getFileTree(path.join(dirPath, child))
//     );
//   }

//   return node;
// }


//new code 2nd version

import fs from 'fs';
import path from 'path';

export type FileNode = {
  name: string;
  path: string;
  type: 'file' | 'folder';
  extension?: string;
  size?: number;
  modified?: number;
  children?: FileNode[];
};

export function getFileTree(dirPath: string): FileNode {
  const stats = fs.statSync(dirPath);
  const ext = path.extname(dirPath);

  const node: FileNode = {
    name: path.basename(dirPath),
    path: dirPath,
    extension: ext,
    size: stats.size,
    modified: stats.mtimeMs,
    type: stats.isDirectory() ? 'folder' : 'file',
  };

  if (stats.isDirectory()) {
    const children = fs.readdirSync(dirPath).filter(name => name !== 'node_modules' && name !== '.git');
    node.children = children.map(child => getFileTree(path.join(dirPath, child)));
  }

  return node;
}
