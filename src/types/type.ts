// export interface FileNode {
//   id: string;
//   name: string;
//   type: 'folder' | 'file';
//   children?: FileNode[];
//   path: string;
// }

// export interface FileNodeType {
//   path: string;
//   name: string;
//   type: 'dir' | 'file';
//   children?: FileNodeType[];
//   extension?: string;
//   size?: number;
//   modified?: string;
// }


export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}