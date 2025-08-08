import type { VirtualFile } from "./utils/fileSystem";

export const demoTemplates: VirtualFile[] = [
  {
    name: "main.ts",
    content: `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet("Taimoor"));`,
  },
  {
    name: "index.html",
    content: `<!DOCTYPE html>
<html>
<head>
  <title>Demo</title>
</head>
<body>
  <h1>Hello from HTML Template!</h1>
</body>
</html>`,
  },
  {
    name: "style.css",
    content: `body {
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
}`,
  },
];
