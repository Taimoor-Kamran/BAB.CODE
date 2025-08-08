// src/types/pyodide.d.ts
export {};

declare global {
  function loadPyodide(config?: {
    indexURL?: string;
  }): Promise<PyodideInterface>;

  interface PyodideInterface {
    runPython: (code: string) => any;
    loadPackage: (packageName: string) => Promise<void>;
    // Add more methods as needed
  }
}
