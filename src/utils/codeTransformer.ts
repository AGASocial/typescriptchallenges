export function transformCode(code: string): string {
  // Remove TypeScript type annotations
  const jsCode = code
    .replace(/:\s*[a-zA-Z<>[\]]+/g, '') // Remove type annotations
    .replace(/function\s+\w+\s*\(/g, 'function(') // Standardize function declaration
    .trim();
  
  // Ensure the code returns a function
  if (!jsCode.startsWith('function')) {
    return `function ${jsCode}`;
  }
  
  return jsCode;
}