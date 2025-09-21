

export function validatePath() {
  // Allow direct routes under Vite dev server and built preview
  const allowedPaths = ['/index.html', '/login.html', '/'];
  const currentPath = window.location.pathname;
  const normalized = currentPath === '/' ? '/index.html' : currentPath;
  if (!allowedPaths.includes(normalized)) {
    window.location.href = './login.html';
  }
}
  

  
