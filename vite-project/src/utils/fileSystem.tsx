export interface VirtualFile {
  name: string;
  content: string;
  id?: string;
  children?: VirtualFile[];
}



export const defaultFiles: VirtualFile[] = [
  {
    name: "index.ts",
    content: `function greet(name: string) {
  return "Hello, " + name;
}

console.log(greet("World"));`,
  },
];
